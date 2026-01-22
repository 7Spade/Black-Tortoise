/**
 * Main Layout Component
 * 
 * Layer: Presentation (Shell/Layout)
 * Architecture: Angular 20 Standalone, Zone-less, OnPush
 * 
 * Purpose: Layout composition wrapper for global header and main content area.
 * This component acts as a reusable layout structure that can be used by the shell.
 */

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GlobalHeaderComponent } from '@presentation/features/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GlobalHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="main-layout">
      <!-- Global Header Component -->
      <app-global-header [showWorkspaceControls]="showWorkspaceControls" />
      
      <!-- Main content area -->
      <main class="layout-content">
        <ng-content />
      </main>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--mat-sys-surface-container-lowest, #f5f5f5);
    }
    
    .layout-content {
      flex: 1;
      overflow: auto;
    }
  `]
})
export class MainLayoutComponent {
  @Input() showWorkspaceControls = true;
}
