/**
 * Card Component
 * Presentation Layer - Material Wrapper
 * 
 * Material Design 3 card container
 */

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div class="card" [class]="elevation()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: var(--md-sys-color-surface, #ffffff);
      border-radius: 12px;
      padding: 16px;
      transition: box-shadow 0.2s;
    }
    .card.elevation-0 {
      box-shadow: none;
      border: 1px solid var(--md-sys-color-outline-variant, #c4c7c5);
    }
    .card.elevation-1 {
      box-shadow: 
        0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }
    .card.elevation-2 {
      box-shadow: 
        0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    }
    .card.elevation-3 {
      box-shadow: 
        0px 4px 8px 3px rgba(0, 0, 0, 0.15),
        0px 1px 3px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class CardComponent {
  readonly elevation = input<'elevation-0' | 'elevation-1' | 'elevation-2' | 'elevation-3'>('elevation-1');
}
