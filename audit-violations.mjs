import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const violations = [];
const files = [];

function getAllFiles(dir, fileList = []) {
  const items = readdirSync(dir);
  items.forEach(item => {
    const fullPath = join(dir, item);
    if (statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (item.endsWith('.ts') && !item.endsWith('.spec.ts')) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

function determineLayer(filePath) {
  if (filePath.includes('/domain/')) return 'domain';
  if (filePath.includes('/application/')) return 'application';
  if (filePath.includes('/infrastructure/')) return 'infrastructure';
  if (filePath.includes('/presentation/')) return 'presentation';
  return 'unknown';
}

function checkDomainViolations(filePath, content) {
  const issues = [];
  
  // Rule 9-11: Domain must be pure TS
  const forbiddenImports = [
    '@angular/',
    'rxjs',
    '@ngrx',
    'firebase',
    '@firebase',
    'zone.js'
  ];
  
  forbiddenImports.forEach(forbidden => {
    if (content.includes(`from '${forbidden}`) || content.includes(`from "${forbidden}`)) {
      issues.push({
        rule: 'Domain-Import-Violation',
        clause: 'Rules 9-11',
        detail: `Domain imports forbidden framework: ${forbidden}`
      });
    }
  });
  
  // Check for async/await
  if (content.match(/\basync\s+\w+\s*\(/) || content.match(/\bawait\s+/)) {
    issues.push({
      rule: 'Domain-Async-Violation',
      clause: 'Rule 11',
      detail: 'Domain contains async/await'
    });
  }
  
  return issues;
}

function checkApplicationViolations(filePath, content) {
  const issues = [];
  
  // Rule 131: No BehaviorSubject
  if (content.includes('BehaviorSubject') || content.includes('Subject')) {
    issues.push({
      rule: 'No-RxJS-Subjects',
      clause: 'Rule 131',
      detail: 'Application uses BehaviorSubject/Subject instead of signalStore'
    });
  }
  
  // Check if using manual subscribe
  if (content.match(/\.subscribe\s*\(/)) {
    issues.push({
      rule: 'No-Manual-Subscribe',
      clause: 'Rule 131, Zone-less requirement',
      detail: 'Manual subscribe detected - must use signals/rxMethod'
    });
  }
  
  return issues;
}

function checkInfrastructureViolations(filePath, content) {
  const issues = [];
  
  // Rule 30: No business logic
  const businessKeywords = ['validate', 'calculate', 'decide', 'approve', 'reject'];
  businessKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\w*\\s*\\(`, 'i');
    if (regex.test(content)) {
      issues.push({
        rule: 'Infrastructure-Business-Logic',
        clause: 'Rule 30',
        detail: `Infrastructure may contain business logic: ${keyword}`
      });
    }
  });
  
  return issues;
}

function checkPresentationViolations(filePath, content) {
  const issues = [];
  
  // Rule 39: No direct Infrastructure calls
  if (content.match(/from ['"].*\/infrastructure\//)) {
    issues.push({
      rule: 'Presentation-Infrastructure-Coupling',
      clause: 'Rule 39',
      detail: 'Presentation directly imports from Infrastructure'
    });
  }
  
  // Rule 40: No direct Domain access
  if (content.match(/from ['"].*\/domain\//) && !filePath.includes('facade')) {
    issues.push({
      rule: 'Presentation-Domain-Coupling',
      clause: 'Rule 40',
      detail: 'Presentation directly imports from Domain (should use Facade)'
    });
  }
  
  return issues;
}

function checkCrossLayerViolations(filePath, content, layer) {
  const issues = [];
  
  // Extract all imports
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Determine imported layer
    let importedLayer = null;
    if (importPath.includes('/domain/')) importedLayer = 'domain';
    else if (importPath.includes('/application/')) importedLayer = 'application';
    else if (importPath.includes('/infrastructure/')) importedLayer = 'infrastructure';
    else if (importPath.includes('/presentation/')) importedLayer = 'presentation';
    
    if (!importedLayer) continue;
    
    // Check forbidden dependencies (Rule 5-8)
    const layerOrder = ['domain', 'application', 'infrastructure', 'presentation'];
    const currentIndex = layerOrder.indexOf(layer);
    const importedIndex = layerOrder.indexOf(importedLayer);
    
    if (importedIndex > currentIndex) {
      issues.push({
        rule: 'Reverse-Dependency',
        clause: 'Rules 5-8',
        detail: `${layer} imports from ${importedLayer}: ${importPath}`
      });
    }
  }
  
  return issues;
}

// Scan all files
const allFiles = getAllFiles('src/app');

allFiles.forEach(filePath => {
  const content = readFileSync(filePath, 'utf-8');
  const layer = determineLayer(filePath);
  const relPath = relative('src/app', filePath);
  
  let fileViolations = [];
  
  if (layer === 'domain') {
    fileViolations = checkDomainViolations(filePath, content);
  } else if (layer === 'application') {
    fileViolations = checkApplicationViolations(filePath, content);
  } else if (layer === 'infrastructure') {
    fileViolations = checkInfrastructureViolations(filePath, content);
  } else if (layer === 'presentation') {
    fileViolations = checkPresentationViolations(filePath, content);
  }
  
  // Check cross-layer violations for all layers
  if (layer !== 'unknown') {
    fileViolations.push(...checkCrossLayerViolations(filePath, content, layer));
  }
  
  if (fileViolations.length > 0) {
    violations.push({
      file: relPath,
      layer,
      violations: fileViolations
    });
  }
});

console.log(JSON.stringify(violations, null, 2));
console.log(`\n=== SUMMARY ===`);
console.log(`Total files scanned: ${allFiles.length}`);
console.log(`Files with violations: ${violations.length}`);
console.log(`Total violation count: ${violations.reduce((sum, v) => sum + v.violations.length, 0)}`);
