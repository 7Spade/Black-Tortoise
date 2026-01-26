const fs = require('fs');
const path = require('path');

const WORKSPACE_CORE = path.join(__dirname, 'src/app/domain/core/workspace');

function refactorCoreWorkspace() {
    // 1. Move Entities to Aggregates
    const entitiesDir = path.join(WORKSPACE_CORE, 'entities');
    const aggDir = path.join(WORKSPACE_CORE, 'aggregates');
    if (fs.existsSync(entitiesDir)) {
        if (!fs.existsSync(aggDir)) fs.mkdirSync(aggDir);
        fs.readdirSync(entitiesDir).forEach(file => {
            const src = path.join(entitiesDir, file);
            const dest = path.join(aggDir, file);
            fs.renameSync(src, dest);
            console.log(`Moved ${file} to aggregates`);
        });
        fs.rmdirSync(entitiesDir); // Assuming empty
    }

    // 2. Refactor Service to Policy
    const svcDir = path.join(WORKSPACE_CORE, 'services');
    const policyDir = path.join(WORKSPACE_CORE, 'policies');
    if (fs.existsSync(svcDir)) {
        if (!fs.existsSync(policyDir)) fs.mkdirSync(policyDir);
        fs.readdirSync(svcDir).forEach(file => {
            if (file.endsWith('.service.ts')) { // workspace-domain.service.ts
                const src = path.join(svcDir, file);
                const destName = file.replace('-domain.service.ts', '.policy.ts');
                const dest = path.join(policyDir, destName);
                
                let content = fs.readFileSync(src, 'utf-8');
                // Basic text replacement to make it look like a policy (comment wise)
                content = content.replace(/Domain Service/g, 'Domain Policy');
                content = content.replace(/workspace-domain.service.ts/g, destName);
                
                fs.writeFileSync(dest, content);
                fs.unlinkSync(src); // Delete old file
                console.log(`Refactored ${file} to ${destName}`);
            }
        });
        fs.rmdirSync(svcDir);
    }
    
    // 3. Update Aggregate Imports (from ../entities to ./)
    fs.readdirSync(aggDir).forEach(file => {
         const filePath = path.join(aggDir, file);
         let content = fs.readFileSync(filePath, 'utf-8');
         if (content.includes('../entities/')) {
             content = content.replace(/\.\.\/entities\//g, './');
             fs.writeFileSync(filePath, content);
             console.log(`Updated imports in ${file}`);
         }
    });

    // 4. Update Index
    const indexFile = path.join(WORKSPACE_CORE, 'index.ts');
    let indexContent = fs.readFileSync(indexFile, 'utf-8');
    // Remove services export
    indexContent = indexContent.replace(/export \* from '\.\/services';\n/, '');
    // Remove entities export line if it exists as separate folder, but usually it was exported.
    // Replace ./entities/ with ./aggregates/ 
    // Wait, if I explicitly exported from ./entities/foo, now it is ./aggregates/foo.
    // But index.ts might just say `export * from './entities';`?
    // Let's check index content earlier.
    /*
    export { WorkspaceEntity, createWorkspace as createWorkspaceEntity, ... } from './entities/workspace.entity';
    */
    // So I need to replace './entities/workspace.entity' with './aggregates/workspace.entity'.
    indexContent = indexContent.replace(/'\.\/entities\/workspace\.entity'/g, "'./aggregates/workspace.entity'");
    
    // Add policies export if not exists
    if (!indexContent.includes('./policies')) {
        indexContent += "export * from './policies';\n";
    }
    fs.writeFileSync(indexFile, indexContent);
    console.log('Updated core/workspace/index.ts');
}

refactorCoreWorkspace();
