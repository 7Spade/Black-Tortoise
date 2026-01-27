/**
 * Draggable Directive
 * Presentation Layer - DOM Interaction
 * 
 * Adds drag-and-drop capability to elements
 * Signal-based drag state
 */

import { Directive, ElementRef, inject, signal, output } from '@angular/core';

export interface DragEvent {
  element: HTMLElement;
  x: number;
  y: number;
}

@Directive({
  selector: '[appDraggable]',
  standalone: true,
  host: {
    '[attr.draggable]': 'true',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
  }
})
export class DraggableDirective {
  private readonly elementRef = inject(ElementRef);

  readonly isDragging = signal(false);
  readonly dragStart = output<DragEvent>();
  readonly dragEnd = output<DragEvent>();

  protected onDragStart(event: globalThis.DragEvent): void {
    this.isDragging.set(true);
    const element = this.elementRef.nativeElement;
    this.dragStart.emit({
      element,
      x: event.clientX,
      y: event.clientY,
    });
  }

  protected onDragEnd(event: globalThis.DragEvent): void {
    this.isDragging.set(false);
    const element = this.elementRef.nativeElement;
    this.dragEnd.emit({
      element,
      x: event.clientX,
      y: event.clientY,
    });
  }
}
