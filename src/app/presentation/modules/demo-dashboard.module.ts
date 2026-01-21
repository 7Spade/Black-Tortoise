/**
 * Demo Dashboard Module
 * 
 * Layer: Presentation
 * Purpose: Demo implementation of Overview module following Module interface
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Module, ModuleType } from '../../domain/module/module.interface';
import { WorkspaceEventBus } from '../../domain/workspace/workspace-event-bus';
import { WorkspaceContextStore } from '../../application/stores/workspace-context.store';
import { WorkspaceRuntimeFactory } from '../../infrastructure/runtime/workspace-runtime.factory';

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-dashboard">
      <div class="dashboard-header">
        <h3>Workspace Overview</h3>
      </div>
      
      <div class="dashboard-grid">
        <!-- Stats Cards -->
        <div class="stat-card">
          <span class="material-icons">folder</span>
          <div class="stat-content">
            <h4>Workspace</h4>
            <p>{{ workspaceContext.currentWorkspaceName() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <span class="material-icons">apps</span>
          <div class="stat-content">
            <h4>Active Modules</h4>
            <p>{{ workspaceContext.currentWorkspaceModules().length }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <span class="material-icons">work</span>
          <div class="stat-content">
            <h4>Available Workspaces</h4>
            <p>{{ workspaceContext.workspaceCount() }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <span class="material-icons">person</span>
          <div class="stat-content">
            <h4>Identity</h4>
            <p>{{ workspaceContext.currentIdentityType() || 'Guest' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Module List -->
      <div class="module-section">
        <h4>Enabled Modules</h4>
        <ul class="module-list">
          @for (moduleId of workspaceContext.currentWorkspaceModules(); track moduleId) {
            <li class="module-list-item">
              <span class="material-icons">extension</span>
              <span>{{ moduleId }}</span>
            </li>
          }
        </ul>
      </div>
      
      <!-- Event Bus Info -->
      <div class="info-section">
        <h4>Module Architecture</h4>
        <p>This module follows DDD principles:</p>
        <ul>
          <li>✓ Implements Module interface from domain layer</li>
          <li>✓ Communicates via workspace-scoped event bus</li>
          <li>✓ No direct module-to-module dependencies</li>
          <li>✓ Uses @ngrx/signals for zone-less state management</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .demo-dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
    }
    
    .dashboard-header h3 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .stat-card .material-icons {
      font-size: 2.5rem;
      color: #1976d2;
    }
    
    .stat-content h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }
    
    .stat-content p {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }
    
    .module-section,
    .info-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .module-section h4,
    .info-section h4 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      color: #333;
    }
    
    .module-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .module-list-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .module-list-item:last-child {
      border-bottom: none;
    }
    
    .module-list-item .material-icons {
      font-size: 1.25rem;
      color: #1976d2;
    }
    
    .info-section p {
      color: #666;
      margin-bottom: 1rem;
    }
    
    .info-section ul {
      margin: 0;
      padding-left: 1.5rem;
      color: #666;
    }
    
    .info-section li {
      margin-bottom: 0.5rem;
    }
    
    .material-icons {
      font-family: 'Material Icons';
    }
  `]
})
export class DemoDashboardModule implements Module, OnInit, OnDestroy {
  readonly id = 'overview';
  readonly name = 'Overview Dashboard';
  readonly type: ModuleType = 'overview';
  
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WorkspaceRuntimeFactory);
  private eventBus: WorkspaceEventBus | null = null;
  private unsubscribe: (() => void) | null = null;
  
  ngOnInit(): void {
    // Get workspace runtime and event bus
    const workspace = this.workspaceContext.currentWorkspace();
    if (workspace) {
      const runtime = this.runtimeFactory.getRuntime(workspace.id);
      if (runtime) {
        this.initialize(runtime.eventBus);
      }
    }
  }
  
  ngOnDestroy(): void {
    this.destroy();
  }
  
  initialize(eventBus: WorkspaceEventBus): void {
    this.eventBus = eventBus;
    
    // Subscribe to workspace events
    this.unsubscribe = eventBus.subscribe('WorkspaceSwitched', (event) => {
      console.log('[DemoDashboardModule] Workspace switched:', event);
    });
    
    console.log('[DemoDashboardModule] Initialized with event bus:', eventBus.getWorkspaceId());
  }
  
  activate(): void {
    console.log('[DemoDashboardModule] Activated');
  }
  
  deactivate(): void {
    console.log('[DemoDashboardModule] Deactivated');
  }
  
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    console.log('[DemoDashboardModule] Destroyed');
  }
}
