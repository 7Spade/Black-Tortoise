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
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  readonly elevation = input<
    'elevation-0' | 'elevation-1' | 'elevation-2' | 'elevation-3'
  >('elevation-1');
}
