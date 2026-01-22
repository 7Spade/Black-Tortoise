#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const violations = [];
const fileAnalysis = {};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const relPath = path.relative(process.cwd(), filePath);
  let currentLayer = null;
  
  if (relPath.includes('/domain/')) currentLayer = 'domain';
  else if (relPath.includes('/application/')) currentLayer = 'application';
  else if (relPath.includes('/infrastructure/')) currentLayer = 'infrastructure';
  else if (relPath.includes('/presentation/')) currentLayer = 'presentation';
  else return;
  
  fileAnalysis[relPath] = { layer: currentLayer, imports: [], violations: [] };
  
  lines.forEach((line, idx) => {
    const importMatch = line.match(/^\s*import\s+.*?\s+from\s+['"](.+?)['"]/);
    if (!importMatch) return;
    
    const importPath = importMatch[1];
    fileAnalysis[relPath].imports.push({ line: idx + 1, path: importPath });
    
    // Check for framework dependencies in domain layer
    if (currentLayer === 'domain') {
      const frameworkPatterns = [
        '@angular/',
        'rxjs',
        '@angular/fire',
        'firebase/',
        '@ngrx/',
        'zone.js',
      ];
      
      for (const pattern of frameworkPatterns) {
        if (importPath.startsWith(pattern)) {
          const violation = {
            severity: 'CRITICAL',
            layer: currentLayer,
            file: relPath,
            line: idx + 1,
            issue: `Domain layer MUST NOT import framework: ${importPath}`,
            type: 'domain-framework-dependency',
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
