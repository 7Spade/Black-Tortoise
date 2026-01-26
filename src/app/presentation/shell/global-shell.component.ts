/**
 * Global Shell Component
 * 
 * Layer: Presentation - Shell
 * Architecture: Angular 20 Standalone, Zone-less, OnPush
 * 
 * The global shell is the top-level layout containing:
 * - Global header (identity/workspace switchers, search, notifications)
 * - Main content area (router-outlet for pages)
 * 
 * Responsibilities:
 * - Pure layout composition (header + content area)
 * - Contains the single stable router-outlet
 * - NO state management, NO facades, NO routing logic, NO guards
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {  HeaderComponent  } from '@presentation/layouts';;

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <app-header [showWorkspaceControls]="true" />
      <main class="shell-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--mat-sys-surface-container-lowest, #f5f5f5);
    }
    
    .shell-content {
      flex: 1;
      overflow: auto;
    }
  `]
})
export class GlobalShellComponent {}
