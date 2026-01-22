#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const violations = [];
const validImports = [];

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Determine layer from file path
  const relPath = path.relative(process.cwd(), filePath);
  let currentLayer = null;
  
  if (relPath.includes('/domain/')) currentLayer = 'domain';
  else if (relPath.includes('/application/')) currentLayer = 'application';
  else if (relPath.includes('/infrastructure/')) currentLayer = 'infrastructure';
  else if (relPath.includes('/presentation/')) currentLayer = 'presentation';
  else return; // Skip files not in DDD layers
  
  lines.forEach((line, idx) => {
    const importMatch = line.match(/^\s*import\s+.*?\s+from\s+['"](.+?)['"]/);
    if (!importMatch) return;
    
    const importPath = importMatch[1];
    let importedLayer = null;
    
    // Check for Angular/RxJS/Firebase framework imports
    if (currentLayer === 'domain') {
      if (importPath.startsWith('@angular/') || 
          importPath.startsWith('rxjs') || 
          importPath.startsWith('@angular/fire') ||
          importPath.startsWith('firebase/')) {
        violations.push({
          severity: 'CRITICAL',
          from: relPath,
          line: idx + 1,
          issue: `Domain layer importing framework: ${importPath}`,
          type: 'domain-framework-dependency',
          fix: 'Remove framework dependency from domain layer'
        });
      }
    }
    
    // Check layer-to-layer imports
    if (importPath.includes('/domain/')) importedLayer = 'domain';
    else if (importPath.includes('/application/')) importedLayer = 'application';
    else if (importPath.includes('/infrastructure/')) importedLayer = 'infrastructure';
    else if (importPath.includes('/presentation/')) importedLayer = 'presentation';
    else if (importPath.startsWith('@domain')) importedLayer = 'domain';
    else if (importPath.startsWith('@application')) importedLayer = 'application';
    else if (importPath.startsWith('@infrastructure')) importedLayer = 'infrastructure';
    else if (importPath.startsWith('@presentation')) importedLayer = 'presentation';
    
    if (!importedLayer) return;
    
    // Define violation rules
    const isViolation = 
      (currentLayer === 'domain' && importedLayer !== 'domain') ||
      (currentLayer === 'application' && (importedLayer === 'infrastructure' || importedLayer === 'presentation')) ||
      (currentLayer === 'presentation' && (importedLayer === 'domain' || importedLayer === 'infrastructure'));
    
    if (isViolation) {
      violations.push({
        severity: 'HIGH',
        from: relPath,
        line: idx + 1,
        issue: `${currentLayer} → ${importedLayer}: ${importPath}`,
        type: `${currentLayer}-to-${importedLayer}`,
        importPath: importPath,
        lineContent: line.trim()
      });
    } else {
      validImports.push({ from: currentLayer, to: importedLayer, file: relPath });
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

console.log(`Analyzing ${tsFiles.length} TypeScript files...`);
tsFiles.forEach(analyzeFile);

console.log('\n=== DEPENDENCY AUDIT REPORT ===\n');
console.log(`Total files analyzed: ${tsFiles.length}`);
console.log(`Violations found: ${violations.length}`);
console.log(`Valid imports: ${validImports.length}\n`);

// Group violations by type
const violationsByType = {};
violations.forEach(v => {
  if (!violationsByType[v.type]) violationsByType[v.type] = [];
  violationsByType[v.type].push(v);
});

console.log('=== VIOLATIONS BY TYPE ===\n');
Object.keys(violationsByType).sort().forEach(type => {
  const viols = violationsByType[type];
  console.log(`${type}: ${viols.length} violations`);
  viols.forEach((v, i) => {
    console.log(`  ${i+1}. ${v.from}:${v.line}`);
    console.log(`     Issue: ${v.issue}`);
    if (v.lineContent) console.log(`     Code: ${v.lineContent}`);
  });
  console.log('');
});

// Export for programmatic use
fs.writeFileSync('ddd-violations.json', JSON.stringify({ violations, validImports }, null, 2));
console.log('Detailed report saved to: ddd-violations.json');

process.exit(violations.length > 0 ? 1 : 0);
