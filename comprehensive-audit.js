#!/usr/bin/env node
/**
 * Architecture Gate CI Script
 * 
 * Enforces architectural boundaries per PR comment 3796303220:
 * - Presentation layer: no EventBus/EventStore imports, no publish/append calls
 * - No store/signal mutations outside application event handlers
 * - Only PublishEventUseCase can call append/publish
 * - DomainEvent must include eventId/correlationId/causationId/timestamp/readonly payload
 * - EventStore append-only/immutable (basic static check)
 * - No allowlists except PublishEventUseCase and event handlers
 * 
 * Exit codes:
 * 0 = All checks passed
 * 1 = Architecture violations detected
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = 'src/app';
let violationsFound = 0;

/**
 * Get all TypeScript files recursively
 */
function getAllFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (item.endsWith('.ts') && !item.endsWith('.spec.ts')) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

/**
 * Check if path is in presentation layer
 */
function isPresentationLayer(filePath) {
  const rel = path.relative(SRC_DIR, filePath);
  return rel.startsWith('presentation' + path.sep);
}

/**
 * Check if path is application event handler
 */
function isEventHandler(filePath) {
  const rel = path.relative(SRC_DIR, filePath);
  return rel.includes('handlers') && 
         rel.includes('event-handler') &&
         rel.startsWith('application');
}

/**
 * Check if path is PublishEventUseCase
 */
function isPublishEventUseCase(filePath) {
  return filePath.endsWith('publish-event.use-case.ts');
}

/**
 * Report violation
 */
function reportViolation(filePath, line, rule, message) {
  const rel = path.relative('', filePath);
  console.error(`❌ VIOLATION: ${rel}:${line}`);
  console.error(`   Rule: ${rule}`);
  console.error(`   ${message}`);
  console.error('');
  violationsFound++;
}

/**
 * Rule 1: Presentation layer CANNOT import EventBus/EventStore
 */
