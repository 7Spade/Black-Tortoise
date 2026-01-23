/**
 * Overview Module
 * 
 * Layer: Presentation
 * Purpose: Workspace overview dashboard module
 * 
 * Architecture:
 * - Communicates ONLY via IModuleEventBus (Application interface)
 * - Event bus passed via @Input() from parent component
 * - Uses shared ModuleEventHelper for common patterns
 * 
 * Clean Architecture Compliance:
 * - Implements IAppModule from Application layer
 * - Uses IModuleEventBus from Application layer
 * - No direct Domain dependencies
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, signal } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

@Component({
  selector: 'app-overview-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overview-module">
      <div class="module-header">
        <h2>Workspace Overview</h2>
        <p>Dashboard and workspace summary</p>
      </div>
      
      <div class="module-content">
        <div class="info-card">
          <span class="material-icons">dashboard</span>
          <div class="info-content">
            <h4>Overview Module</h4>
            <p>Workspace ID: {{ workspaceId() }}</p>
            <p>Event-driven architecture via WorkspaceEventBus</p>
          </div>
        </div>
        
        <div class="event-log">
          <h4>Recent Events</h4>
          <ul>
            @for (event of recentEvents(); track event) {
              <li>{{ event }}</li>
            }
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overview-module {
      padding: 1.5rem;
    }
    
    .module-header h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    
    .module-header p {
      margin: 0;
      color: #666;
    }
    
    .module-content {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .info-card {
      display: flex;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .info-card .material-icons {
      font-size: 2.5rem;
      color: #1976d2;
    }
    
    .event-log {
      padding: 1.5rem;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    
    .event-log h4 {
      margin: 0 0 1rem 0;
    }
    
    .event-log ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .event-log li {
      padding: 0.5rem;
      border-bottom: 1px solid #f0f0f0;
      font-size: 0.875rem;
      color: #666;
    }
  `]
})
export class OverviewModule implements IAppModule, OnInit {
  readonly id = 'overview';
  readonly name = 'Overview';
  readonly type: ModuleType = 'overview';
  
  /**
   * Event bus MUST be passed from parent - no injection
   */
  @Input() eventBus?: IModuleEventBus;
  
  /**
   * Module state (using signals for zone-less)
   */
  workspaceId = signal<string>('');
  recentEvents = signal<string[]>([]);
  
  /**
   * Subscription manager
   */
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    this.workspaceId.set(eventBus.workspaceId);
    
    // Subscribe to workspace switched events
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, (event) => {
        this.addEvent(`Workspace switched: ${JSON.stringify(event)}`);
      })
    );
    
    // Subscribe to module activated events
    this.subscriptions.add(
      ModuleEventHelper.onModuleActivated(eventBus, (event) => {
        this.addEvent(`Module activated: ${JSON.stringify(event)}`);
      })
    );
    
    // Publish initialization event
    ModuleEventHelper.publishModuleInitialized(eventBus, this.id);
    this.addEvent('Overview module initialized');
  }
  
  activate(): void {
    this.addEvent('Overview module activated');
  }
  
  deactivate(): void {
    this.addEvent('Overview module deactivated');
  }
  
  destroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  
  ngOnDestroy(): void {
    this.destroy();
  }
  
  private addEvent(message: string): void {
    const events = this.recentEvents();
    this.recentEvents.set([message, ...events.slice(0, 9)]);
  }
}
