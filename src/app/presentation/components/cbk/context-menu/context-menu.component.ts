/**
 * Context Menu Component
 * Presentation Layer - CBK Infrastructure
 *
 * Renders context menu UI
 * Consumes ContextMenuService state via signals
 */

import { Component, inject } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  template: `
    @if (menuService.menuState().visible) {
      <div
        class="context-menu"
        [style.left.px]="menuService.menuState().x"
        [style.top.px]="menuService.menuState().y"
      >
        @for (item of menuService.menuState().items; track $index) {
          @if (item.divider) {
            <div class="context-menu-divider"></div>
          } @else {
            <button
              class="context-menu-item"
              [disabled]="item.disabled"
              (click)="onItemClick(item)"
            >
              @if (item.icon) {
                <span class="context-menu-icon">{{ item.icon }}</span>
              }
              <span class="context-menu-label">{{ item.label }}</span>
            </button>
          }
        }
      </div>
    }
  `,
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  protected readonly menuService = inject(ContextMenuService);

  protected onItemClick(item: any): void {
    if (item.action) {
      item.action();
    }
    this.menuService.hide();
  }
}