function checkPresentationImports(filePath, content) {
  if (!isPresentationLayer(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for forbidden imports
    if (line.match(/from\s+['"]@domain\/event-bus\/event-bus\.interface['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import EventBus from domain layer'
      );
    }
    
    if (line.match(/from\s+['"]@domain\/event-store\/event-store\.interface['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import EventStore from domain layer'
      );
    }
    
    // Check for direct DomainEvent imports (should use facades/abstractions)
    if (line.match(/from\s+['"]@domain\/event\/domain-event['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import DomainEvent directly from domain layer'
      );
    }
  });
}

/**
 * Rule 2: Only PublishEventUseCase can call append/publish
 */
function checkEventPublishing(filePath, content) {
  // Allow PublishEventUseCase and event handlers
  if (isPublishEventUseCase(filePath) || isEventHandler(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for eventBus.publish calls
    if (line.match(/eventBus\.publish\s*\(/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Event Publishing Control',
        'Only PublishEventUseCase can call eventBus.publish()'
      );
    }
    
    // Check for eventStore.append calls
    if (line.match(/eventStore\.append\s*\(/) || line.match(/eventStore\.appendBatch\s*\(/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Event Store Immutability',
        'Only PublishEventUseCase can call eventStore.append()'
      );
    }
  });
}

/**
 * Rule 3: No store mutations in presentation layer (except via facades)
 */
function checkStoreMutations(filePath, content) {
  if (!isPresentationLayer(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for direct store method calls (set/update/patch)
    if (line.match(/\.(?:set|update|patch|mutate)\s*\(/)) {
      // Allow if it's a method definition, not a call
      if (line.trim().startsWith('//') || line.includes('function ') || line.match(/^\s*(?:public|private|protected)?.*\(.*\)\s*{?\s*$/)) {
        return;
      }
      
      reportViolation(
        filePath, 
        idx + 1, 
        'State Mutation Control',
        'Presentation layer CANNOT directly mutate stores (use facades/use cases)'
      );
    }
  });
}

/**
 * Rule 4: DomainEvent must have required fields with readonly payload
 */
function checkDomainEventStructure(filePath, content) {
  // Only check domain event definition files
  if (!filePath.endsWith('domain-event.ts') && !filePath.includes(path.sep + 'events' + path.sep)) return;
  
  const lines = content.split('\n');
  let inInterface = false;
  let interfaceName = '';
  let hasEventId = false;
  let hasCorrelationId = false;
  let hasCausationId = false;
  let hasTimestamp = false;
  let hasReadonlyPayload = false;
  
  lines.forEach((line, idx) => {
    // Track interface declarations
    if (line.match(/^export\s+interface\s+(\w+)/)) {
      const match = line.match(/^export\s+interface\s+(\w+)/);
      interfaceName = match[1];
      
      // Check if it's a DomainEvent (not just any interface)
      if (interfaceName.includes('Event') || interfaceName === 'DomainEvent') {
        inInterface = true;
        hasEventId = false;
        hasCorrelationId = false;
        hasCausationId = false;
        hasTimestamp = false;
        hasReadonlyPayload = false;
      }
    }
    
    if (inInterface) {
      if (line.match(/readonly\s+eventId\s*:/)) hasEventId = true;
      if (line.match(/readonly\s+correlationId\s*:/)) hasCorrelationId = true;
      if (line.match(/readonly\s+causationId\s*:/)) hasCausationId = true;
      if (line.match(/readonly\s+timestamp\s*:/)) hasTimestamp = true;
      if (line.match(/readonly\s+payload\s*:/)) hasReadonlyPayload = true;
      
      // End of interface
      if (line.match(/^}\s*$/)) {
        // Only validate if it's DomainEvent base interface
        const isBaseDomainEvent = interfaceName === 'DomainEvent';
        
        if (isBaseDomainEvent) {
          if (!hasEventId) {
            reportViolation(filePath, idx + 1, 'DomainEvent Structure', 
              `${interfaceName} must have readonly eventId`);
          }
          if (!hasCorrelationId) {
            reportViolation(filePath, idx + 1, 'DomainEvent Structure', 
              `${interfaceName} must have readonly correlationId`);
          }
          if (!hasCausationId) {
            reportViolation(filePath, idx + 1, 'DomainEvent Structure', 
              `${interfaceName} must have readonly causationId`);
          }
          if (!hasTimestamp) {
            reportViolation(filePath, idx + 1, 'DomainEvent Structure', 
              `${interfaceName} must have readonly timestamp`);
          }
          if (!hasReadonlyPayload) {
            reportViolation(filePath, idx + 1, 'DomainEvent Structure', 
              `${interfaceName} must have readonly payload`);
          }
        }
        
        inInterface = false;
        interfaceName = '';
      }
    }
  });
}

/**
 * Rule 5: EventStore must be append-only (no delete/update methods)
 */
function checkEventStoreImmutability(filePath, content) {
  // Only check EventStore interface/implementation files
  if (!filePath.includes('event-store')) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for delete/update/remove methods
    if (line.match(/\b(?:delete|remove|update|modify|edit)\s*\(/i)) {
      // Allow in comments or string literals
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('"') || line.includes("'")) {
        return;
      }
      
      reportViolation(
        filePath, 
        idx + 1, 
        'EventStore Immutability',
        'EventStore must be append-only (no delete/update/modify methods)'
      );
    }
  });
}

/**
 * Rule 6: Stores must be in application layer only
 */
function checkStoreLocation(filePath) {
  // Skip if not a store file
  if (!filePath.endsWith('.store.ts')) return;
  
  const rel = path.relative(SRC_DIR, filePath);
  
  // Stores must be in application layer
  if (!rel.startsWith('application')) {
    reportViolation(
      filePath, 
      1, 
      'Store Layer Placement',
      'Stores MUST be in application layer, not in presentation or domain'
    );
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Running Architecture Gate CI...\n');
  console.log('Enforcing rules from PR comment 3796303220:\n');
  console.log('  ✓ Presentation layer isolation');
  console.log('  ✓ Event publishing control');
  console.log('  ✓ State mutation control');
  console.log('  ✓ DomainEvent structure validation');
  console.log('  ✓ EventStore immutability');
  console.log('  ✓ Store layer placement\n');
  
  const files = getAllFiles(SRC_DIR);
  
  console.log(`Scanning ${files.length} TypeScript files...\n`);
  
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Run all checks
    checkPresentationImports(filePath, content);
    checkEventPublishing(filePath, content);
    checkStoreMutations(filePath, content);
    checkDomainEventStructure(filePath, content);
    checkEventStoreImmutability(filePath, content);
    checkStoreLocation(filePath);
  }
  
  if (violationsFound === 0) {
    console.log('✅ All architecture checks passed!\n');
    process.exit(0);
  } else {
    console.error(`\n💥 Found ${violationsFound} architecture violation(s)!\n`);
    console.error('Please fix the violations above to maintain architectural integrity.\n');
    process.exit(1);
  }
}

main();
            importPath: importPath,
            lineContent: line.trim(),
            fix: 'Remove framework dependency from domain layer. Domain must be pure TypeScript.'
          };
          violations.push(violation);
          fileAnalysis[relPath].violations.push(violation);
        }
      }
    }
    
    // Determine imported layer
    let importedLayer = null;
    const layerPatterns = [
      { pattern: /\/domain\/|@domain/, layer: 'domain' },
      { pattern: /\/application\/|@application/, layer: 'application' },
      { pattern: /\/infrastructure\/|@infrastructure/, layer: 'infrastructure' },
      { pattern: /\/presentation\/|@presentation/, layer: 'presentation' },
    ];
    
    for (const { pattern, layer } of layerPatterns) {
      if (pattern.test(importPath)) {
        importedLayer = layer;
        break;
      }
    }
    
    if (!importedLayer) return;
    
    // Check dependency rules
    let isViolation = false;
    let violationType = null;
    let severity = 'HIGH';
    let fixSuggestion = '';
    
    if (currentLayer === 'domain' && importedLayer !== 'domain') {
      isViolation = true;
      violationType = 'domain-to-other';
      severity = 'CRITICAL';
      fixSuggestion = 'Domain layer MUST NOT depend on any other layer. Move this dependency to Application or Infrastructure.';
    }
    
    if (currentLayer === 'application') {
      if (importedLayer === 'infrastructure') {
        isViolation = true;
        violationType = 'application-to-infrastructure';
        fixSuggestion = 'Application MUST NOT depend on concrete Infrastructure. Use interfaces/abstractions instead.';
      } else if (importedLayer === 'presentation') {
        isViolation = true;
        violationType = 'application-to-presentation';
        fixSuggestion = 'Application MUST NOT depend on Presentation. Move the dependency to Application layer.';
      }
    }
    
    if (currentLayer === 'presentation') {
      if (importedLayer === 'domain') {
        isViolation = true;
        violationType = 'presentation-to-domain';
        fixSuggestion = 'Presentation MUST NOT directly use Domain. Use Application facades/stores instead.';
      } else if (importedLayer === 'infrastructure') {
        isViolation = true;
        violationType = 'presentation-to-infrastructure';
        fixSuggestion = 'Presentation MUST NOT directly use Infrastructure. Use Application facades/stores instead.';
      }
    }
    
    if (isViolation) {
      const violation = {
        severity,
        layer: currentLayer,
        file: relPath,
        line: idx + 1,
        issue: `${currentLayer} → ${importedLayer}: ${importPath}`,
        type: violationType,
        importPath: importPath,
        lineContent: line.trim(),
        fix: fixSuggestion
      };
      violations.push(violation);
      fileAnalysis[relPath].violations.push(violation);
    }
  });
}

function findTsFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath));
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const appDir = path.join(process.cwd(), 'src/app');
const tsFiles = findTsFiles(appDir);

console.log(`\n🔍 Comprehensive DDD/Clean Architecture Audit\n`);
console.log(`Analyzing ${tsFiles.length} TypeScript files...\n`);
tsFiles.forEach(analyzeFile);

// Group violations by type
const violationsByType = {};
violations.forEach(v => {
  if (!violationsByType[v.type]) violationsByType[v.type] = [];
  violationsByType[v.type].push(v);
});

// Group files by layer
const filesByLayer = { domain: [], application: [], infrastructure: [], presentation: [] };
Object.entries(fileAnalysis).forEach(([file, data]) => {
  if (data.layer) filesByLayer[data.layer].push(file);
});

console.log('═══════════════════════════════════════════════════════════════');
console.log('📊 AUDIT SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');
console.log(`Total files analyzed: ${tsFiles.length}`);
console.log(`Violations found: ${violations.length}\n`);

console.log('Files by Layer:');
console.log(`  Domain:         ${filesByLayer.domain.length} files`);
console.log(`  Application:    ${filesByLayer.application.length} files`);
console.log(`  Infrastructure: ${filesByLayer.infrastructure.length} files`);
console.log(`  Presentation:   ${filesByLayer.presentation.length} files\n`);

if (violations.length === 0) {
  console.log('✅ NO VIOLATIONS FOUND - Architecture is compliant!\n');
} else {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('❌ VIOLATIONS BY TYPE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  Object.keys(violationsByType).sort().forEach(type => {
    const viols = violationsByType[type];
    const severityEmoji = viols[0].severity === 'CRITICAL' ? '🔴' : '🟡';
    console.log(`${severityEmoji} ${type.toUpperCase()}: ${viols.length} violation(s)\n`);
    
    viols.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.file}:${v.line}`);
      console.log(`     Issue: ${v.issue}`);
      console.log(`     Code:  ${v.lineContent}`);
      console.log(`     Fix:   ${v.fix}\n`);
    });
  });
}

// Save report
const report = {
  summary: {
    totalFiles: tsFiles.length,
    violationCount: violations.length,
    filesByLayer: {
      domain: filesByLayer.domain.length,
      application: filesByLayer.application.length,
      infrastructure: filesByLayer.infrastructure.length,
      presentation: filesByLayer.presentation.length,
    }
  },
  violations,
  fileAnalysis
};

fs.writeFileSync('comprehensive-audit-report.json', JSON.stringify(report, null, 2));
console.log('═══════════════════════════════════════════════════════════════');
console.log('📝 Detailed report saved to: comprehensive-audit-report.json');
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(violations.length > 0 ? 1 : 0);
