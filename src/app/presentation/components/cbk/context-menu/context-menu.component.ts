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
      <div class="context-menu"
           [style.left.px]="menuService.menuState().x"
           [style.top.px]="menuService.menuState().y">
        @for (item of menuService.menuState().items; track $index) {
          @if (item.divider) {
            <div class="context-menu-divider"></div>
          } @else {
            <button class="context-menu-item"
                    [disabled]="item.disabled"
                    (click)="onItemClick(item)">
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
  styles: [`
    .context-menu {
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 150px;
      z-index: 1000;
    }
    .context-menu-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
    }
    .context-menu-item:hover:not(:disabled) {
      background: #f5f5f5;
    }
    .context-menu-divider {
      height: 1px;
      background: #e0e0e0;
      margin: 4px 0;
    }
  `]
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
