/**
 * Global Shell Component
 * 
 * Layer: Presentation
 * Architecture: Angular 20 Standalone, Zone-less, OnPush
 * 
 * The global shell is the top-level layout containing:
 * - Identity switcher
 * - Workspace switcher
 * - Workspace host (where modules are rendered)
 */

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WorkspaceContextStore } from '../../application/stores/workspace-context.store';
import { WorkspaceHostComponent } from '../workspace-host/workspace-host.component';

@Component({
  selector: 'app-global-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, WorkspaceHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="global-shell">
      <!-- Header with identity and workspace switchers -->
      <header class="shell-header">
        <div class="shell-branding">
          <h1>Black Tortoise</h1>
        </div>
        
        <div class="shell-controls">
          <!-- Identity Info -->
          <div class="identity-info">
            @if (workspaceContext.isAuthenticated()) {
              <span class="identity-label">
                {{ workspaceContext.currentIdentityType() | titlecase }}
              </span>
            } @else {
              <span class="identity-label">Guest</span>
            }
          </div>
          
          <!-- Workspace Switcher -->
          @if (workspaceContext.hasWorkspace()) {
            <div class="workspace-switcher">
              <button class="workspace-button" (click)="toggleWorkspaceMenu()">
                <span class="material-icons">folder</span>
                <span class="workspace-name">
                  {{ workspaceContext.currentWorkspaceName() }}
                </span>
                <span class="material-icons">expand_more</span>
              </button>
              
              @if (showWorkspaceMenu) {
                <div class="workspace-menu">
                  @for (workspace of workspaceContext.availableWorkspaces(); track workspace.id) {
                    <button 
                      class="workspace-menu-item"
                      [class.active]="workspace.id === workspaceContext.currentWorkspace()?.id"
                      (click)="selectWorkspace(workspace.id)">
                      <span class="material-icons">folder</span>
                      <span>{{ workspace.name }}</span>
                    </button>
                  }
                  <div class="workspace-menu-divider"></div>
                  <button class="workspace-menu-item" (click)="createNewWorkspace()">
                    <span class="material-icons">add</span>
                    <span>Create Workspace</span>
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </header>
      
      <!-- Main content area -->
      <main class="shell-content">
        @if (workspaceContext.hasWorkspace()) {
          <app-workspace-host />
        } @else {
          <div class="no-workspace">
            <div class="empty-state">
              <span class="material-icons">folder_off</span>
              <h2>No Workspace Selected</h2>
              <p>Create or select a workspace to get started</p>
              <button class="create-workspace-btn" (click)="createNewWorkspace()">
                <span class="material-icons">add</span>
                Create Workspace
              </button>
            </div>
          </div>
        }
      </main>
      
      <!-- Error display -->
      @if (workspaceContext.error()) {
        <div class="error-banner">
          {{ workspaceContext.error() }}
          <button (click)="workspaceContext.setError(null)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .global-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f5f5f5;
    }
    
    .shell-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: white;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .shell-branding h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1976d2;
    }
    
    .shell-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .identity-info {
      padding: 0.5rem 1rem;
      background: #e3f2fd;
      border-radius: 4px;
    }
    
    .identity-label {
      font-size: 0.875rem;
      color: #1976d2;
      font-weight: 500;
    }
    
    .workspace-switcher {
      position: relative;
    }
    
    .workspace-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .workspace-button:hover {
      background: #f5f5f5;
      border-color: #1976d2;
    }
    
    .workspace-name {
      font-weight: 500;
    }
    
    .workspace-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      min-width: 250px;
      z-index: 1000;
    }
    
    .workspace-menu-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      text-align: left;
      transition: background 0.2s;
    }
    
    .workspace-menu-item:hover {
      background: #f5f5f5;
    }
    
    .workspace-menu-item.active {
      background: #e3f2fd;
      color: #1976d2;
    }
    
    .workspace-menu-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 0.25rem 0;
    }
    
    .shell-content {
      flex: 1;
      overflow: auto;
    }
    
    .no-workspace {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    
    .empty-state {
      text-align: center;
      padding: 2rem;
    }
    
    .empty-state .material-icons {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }
    
    .empty-state h2 {
      margin: 0 0 0.5rem 0;
      color: #666;
    }
    
    .empty-state p {
      color: #999;
      margin-bottom: 1.5rem;
    }
    
    .create-workspace-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #1976d2;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }
    
    .create-workspace-btn:hover {
      background: #1565c0;
    }
    
    .error-banner {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      padding: 1rem 1.5rem;
      background: #f44336;
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 2000;
    }
    
    .error-banner button {
      background: none;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
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
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
  `]
})
export class GlobalShellComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  
  showWorkspaceMenu = false;
  
  toggleWorkspaceMenu(): void {
    this.showWorkspaceMenu = !this.showWorkspaceMenu;
  }
  
  selectWorkspace(workspaceId: string): void {
    this.workspaceContext.switchWorkspace(workspaceId);
    this.showWorkspaceMenu = false;
  }
  
  createNewWorkspace(): void {
    const name = prompt('Enter workspace name:');
    if (name && name.trim()) {
      this.workspaceContext.createWorkspace(name.trim());
      this.showWorkspaceMenu = false;
    }
  }
}
