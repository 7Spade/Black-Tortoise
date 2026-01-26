const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, 'src/app');
const layers = ['domain/modules', 'application', 'domain/core', 'domain/shared'];

function getDirectories(srcPath) {
  try {
    return fs.readdirSync(srcPath).filter(file => {
      try {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
      } catch (e) {
        return false;
      }
    });
  } catch (e) {
    return [];
  }
}

function hasTsFiles(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        return files.some(f => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'index.ts');
    } catch (e) {
        return false;
    }
}

function processDirectory(dirPath) {
    const subDirs = getDirectories(dirPath);
    
    // Check if this dir needs an index.ts
    // It needs index.ts if it has .ts files OR if it has subdirectories that are modules
    // But for simplicity, let's look at the specific structure we know is broken:
    // domain/modules/tasks/aggregates -> has .ts files, needs index.ts
    
    // First, process subdirectories recursively
    subDirs.forEach(sub => processDirectory(path.join(dirPath, sub)));

    // Now check if current directory needs index.ts
    if (hasTsFiles(dirPath)) {
        const indexPath = path.join(dirPath, 'index.ts');
        if (!fs.existsSync(indexPath)) {
            console.log(`Creating missing barrel: ${indexPath}`);
            const files = fs.readdirSync(dirPath)
                .filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts') && f !== 'index.ts')
                .map(f => f.replace('.ts', ''));
            
            const exports = files.map(f => `export * from './${f}';`).join('\n');
            fs.writeFileSync(indexPath, exports + '\n');
        }
    }
}

layers.forEach(layer => {
    const layerPath = path.join(rootDir, layer);
    if (fs.existsSync(layerPath)) {
        console.log(`Processing layer: ${layer}`);
        const modules = getDirectories(layerPath);
        modules.forEach(mod => {
            processDirectory(path.join(layerPath, mod));
        });
    }
});
