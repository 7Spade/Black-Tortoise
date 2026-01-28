/**
 * Button Component
 * Presentation Layer - Material Wrapper
 *
 * Material Design 3 button wrapper
 */

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="variant()">
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly variant = input<'filled' | 'outlined' | 'text'>('filled');
}
