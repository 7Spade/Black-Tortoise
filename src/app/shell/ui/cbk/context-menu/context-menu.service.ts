/**
 * Context Menu Service
 * Presentation Layer - CBK Infrastructure
 * 
 * Manages context menu state and positioning
 * Pure presentation logic with signal-based state
 */

import { Injectable, signal } from '@angular/core';

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  readonly menuState = signal<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  show(x: number, y: number, items: ContextMenuItem[]): void {
    this.menuState.set({
      visible: true,
      x,
      y,
      items,
    });
  }

  hide(): void {
    this.menuState.update(state => ({
      ...state,
      visible: false,
    }));
  }

  toggle(x: number, y: number, items: ContextMenuItem[]): void {
    const current = this.menuState();
    if (current.visible) {
      this.hide();
    } else {
      this.show(x, y, items);
    }
  }
}
