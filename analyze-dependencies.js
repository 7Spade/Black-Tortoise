#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LAYERS = {
  DOMAIN: 'domain',
  APPLICATION: 'application',
  INFRASTRUCTURE: 'infrastructure',
  PRESENTATION: 'presentation'
};

const LAYER_ORDER = [
  LAYERS.DOMAIN,
  LAYERS.APPLICATION,
  LAYERS.INFRASTRUCTURE,
  LAYERS.PRESENTATION
];

const violations = {
  domain: [],
  application: [],
  presentation: [],
  infrastructure: []
};

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function getLayerFromPath(filePath) {
  if (filePath.includes('/domain/')) return LAYERS.DOMAIN;
  if (filePath.includes('/application/')) return LAYERS.APPLICATION;
  if (filePath.includes('/infrastructure/')) return LAYERS.INFRASTRUCTURE;
  if (filePath.includes('/presentation/')) return LAYERS.PRESENTATION;
  return null;
}

function extractImports(content) {
  const importRegex = /import\s+(?:{[^}]*}|[\w*\s,]+)\s+from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceLayer = getLayerFromPath(filePath);
  
  if (!sourceLayer) return;
  
  const imports = extractImports(content);
  const relativePath = filePath.replace(/.*\/src\/app\//, '');
  
  imports.forEach(importPath => {
    // Skip external dependencies
    if (!importPath.startsWith('.') && !importPath.startsWith('@app/')) {
      return;
    }
    
    // Resolve relative imports
    let resolvedPath = importPath;
    if (importPath.startsWith('.')) {
      const dir = path.dirname(filePath);
      resolvedPath = path.resolve(dir, importPath);
    }
    
    const targetLayer = getLayerFromPath(resolvedPath);
    
    if (!targetLayer) return;
    
    // Check for violations
    const sourceIndex = LAYER_ORDER.indexOf(sourceLayer);
    const targetIndex = LAYER_ORDER.indexOf(targetLayer);
    
    // Domain can only import domain
    if (sourceLayer === LAYERS.DOMAIN && targetLayer !== LAYERS.DOMAIN) {
      violations.domain.push({
        file: relativePath,
        import: importPath,
        violation: `Domain importing ${targetLayer}`
      });
    }
    
    // Application can only import domain and application
    if (sourceLayer === LAYERS.APPLICATION && 
        targetLayer !== LAYERS.DOMAIN && 
        targetLayer !== LAYERS.APPLICATION) {
      violations.application.push({
        file: relativePath,
        import: importPath,
        violation: `Application importing ${targetLayer}`
      });
    }
    
    // Presentation should only import application and presentation (via facades/stores)
    if (sourceLayer === LAYERS.PRESENTATION && targetLayer === LAYERS.INFRASTRUCTURE) {
      violations.presentation.push({
        file: relativePath,
        import: importPath,
        violation: `Presentation importing infrastructure directly`
      });
    }
    
    if (sourceLayer === LAYERS.PRESENTATION && targetLayer === LAYERS.DOMAIN) {
      violations.presentation.push({
        file: relativePath,
        import: importPath,
        violation: `Presentation importing domain directly`
      });
    }
  });
}

// Analyze all layers
const srcDir = path.join(process.cwd(), 'src/app');

['domain', 'application', 'infrastructure', 'presentation'].forEach(layer => {
  const layerDir = path.join(srcDir, layer);
  if (fs.existsSync(layerDir)) {
    const files = getAllFiles(layerDir);
    files.forEach(analyzeFile);
  }
});

// Print results
console.log('\n=== DEPENDENCY BOUNDARY VIOLATIONS ===\n');

console.log('📦 DOMAIN LAYER VIOLATIONS (Domain must be pure - no outer layer dependencies)');
console.log('─'.repeat(80));
if (violations.domain.length === 0) {
  console.log('✅ No violations found\n');
} else {
  violations.domain.forEach(v => {
    console.log(`❌ ${v.file}`);
    console.log(`   Import: ${v.import}`);
    console.log(`   Issue: ${v.violation}\n`);
  });
}

console.log('📦 APPLICATION LAYER VIOLATIONS (Application can only import Domain)');
console.log('─'.repeat(80));
if (violations.application.length === 0) {
  console.log('✅ No violations found\n');
} else {
  violations.application.forEach(v => {
    console.log(`❌ ${v.file}`);
    console.log(`   Import: ${v.import}`);
    console.log(`   Issue: ${v.violation}\n`);
  });
}

console.log('📦 PRESENTATION LAYER VIOLATIONS (Presentation should only use Facades/Stores)');
console.log('─'.repeat(80));
if (violations.presentation.length === 0) {
  console.log('✅ No violations found\n');
} else {
  violations.presentation.forEach(v => {
    console.log(`❌ ${v.file}`);
    console.log(`   Import: ${v.import}`);
    console.log(`   Issue: ${v.violation}\n`);
  });
}

// Summary
const totalViolations = 
  violations.domain.length + 
  violations.application.length + 
  violations.presentation.length;

console.log('='.repeat(80));
console.log(`Total Violations: ${totalViolations}`);
console.log('='.repeat(80));

process.exit(totalViolations > 0 ? 1 : 0);
