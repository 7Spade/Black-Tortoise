const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, 'src/app/domain');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if(file.endsWith('.ts')) {
          arrayOfFiles.push(path.join(dirPath, "", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(rootDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Replace ../value-objects/something.vo with ../value-objects
    // Regex matches: from '.../value-objects/...' 
    // We want to stop at the folder name.
    
    // Pattern: form '../value-objects/xyz.vo' -> form '../value-objects'
    // Pattern: form '../../value-objects/xyz.vo' -> form '../../value-objects'
    
    // We can do this for: value-objects, aggregates, events, policies, repositories, entities
    
    const modules = ['value-objects', 'aggregates', 'events', 'policies', 'repositories', 'entities'];
    
    modules.forEach(mod => {
        // Regex: from '(.*/mod)/[^']+'
        // Ensure we don't match if it already ends with /mod or /mod/index
        const regex = new RegExp(`from '((?:\\.\\./)+${mod})/[^']+'`, 'g');
        content = content.replace(regex, "from '$1'");
    });

    if (content !== originalContent) {
        console.log(`Updating imports in ${file}`);
        fs.writeFileSync(file, content);
    }
});
