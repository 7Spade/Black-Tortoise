/**
 * Workspace Host Component
 * 
 * Layer: Presentation
 * Purpose: Hosts workspace modules and provides module navigation
 */

import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { WorkspaceContextStore } from '../../application/stores/workspace-context.store';
import { STANDARD_MODULES, ModuleType } from '../../domain/module/module.interface';

@Component({
  selector: 'app-workspace-host',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-host" [class.collapsed]="isSidebarCollapsed()">
      <!-- Module Navigation -->
      <nav class="module-nav">
        <div class="module-nav-header">
          <h3>Modules</h3>
          <button class="collapse-button" type="button" (click)="toggleSidebar()">
            <span class="material-icons">
              @if (isSidebarCollapsed()) { chevron_right } @else { chevron_left }
            </span>
          </button>
        </div>
        <ul class="module-list">
          @for (moduleId of workspaceContext.currentWorkspaceModules(); track moduleId) {
            @if (getModuleMetadata(moduleId); as module) {
              <li class="module-item">
                <button 
                  class="module-button"
                  [class.active]="moduleId === workspaceContext.activeModuleId()"
                  (click)="activateModule(moduleId)">
                  <span class="material-icons">{{ module.icon }}</span>
                  <span>{{ module.name }}</span>
                </button>
              </li>
            }
          }
        </ul>
      </nav>
      
      <!-- Module Content Area -->
      <div class="module-content">
        @if (workspaceContext.activeModuleId(); as moduleId) {
          @if (getModuleMetadata(moduleId); as module) {
            <div class="module-header">
              <h2>
                <span class="material-icons">{{ module.icon }}</span>
                {{ module.name }}
              </h2>
              <p>{{ module.description }}</p>
            </div>
            
            <!-- Dynamic module content will be loaded here -->
            <div class="module-body">
              <router-outlet />
            </div>
          }
        } @else {
          <div class="no-module">
            <span class="material-icons">apps</span>
            <p>Select a module to get started</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .workspace-host {
      display: flex;
      height: 100%;
      background: white;
    }
    
    .module-nav {
      width: 250px;
      background: #fafafa;
      border-right: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
    }
    
    .module-nav-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .module-nav-header h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .collapse-button {
      border: none;
      background: transparent;
      cursor: pointer;
      color: #666;
    }
    
    .module-list {
      list-style: none;
      margin: 0;
      padding: 0.5rem 0;
    }
    
    .module-item {
      margin: 0;
    }
    
    .module-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      text-align: left;
      color: #666;
      transition: all 0.2s;
    }
    
    .module-button:hover {
      background: #f5f5f5;
      color: #333;
    }
    
    .module-button.active {
      background: #e3f2fd;
      color: #1976d2;
      font-weight: 500;
      border-left: 3px solid #1976d2;
    }
    
    .module-button .material-icons {
      font-size: 20px;
    }
    
    .module-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }

    .workspace-host.collapsed .module-nav {
      width: 64px;
    }

    .workspace-host.collapsed .module-button span:last-child {
      display: none;
    }

    .workspace-host.collapsed .module-nav-header h3 {
      display: none;
    }
    
    .module-header {
      padding: 2rem;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .module-header h2 {
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.75rem;
      color: #333;
    }
    
    .module-header p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .module-body {
      flex: 1;
      padding: 2rem;
    }
    
    .no-module {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #ccc;
    }
    
    .no-module .material-icons {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
    }
  `]
})
export class WorkspaceHostComponent implements OnInit {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);
  private readonly sidebarStorageKey = 'ui.sidebar';
  readonly isSidebarCollapsed = signal(false);
  
  ngOnInit(): void {
    const stored = localStorage.getItem(this.sidebarStorageKey);
    this.isSidebarCollapsed.set(stored === 'collapsed');

    // Auto-activate first module if none active
    const currentModules = this.workspaceContext.currentWorkspaceModules();
    const activeModule = this.workspaceContext.activeModuleId();
    
    const firstModule = currentModules[0];
    if (firstModule && !activeModule) {
      this.activateModule(firstModule);
    }
  }
  
  activateModule(moduleId: string): void {
    const module = this.getModuleMetadata(moduleId);
    if (!module) {
      return;
    }

    this.workspaceContext.activateModule(moduleId);
    // Navigate relative to workspace route
    this.router.navigate(['/workspace', moduleId]).catch(() => {
      this.workspaceContext.setError('Failed to navigate to module');
    });
  }

  toggleSidebar(): void {
    const next = !this.isSidebarCollapsed();
    this.isSidebarCollapsed.set(next);
    localStorage.setItem(this.sidebarStorageKey, next ? 'collapsed' : 'expanded');
  }
  
  getModuleMetadata(moduleId: string) {
    const moduleType = moduleId as ModuleType;
    const metadata = STANDARD_MODULES[moduleType];
    if (!metadata) return null;
    
    return {
      id: moduleId,
      ...metadata,
    };
  }
}
