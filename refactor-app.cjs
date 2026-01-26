const fs = require('fs');
const path = require('path');

const APP_ROOT = path.join(__dirname, 'src/app/application');
const MODULES = ["acceptance", "audit", "daily", "documents", "issues", "members", "overview", "permissions", "quality-control", "settings", "tasks", "workspace"];

function fixCommandImports(filePath, mod) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Checks for specific known violations or generic aggregate imports
    if (content.match(/import .* from .*aggregates.*ts['"];/)) {
        console.log(`Fixing imports in ${path.basename(filePath)}`);
        
        // Comment out the import
        content = content.replace(/(import .* from .*aggregates.*ts['"];)/g, '// $1');
        
        // Bruteforce replace known types with 'any' or primitives to safe build (DANGEROUS but requested to remove dependency)
        // Better: Define them as aliases? 
        // E.g. MemberRole -> string
        content = content.replace(/: MemberRole/g, ': any /* TODO: Define DTO */');
        content = content.replace(/: WorkspaceSettingsEntity/g, ': any /* TODO: Define DTO */');
        content = content.replace(/Partial<WorkspaceSettingsEntity>/g, 'any /* TODO: Define DTO */');
        content = content.replace(/: TaskPriority/g, ': any /* TODO: Define TaskPriority DTO */');
        
        fs.writeFileSync(filePath, content);
    }
}

function createUseCase(mod, cmdFile) {
    const cmdName = path.basename(cmdFile, '.ts'); // e.g. update-settings.command
    const baseName = cmdName.replace('.command', ''); 
    // snake-case to PascalCase
    const className = baseName.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + 'UseCase';
    
    // Check if command file exports an interface
    const commandFileContent = fs.readFileSync(path.join(APP_ROOT, mod, 'commands', cmdFile), 'utf-8');
    const match = commandFileContent.match(/export interface (\w+)/);
    const commandInterfaceName = match ? match[1] : 'any';

    const useCaseDir = path.join(APP_ROOT, mod, 'use-cases');
    if (!fs.existsSync(useCaseDir)) fs.mkdirSync(useCaseDir, { recursive: true });
    
    const useCaseFile = path.join(useCaseDir, `${baseName}.use-case.ts`);
    if (fs.existsSync(useCaseFile)) return; // Skip if exists
    
    const content = `/**
 * ${className}
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { ${commandInterfaceName} } from '../commands/${cmdName.replace('.ts', '')}';
// import { ${mod.charAt(0).toUpperCase() + mod.slice(1)}Repository } from '@domain/modules/${mod}/repositories';

@Injectable({ providedIn: 'root' })
export class ${className} {
  // private repo = inject(${mod.charAt(0).toUpperCase() + mod.slice(1)}Repository);

  async execute(command: ${commandInterfaceName}): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute ${className}', command);
  }
}
`;
    fs.writeFileSync(useCaseFile, content);
    console.log(`Created ${baseName}.use-case.ts`);
}

function processModule(mod) {
    const cmdDir = path.join(APP_ROOT, mod, 'commands');
    if (fs.existsSync(cmdDir)) {
        fs.readdirSync(cmdDir).forEach(file => {
             if (file.endsWith('.ts')) {
                 const filePath = path.join(cmdDir, file);
                 fixCommandImports(filePath, mod);
                 createUseCase(mod, file);
             }
        });
    }
    
    // ensure handler dir exists
    const handlerDir = path.join(APP_ROOT, mod, 'handlers');
    if (!fs.existsSync(handlerDir)) fs.mkdirSync(handlerDir);
    
    // ensure stores dir exists
    const storeDir = path.join(APP_ROOT, mod, 'stores');
    if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir);

    // ensure interfaces dir exists
    const intDir = path.join(APP_ROOT, mod, 'interfaces');
    if (!fs.existsSync(intDir)) fs.mkdirSync(intDir);

    // Update index.ts (Barrel)
    const indexFile = path.join(APP_ROOT, mod, 'index.ts');
    let indexContent = `/**
 * Application Module: ${mod}
 */

`;
    if (fs.existsSync(cmdDir)) indexContent += `export * from './commands';\n`;
    if (fs.existsSync(path.join(APP_ROOT, mod, 'use-cases'))) indexContent += `export * from './use-cases';\n`;
    if (fs.existsSync(handlerDir)) indexContent += `export * from './handlers';\n`;
    if (fs.existsSync(intDir)) indexContent += `export * from './interfaces';\n`;
    indexContent += `export * from './stores';\n`; // Export stores for UI consumption

    fs.writeFileSync(indexFile, indexContent);
    
    // Sub-barrels
    ['commands', 'use-cases', 'handlers', 'interfaces', 'stores'].forEach(sub => {
        const subDir = path.join(APP_ROOT, mod, sub);
        if (fs.existsSync(subDir)) {
             const subIndex = path.join(subDir, 'index.ts');
             const files = fs.readdirSync(subDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
             if (files.length > 0) {
                 let exportContent = '';
                 files.forEach(f => {
                     exportContent += `export * from './${f.replace('.ts', '')}';\n`;
                 });
                 fs.writeFileSync(subIndex, exportContent);
             }
        }
    });
}

MODULES.forEach(processModule);
