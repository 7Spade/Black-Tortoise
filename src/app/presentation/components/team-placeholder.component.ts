/**
 * Team Placeholder Component
 * 
 * Layer: Presentation
 * Purpose: Placeholder component for team-related UI
 * Architecture: Zone-less, OnPush, Standalone
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-team-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="team-placeholder">
      <p>Team Component - Under construction</p>
    </div>
  `,
  styles: [`
    .team-placeholder {
      padding: 1rem;
      color: var(--mat-sys-on-surface-variant, #49454f);
      font-size: 0.875rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPlaceholderComponent {
  // Placeholder implementation
}
