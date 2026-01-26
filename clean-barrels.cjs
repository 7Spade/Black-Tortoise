const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, 'src/app');
const layers = ['domain/modules', 'application', 'domain/core', 'domain/shared'];

function cleanIndexFile(dirPath) {
    const indexPath = path.join(dirPath, 'index.ts');
    if (!fs.existsSync(indexPath)) return;

    let content = fs.readFileSync(indexPath, 'utf8');
    const lines = content.split('\n');
    let newContent = [];
    let modified = false;

    lines.forEach(line => {
        const match = line.match(/export \* from '.\/(.*)';/);
        if (match) {
            const exportPath = match[1];
            // Check if directory exists
            const fullPathDir = path.join(dirPath, exportPath);
            const fullPathFile = path.join(dirPath, exportPath + '.ts');
            
            let exists = false;
            
            if (fs.existsSync(fullPathFile)) {
                exists = true;
            } else if (fs.existsSync(fullPathDir)) {
                // Check if directory has index.ts
                if (fs.existsSync(path.join(fullPathDir, 'index.ts'))) {
                    exists = true;
                }
            }

            if (exists) {
                newContent.push(line);
            } else {
                console.log(`Removing invalid export "${line}" from ${indexPath}`);
                modified = true;
            }
        } else {
            newContent.push(line);
        }
    });

    if (modified) {
        fs.writeFileSync(indexPath, newContent.join('\n'));
    }
}

layers.forEach(layer => {
    const layerPath = path.join(rootDir, layer);
    if (fs.existsSync(layerPath)) {
        const modules = fs.readdirSync(layerPath).filter(f => fs.statSync(path.join(layerPath, f)).isDirectory());
        modules.forEach(mod => {
            cleanIndexFile(path.join(layerPath, mod));
        });
    }
});
