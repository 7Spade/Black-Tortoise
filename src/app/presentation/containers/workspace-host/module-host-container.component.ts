/**
 * Module Host Container Component
 * 
 * Layer: Presentation
 * Purpose: Dynamically hosts workspace modules and passes WorkspaceEventBus via @Input()
 * 
 * Architecture:
 * - Receives module component dynamically
 * - Passes WorkspaceEventBus to module via @Input()
 * - Manages module lifecycle
 * - Zone-less operation with signals
 */

import { 
  Component, 
  ChangeDetectionStrategy, 
  Input, 
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect,
  Type
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceEventBus } from '../../../domain/workspace/workspace-event-bus';
import { Module } from '../../../domain/module/module.interface';
import { WorkspaceContextStore } from '../../../application/stores/workspace-context.store';
import { WorkspaceRuntimeFactory } from '../../../infrastructure/runtime/workspace-runtime.factory';

@Component({
  selector: 'app-module-host-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="module-host-container">
      @if (isLoading()) {
        <div class="loading-state">
          <span class="material-icons">hourglass_empty</span>
          <p>Loading module...</p>
        </div>
      } @else if (error()) {
        <div class="error-state">
          <span class="material-icons">error</span>
          <p>{{ error() }}</p>
        </div>
      } @else {
        <!-- Dynamic module will be rendered here -->
        <ng-container #moduleContainer></ng-container>
      }
    </div>
  `,
  styles: [`
    .module-host-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .loading-state,
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
    }
    
    .error-state {
      color: #d32f2f;
    }
    
    .loading-state .material-icons,
    .error-state .material-icons {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .loading-state p,
    .error-state p {
      font-size: 1rem;
    }
  `]
})
export class ModuleHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('moduleContainer', { read: ViewContainerRef }) 
  moduleContainer?: ViewContainerRef;
  
  /**
   * Module component type to load
   */
  @Input() moduleComponent?: Type<Module>;
  
  /**
   * Module ID for debugging
   */
  @Input() moduleId?: string;
  
  /**
   * Component state
   */
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  /**
   * Dependencies
   */
  private readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly runtimeFactory = inject(WorkspaceRuntimeFactory);
  
  /**
   * Current module instance
   */
  private moduleRef?: ComponentRef<Module>;
  private eventBus?: WorkspaceEventBus;
  
  constructor() {
    // Watch for workspace changes and recreate eventBus
    effect(() => {
      const workspace = this.workspaceContext.currentWorkspace();
      if (workspace) {
        const runtime = this.runtimeFactory.getRuntime(workspace.id);
        if (runtime) {
          this.eventBus = runtime.eventBus;
          this.reloadModule();
        }
      }
    });
  }
  
  ngOnInit(): void {
    this.loadModule();
  }
  
  ngOnDestroy(): void {
    this.destroyModule();
  }
  
  /**
   * Load the module component dynamically
   */
  private async loadModule(): Promise<void> {
    if (!this.moduleComponent || !this.moduleContainer) {
      this.error.set('Module component or container not available');
      return;
    }
    
    const workspace = this.workspaceContext.currentWorkspace();
    if (!workspace) {
      this.error.set('No active workspace');
      return;
    }
    
    const runtime = this.runtimeFactory.getRuntime(workspace.id);
    if (!runtime) {
      this.error.set('Workspace runtime not found');
      return;
    }
    
    this.eventBus = runtime.eventBus;
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      // Clear previous module
      this.destroyModule();
      this.moduleContainer.clear();
      
      // Create new module instance
      this.moduleRef = this.moduleContainer.createComponent(this.moduleComponent);
      
      // Pass eventBus via component instance property (acts like @Input)
      if (this.moduleRef.instance) {
        // Set the eventBus property directly
        (this.moduleRef.instance as any).eventBus = this.eventBus;
        
        // Manually trigger ngOnInit if the component hasn't been initialized yet
        // Angular will handle this automatically, but we ensure eventBus is set first
        this.moduleRef.changeDetectorRef.detectChanges();
      }
      
      this.isLoading.set(false);
      console.log(`[ModuleHostContainer] Module loaded: ${this.moduleId}`);
    } catch (err) {
      this.error.set(`Failed to load module: ${err}`);
      this.isLoading.set(false);
      console.error(`[ModuleHostContainer] Error loading module:`, err);
    }
  }
  
  /**
   * Reload module (e.g., when workspace changes)
   */
  private reloadModule(): void {
    if (this.moduleComponent && this.eventBus) {
      this.loadModule();
    }
  }
  
  /**
   * Destroy current module instance
   */
  private destroyModule(): void {
    if (this.moduleRef) {
      // Call module's destroy method if available
      if (this.moduleRef.instance && typeof this.moduleRef.instance.destroy === 'function') {
        this.moduleRef.instance.destroy();
      }
      
      // Destroy the component
      this.moduleRef.destroy();
      this.moduleRef = undefined;
    }
  }
}
