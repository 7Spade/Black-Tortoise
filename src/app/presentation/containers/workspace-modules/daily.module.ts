/**
 * Daily Module
 * 
 * Layer: Presentation
 * Purpose: Daily standup and activity log
 * 
 * Architecture:
 * - Communicates ONLY via WorkspaceEventBus (no store/use-case injection)
 * - Event bus passed via @Input() from parent component
 * - Uses shared ModuleEventHelper for common patterns
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Module, ModuleType } from '../../../domain/module/module.interface';
import { WorkspaceEventBus } from '../../../domain/workspace/workspace-event-bus';
import { ModuleEventHelper } from './basic/module-event-helper';

@Component({
  selector: 'app-daily-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="daily-module">
      <div class="module-header">
        <span class="material-icons">today</span>
        <div>
          <h2>Daily</h2>
          <p>Daily standup and activity log</p>
        </div>
      </div>
      
      <div class="module-content">
        <div class="info-card">
          <h4>Module Information</h4>
          <p>Workspace ID: {{ workspaceId() }}</p>
          <p>Module: Daily</p>
          <p>Communication: Event-driven via WorkspaceEventBus</p>
        </div>
        
        <div class="placeholder-content">
          <p>Module content will be implemented here.</p>
          <p>All interactions happen via event bus - no direct store access.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .daily-module {
      padding: 1.5rem;
    }
    
    .module-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .module-header .material-icons {
      font-size: 2.5rem;
      color: #1976d2;
    }
    
    .module-header h2 {
      margin: 0;
      color: #333;
    }
    
    .module-header p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }
    
    .module-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .info-card,
    .placeholder-content {
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .info-card h4 {
      margin: 0 0 1rem 0;
      color: #333;
    }
    
    .info-card p,
    .placeholder-content p {
      margin: 0.5rem 0;
      color: #666;
    }
  `]
})
export class DailyModule implements Module, OnInit, OnDestroy {
  readonly id = 'daily';
  readonly name = 'Daily';
  readonly type: ModuleType = 'daily';
  
  /**
   * Event bus MUST be passed from parent - no injection
   */
  @Input() eventBus?: WorkspaceEventBus;
  
  /**
   * Module state (using signals for zone-less)
   */
  workspaceId = signal<string>('');
  
  /**
   * Subscription manager
   */
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: WorkspaceEventBus): void {
    this.eventBus = eventBus;
    this.workspaceId.set(eventBus.getWorkspaceId());
    
    // Subscribe to workspace events
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, (event) => {
        console.log(`[DailyModule] Workspace switched:`, event);
      })
    );
    
    // Publish initialization event
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
    console.log(`[DailyModule] Initialized`);
  }
  
  activate(): void {
    console.log(`[DailyModule] Activated`);
  }
  
  deactivate(): void {
    console.log(`[DailyModule] Deactivated`);
  }
  
  destroy(): void {
    this.subscriptions.unsubscribeAll();
    console.log(`[DailyModule] Destroyed`);
  }
  
  ngOnDestroy(): void {
    this.destroy();
  }
}
