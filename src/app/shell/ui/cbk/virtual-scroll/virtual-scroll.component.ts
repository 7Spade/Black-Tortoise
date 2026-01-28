/**
 * Virtual Scroll Component
 * Presentation Layer - CBK
 * 
 * Efficient rendering of large lists via virtualization
 * Signal-based viewport state
 */

import { Component, input, signal, computed } from '@angular/core';

export interface VirtualScrollConfig {
  itemHeight: number;
  bufferSize?: number;
}

@Component({
  selector: 'app-virtual-scroll',
  standalone: true,
  template: `
    <div class="virtual-scroll-container"
         [style.height.px]="containerHeight()">
      <div class="virtual-scroll-content"
           [style.height.px]="totalHeight()">
        <div class="virtual-scroll-viewport"
             [style.transform]="viewportTransform()">
          @for (item of visibleItems(); track $index) {
            <div class="virtual-scroll-item"
                 [style.height.px]="config().itemHeight">
              {{ item }}
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .virtual-scroll-container {
      overflow-y: auto;
      position: relative;
    }
    .virtual-scroll-content {
      position: relative;
    }
    .virtual-scroll-viewport {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .virtual-scroll-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border-bottom: 1px solid #e0e0e0;
    }
  `]
})
export class VirtualScrollComponent {
  readonly items = input<any[]>([]);
  readonly config = input<VirtualScrollConfig>({ itemHeight: 40, bufferSize: 5 });
  readonly containerHeight = input<number>(400);

  protected readonly scrollTop = signal(0);
  protected readonly visibleStartIndex = signal(0);
  protected readonly visibleEndIndex = signal(0);

  protected readonly totalHeight = computed(() => {
    return this.items().length * this.config().itemHeight;
  });

  protected readonly visibleItems = computed(() => {
    const start = this.visibleStartIndex();
    const end = this.visibleEndIndex();
    return this.items().slice(start, end);
  });

  protected readonly viewportTransform = computed(() => {
    const offset = this.visibleStartIndex() * this.config().itemHeight;
    return `translateY(${offset}px)`;
  });

  // TODO: Implement scroll handlers to update visibleStartIndex/visibleEndIndex
}
