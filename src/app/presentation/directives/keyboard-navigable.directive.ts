/**
 * Keyboard Navigable Directive
 * Presentation Layer - Accessibility
 * 
 * Enables arrow key navigation for list/grid elements
 * Signal-based focus state
 */

import { Directive, ElementRef, inject, signal, input } from '@angular/core';

@Directive({
  selector: '[appKeyboardNavigable]',
  standalone: true,
  host: {
    '[attr.tabindex]': '0',
    '(keydown)': 'onKeyDown($event)',
  }
})
export class KeyboardNavigableDirective {
  private readonly elementRef = inject(ElementRef);

  readonly orientation = input<'horizontal' | 'vertical'>('vertical');
  readonly focusedIndex = signal(0);

  protected onKeyDown(event: KeyboardEvent): void {
    const isVertical = this.orientation() === 'vertical';
    
    switch (event.key) {
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          this.moveFocus(-1);
        }
        break;
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          this.moveFocus(1);
        }
        break;
      case 'ArrowLeft':
        if (!isVertical) {
          event.preventDefault();
          this.moveFocus(-1);
        }
        break;
      case 'ArrowRight':
        if (!isVertical) {
          event.preventDefault();
          this.moveFocus(1);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusedIndex.set(0);
        break;
      case 'End':
        event.preventDefault();
        // TODO: Set to last index
        break;
    }
  }

  private moveFocus(delta: number): void {
    const newIndex = this.focusedIndex() + delta;
    if (newIndex >= 0) {
      this.focusedIndex.set(newIndex);
    }
  }
}
