#!/usr/bin/env node
/**
 * Architecture Gate CI Script
 * 
 * Enforces event-sourcing and DDD architectural invariants per comment_id 3796470142:
 * - Presentation layer: no EventBus/EventStore/DomainEvent imports
 * - ONLY PublishEventUseCase and event handlers can call eventBus.publish() or eventStore.append()
 * - Stores MUST be in application layer only
 * - No parallel append/publish (must be sequential)
 * - Event handlers MUST propagate correlationId and set causationId
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
  if (!fs.existsSync(dir)) return fileList;
  
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
 * Rule 1: Presentation layer CANNOT import EventBus/EventStore/DomainEvent
 */
function checkPresentationImports(filePath, content) {
  if (!isPresentationLayer(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Check for forbidden imports
    if (line.match(/from\s+['"]@domain\/event-bus['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import EventBus from domain layer'
      );
    }
    
    if (line.match(/from\s+['"]@domain\/event-store['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import EventStore from domain layer'
      );
    }
    
    if (line.match(/from\s+['"]@domain\/event['"]/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Presentation Layer Isolation',
        'Presentation layer CANNOT import DomainEvent from domain layer'
      );
    }
  });
}

/**
 * Rule 2: Only PublishEventUseCase and event handlers can call append/publish
 */
function checkEventPublishing(filePath, content) {
  // Allow PublishEventUseCase and event handlers
  if (isPublishEventUseCase(filePath) || isEventHandler(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    // Check for eventBus.publish calls
    if (line.match(/eventBus\.publish\s*\(/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Event Publishing Control',
        'Only PublishEventUseCase and event handlers can call eventBus.publish()'
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
 * Rule 3: Stores must be in application layer only
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
      'Stores MUST be in application layer (src/app/application/**/stores/)'
    );
  }
}

/**
 * Rule 4: No parallel append/publish (must be sequential)
 */
function checkSequentialPublish(filePath, content) {
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    // Check for Promise.all with eventBus.publish or eventStore.append
    if (line.match(/Promise\.all.*\[.*event(Bus|Store)\.(publish|append)/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Sequential Append-Before-Publish',
        'Events MUST be appended and published sequentially (no Promise.all)'
      );
    }
  });
}

/**
 * Rule 5: Event handlers must propagate correlationId and set causationId
 */
function checkCausalityPropagation(filePath, content) {
  if (!isEventHandler(filePath)) return;
  
  const lines = content.split('\n');
  let hasEventCreation = false;
  let hasCorrelationId = false;
  let hasCausationId = false;
  
  lines.forEach((line, idx) => {
    // Check if this handler creates events
    if (line.match(/eventType:\s*['"]/) || line.match(/createEvent\s*\(/)) {
      hasEventCreation = true;
    }
    
    // Check for correlationId
    if (line.match(/correlationId:\s*event\.correlationId/) || 
        line.match(/correlationId:\s*\w+\.correlationId/)) {
      hasCorrelationId = true;
    }
    
    // Check for causationId
    if (line.match(/causationId:\s*event\.eventId/) || 
        line.match(/causationId:\s*\w+\.eventId/)) {
      hasCausationId = true;
    }
  });
  
  if (hasEventCreation && !hasCorrelationId) {
    reportViolation(
      filePath, 
      1, 
      'Event Causality Propagation',
      'Event handler MUST propagate correlationId from parent event'
    );
  }
  
  if (hasEventCreation && !hasCausationId) {
    reportViolation(
      filePath, 
      1, 
      'Event Causality Propagation',
      'Event handler MUST set causationId to parent event.eventId'
    );
  }
}

/**
 * Rule 6: No RxJS in presentation (prefer signals)
 */
function checkRxJsUsage(filePath, content) {
  if (!isPresentationLayer(filePath)) return;
  
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    
    // Check for RxJS imports (excluding rxjs/operators for interop)
    if (line.match(/from\s+['"]rxjs['"]/) && !line.match(/rxjs\/operators/)) {
      reportViolation(
        filePath, 
        idx + 1, 
        'Signal-First Architecture',
        'Presentation layer should use Angular Signals instead of RxJS (warning)'
      );
    }
  });
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Running Event-Sourcing Architecture Gate...');
  console.log('');
  console.log('Enforcing rules from comment_id 3796470142:');
  console.log('');
  console.log('  ✓ Presentation layer isolation (no EventBus/EventStore imports)');
  console.log('  ✓ Event publishing control (only PublishEventUseCase)');
  console.log('  ✓ Store layer placement (application only)');
  console.log('  ✓ Sequential append-before-publish');
  console.log('  ✓ Event causality propagation (correlationId, causationId)');
  console.log('  ✓ Signal-first architecture (minimal RxJS)');
  console.log('');
  
  const files = getAllFiles(SRC_DIR);
  
  console.log(`Scanning ${files.length} TypeScript files...`);
  console.log('');
  
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Run all checks
    checkPresentationImports(filePath, content);
    checkEventPublishing(filePath, content);
    checkStoreLocation(filePath);
    checkSequentialPublish(filePath, content);
    checkCausalityPropagation(filePath, content);
    checkRxJsUsage(filePath, content);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  if (violationsFound === 0) {
    console.log('✅ All architecture checks passed!');
    console.log('');
    process.exit(0);
  } else {
    console.error(`💥 Found ${violationsFound} architecture violation(s)!`);
    console.error('');
    console.error('Please fix the violations above to maintain architectural integrity.');
    console.error('See .architectural-rules.md for detailed rules.');
    console.error('');
    process.exit(1);
  }
}

main();

