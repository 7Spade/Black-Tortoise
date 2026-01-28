/**
 * Overlay Service
 * Presentation Layer - CBK Infrastructure
 * 
 * Manages dynamic overlay instances (dialogs, tooltips, popovers)
 * Pure UI primitive with signal-based state
 */

import { Injectable, signal } from '@angular/core';

export interface OverlayConfig {
  id?: string;
  content?: any;
  position?: { x: number; y: number };
  backdropClick?: boolean;
}

export interface OverlayInstance {
  id: string;
  config: OverlayConfig;
  visible: boolean;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  private overlayCounter = 0;
  
  readonly overlays = signal<OverlayInstance[]>([]);

  open(config: OverlayConfig): string {
    const id = config.id ?? `overlay-${++this.overlayCounter}`;
    const instance: OverlayInstance = {
      id,
      config,
      visible: true,
    };
    
    this.overlays.update(overlays => [...overlays, instance]);
    return id;
  }

  close(id: string): void {
    this.overlays.update(overlays => 
      overlays.filter(overlay => overlay.id !== id)
    );
  }

  closeAll(): void {
    this.overlays.set([]);
  }
}
