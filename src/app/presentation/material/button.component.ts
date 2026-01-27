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
    <button 
      [type]="type()"
      [disabled]="disabled()"
      [class]="variant()">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      padding: 10px 24px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    button.filled {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #ffffff);
    }
    button.outlined {
      background: transparent;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      color: var(--md-sys-color-primary, #6750a4);
    }
    button.text {
      background: transparent;
      color: var(--md-sys-color-primary, #6750a4);
    }
    button:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
    button:not(:disabled):hover {
      opacity: 0.9;
    }
  `]
})
export class ButtonComponent {
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly variant = input<'filled' | 'outlined' | 'text'>('filled');
}
