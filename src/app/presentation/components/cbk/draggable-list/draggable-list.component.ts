/**
 * Draggable List Component
 * Presentation Layer - CBK
 * 
 * Flat reorderable list with drag-and-drop
 * Signal-based item state
 */

import { Component, input, output, signal } from '@angular/core';

export interface DraggableItem {
  id: string;
  data: any;
}

@Component({
  selector: 'app-draggable-list',
  standalone: true,
  template: `
    <div class="draggable-list">
      @for (item of items(); track item.id) {
        <div class="draggable-list-item"
             [attr.data-item-id]="item.id"
             [class.dragging]="draggedItemId() === item.id">
          {{ item.id }}
        </div>
      }
    </div>
  `,
  styles: [`
    .draggable-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .draggable-list-item {
      padding: 12px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: move;
      user-select: none;
    }
    .draggable-list-item.dragging {
      opacity: 0.5;
    }
  `]
})
export class DraggableListComponent {
  readonly items = input<DraggableItem[]>([]);
  readonly itemsReordered = output<DraggableItem[]>();

  protected readonly draggedItemId = signal<string | null>(null);

  // TODO: Implement drag handlers
}
