/**
 * Global Shell Component
 * 
 * Layer: Presentation
 * Architecture: Angular 20 Standalone, Zone-less, OnPush
 * 
 * The global shell is the top-level layout containing:
 * - Global header (identity/workspace switchers, search, notifications)
 * - Main content area (router-outlet for modules)
 * - Error notifications
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { GlobalHeaderComponent } from '@presentation/shell/layout/global-header';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-global-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GlobalHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="global-shell">
      <!-- Global Header Component -->
      <app-global-header [showWorkspaceControls]="showWorkspaceControls()" />
      
      <!-- Main content area -->
      <main class="shell-content">
        <router-outlet />
      </main>
      
      @if (workspaceContext.error()) {
        <div class="error-banner">
          {{ workspaceContext.error() }}
          <button (click)="workspaceContext.setError(null)" type="button">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .global-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--mat-sys-surface-container-lowest, #f5f5f5);
    }
    
    .shell-content {
      flex: 1;
      overflow: auto;
    }

    .error-banner {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      padding: 1rem 1.5rem;
      background: var(--mat-sys-error, #ba1a1a);
      color: var(--mat-sys-on-error, #ffffff);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 1rem;
      z-index: 2000;
    }
    
    .error-banner button {
      background: none;
      border: none;
      color: var(--mat-sys-on-error, #ffffff);
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
    }
  `]
})
export class GlobalShellComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);
  private readonly urlSignal = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly showWorkspaceControls = computed(() => !this.urlSignal().startsWith('/demo'));
}
