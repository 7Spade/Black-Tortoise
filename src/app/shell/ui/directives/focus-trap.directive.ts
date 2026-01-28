/**
 * Focus Trap Directive
 * Presentation Layer - Accessibility
 * 
 * Traps keyboard focus within an element (for modals/dialogs)
 * Signal-based active state
 */

import { Directive, ElementRef, inject, signal, input, effect } from '@angular/core';

@Directive({
  selector: '[appFocusTrap]',
  standalone: true,
  host: {
    '(keydown)': 'onKeyDown($event)',
  }
})
export class FocusTrapDirective {
  private readonly elementRef = inject(ElementRef);

  readonly enabled = input(true);
  readonly isActive = signal(false);

  private focusableElements: HTMLElement[] = [];

  constructor() {
    effect(() => {
      if (this.enabled()) {
        this.activate();
      } else {
        this.deactivate();
      }
    });
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isActive() || event.key !== 'Tab') {
      return;
    }

    this.updateFocusableElements();

    if (this.focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = this.focusableElements[0]!;
    const lastElement = this.focusableElements[this.focusableElements.length - 1]!;
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private activate(): void {
    this.isActive.set(true);
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.focusableElements[0]!.focus();
    }
  }

  private deactivate(): void {
    this.isActive.set(false);
  }

  private updateFocusableElements(): void {
    const element = this.elementRef.nativeElement;
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    this.focusableElements = Array.from(element.querySelectorAll(selector));
  }
}
