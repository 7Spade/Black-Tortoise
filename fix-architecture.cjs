const fs = require('fs');
const path = require('path');

const DOMAIN_ROOT = path.join(__dirname, 'src/app/domain/modules');
const APP_ROOT = path.join(__dirname, 'src/app/application');
const MODULES = ["acceptance", "audit", "daily", "documents", "issues", "members", "overview", "permissions", "quality-control", "settings", "tasks"];

function processApplicationCommands() {
    console.log('Processing Application Commands...');
    MODULES.forEach(mod => {
        const cmdDir = path.join(APP_ROOT, mod, 'commands');
        if (!fs.existsSync(cmdDir)) return;

        fs.readdirSync(cmdDir).forEach(file => {
            if (!file.endsWith('.ts')) return;
            const filePath = path.join(cmdDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            // Fix Layer Comment
            content = content.replace(/Layer: Domain/g, 'Layer: Application');

            // Fix Imports
            // ../aggregates/ -> @domain/modules/members/aggregates/
            content = content.replace(/\.\.\/aggregates\//g, `@domain/modules/${mod}/aggregates/`);
            content = content.replace(/\.\.\/value-objects\//g, `@domain/modules/${mod}/value-objects/`);
            content = content.replace(/\.\.\/entities\//g, `@domain/modules/${mod}/aggregates/`); // Entities moved to aggregates
            content = content.replace(/\.\.\/policies\//g, `@domain/modules/${mod}/policies/`);
            
            // Fix double module name if any weirdness (e.g. members/members)
            // But strict replacement above should work.

            fs.writeFileSync(filePath, content);
            console.log(`Updated ${mod}/commands/${file}`);
        });
    });
}

function processDomainAggregates() {
    console.log('Processing Domain Aggregates...');
    MODULES.forEach(mod => {
        const aggDir = path.join(DOMAIN_ROOT, mod, 'aggregates');
        if (!fs.existsSync(aggDir)) return;

        fs.readdirSync(aggDir).forEach(file => {
            if (!file.endsWith('.ts')) return;
            const filePath = path.join(aggDir, file);
            let content = fs.readFileSync(filePath, 'utf-8');

            // Fix imports from ../entities/ to ./ (since entities moved here)
            if (content.includes('../entities/')) {
                content = content.replace(/\.\.\/entities\//g, './');
                fs.writeFileSync(filePath, content);
                console.log(`Updated ${mod}/aggregates/${file}`);
            }
        });
    });
}

function processDomainIndex() {
    console.log('Processing Domain index.ts...');
    MODULES.forEach(mod => {
        const indexFile = path.join(DOMAIN_ROOT, mod, 'index.ts');
        const folders = ['aggregates', 'events', 'value-objects', 'policies', 'repositories'];
        
        let exports = `/**\n * Domain Module: ${mod}\n */\n\n`;
        
        folders.forEach(folder => {
            const folderPath = path.join(DOMAIN_ROOT, mod, folder);
            if (fs.existsSync(folderPath)) {
                // Check if folder has files
                const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts'));
                if (files.length > 0) {
                    exports += `export * from './${folder}';\n`;
                }
            }
        });

        fs.writeFileSync(indexFile, exports);
        console.log(`Updated ${mod}/index.ts`);
    });
}

function processDomainRepositories() {
     console.log('Processing Domain Repositories (Verification)...');
     // Just logging for now, moved commands fixed most logic issues.
     // Assuming repositories are interfaces as they were created as .ts files usually.
}

function main() {
    processApplicationCommands();
    processDomainAggregates();
    processDomainIndex();
}

main();
