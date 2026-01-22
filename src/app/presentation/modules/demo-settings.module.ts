/**
 * Demo Settings Module
 * 
 * Layer: Presentation
 * Purpose: Demo implementation of Settings module
 */

import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Module, ModuleType } from '../../domain/module/module.interface';
import { WorkspaceEventBus } from '../../domain/workspace/workspace-event-bus';
import { WorkspaceContextStore } from '../../application/stores/workspace-context.store';
import { WorkspaceRuntimeFactory } from '../../infrastructure/runtime/workspace-runtime.factory';

@Component({
  selector: 'app-demo-settings',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-settings">
      <div class="settings-header">
        <h3>Workspace Settings</h3>
        <p>Manage workspace configuration and preferences</p>
      </div>
      
      <div class="settings-content">
        <!-- Workspace Info Section -->
        <section class="settings-section">
          <h4>Workspace Information</h4>
          <div class="settings-field">
            <label>Workspace ID</label>
            <div class="field-value">{{ workspaceContext.currentWorkspace()?.id || 'N/A' }}</div>
          </div>
          <div class="settings-field">
            <label>Workspace Name</label>
            <div class="field-value">{{ workspaceContext.currentWorkspace()?.name || 'N/A' }}</div>
          </div>
          <div class="settings-field">
            <label>Owner ID</label>
            <div class="field-value">{{ workspaceContext.currentWorkspace()?.ownerId || 'N/A' }}</div>
          </div>
          <div class="settings-field">
            <label>Owner Type</label>
            <div class="field-value">{{ workspaceContext.currentWorkspace()?.ownerType || 'N/A' }}</div>
          </div>
        </section>
        
        <!-- Modules Section -->
        <section class="settings-section">
          <h4>Enabled Modules</h4>
          <div class="module-grid">
            @for (moduleId of workspaceContext.currentWorkspaceModules(); track moduleId) {
              <div class="module-card">
                <span class="material-icons">extension</span>
                <span>{{ moduleId }}</span>
              </div>
            }
          </div>
        </section>
        
        <!-- Event Bus Section -->
        <section class="settings-section">
          <h4>Event Bus Configuration</h4>
          <div class="settings-field">
            <label>Bus Scope</label>
            <div class="field-value">Workspace-scoped (isolated per workspace)</div>
          </div>
          <div class="settings-field">
            <label>Communication Pattern</label>
            <div class="field-value">Publish/Subscribe (no direct module calls)</div>
          </div>
          <div class="settings-field">
            <label>Implementation</label>
            <div class="field-value">RxJS Subject (Infrastructure layer)</div>
          </div>
        </section>
        
        <!-- DDD Architecture Info -->
        <section class="settings-section">
          <h4>DDD Architecture</h4>
          <div class="architecture-info">
            <div class="layer-info">
              <strong>Domain Layer:</strong> Pure business logic, no framework dependencies
            </div>
            <div class="layer-info">
              <strong>Application Layer:</strong> Use cases, signal stores, orchestration
            </div>
            <div class="layer-info">
              <strong>Infrastructure Layer:</strong> Event bus implementation, runtime factory
            </div>
            <div class="layer-info">
              <strong>Presentation Layer:</strong> Angular components, zone-less, OnPush
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .demo-settings {
      max-width: 900px;
      margin: 0 auto;
    }
    
    .settings-header {
      margin-bottom: 2rem;
    }
    
    .settings-header h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .settings-header p {
      margin: 0;
      color: #666;
    }
    
    .settings-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .settings-section {
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .settings-section h4 {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      color: #333;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid #1976d2;
    }
    
    .settings-field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .settings-field:last-child {
      border-bottom: none;
    }
    
    .settings-field label {
      font-weight: 500;
      color: #666;
      font-size: 0.875rem;
    }
    
    .field-value {
      color: #333;
      font-size: 0.875rem;
    }
    
    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .module-card {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .module-card .material-icons {
      font-size: 1.25rem;
      color: #1976d2;
    }
    
    .architecture-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .layer-info {
      padding: 0.75rem;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #666;
    }
    
    .layer-info strong {
      color: #1976d2;
    }
    
    .material-icons {
      font-family: 'Material Icons';
    }
  `]
})
export class DemoSettingsModule implements Module, OnInit, OnDestroy {
  readonly id = 'settings';
  readonly name = 'Settings';
  readonly type: ModuleType = 'settings';
  
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WorkspaceRuntimeFactory);
  private eventBus: WorkspaceEventBus | null = null;
  private unsubscribe: (() => void) | null = null;
  
  ngOnInit(): void {
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
    
    this.unsubscribe = eventBus.subscribe('ModuleActivated', (event) => {
      console.log('[DemoSettingsModule] Module activated:', event);
    });
    
    console.log('[DemoSettingsModule] Initialized with event bus:', eventBus.getWorkspaceId());
  }
  
  activate(): void {
    console.log('[DemoSettingsModule] Activated');
  }
  
  deactivate(): void {
    console.log('[DemoSettingsModule] Deactivated');
  }
  
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    console.log('[DemoSettingsModule] Destroyed');
  }
}
