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
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellFacade } from '@application/facades/shell.facade';
import { HeaderComponent } from '@presentation/shared/components/header';

@Component({
  selector: 'app-global-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="global-shell">
      <!-- Global Header Component -->
      <app-header [showWorkspaceControls]="shell.showWorkspaceControls()" />

      <!-- Main content area -->
      <main class="shell-content">
        <router-outlet />
      </main>

      @if (shell.hasWorkspaceError()) {
        <div class="error-banner">
          {{ shell.workspaceError() }}
          <button (click)="shell.clearWorkspaceError()" type="button">✕</button>
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
  readonly shell = inject(ShellFacade);
}
