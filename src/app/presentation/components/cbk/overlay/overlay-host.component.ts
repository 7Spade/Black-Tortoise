/**
 * Overlay Host Component
 * Presentation Layer - CBK Infrastructure
 *
 * Container component for rendering overlay instances
 * Consumes OverlayService state via signals
 */

import { Component, inject } from '@angular/core';
import { OverlayService } from './overlay.service';

@Component({
  selector: 'app-overlay-host',
  standalone: true,
  template: `
    <div class="overlay-host">
      @for (overlay of overlayService.overlays(); track overlay.id) {
        <div class="overlay-backdrop" [attr.data-overlay-id]="overlay.id">
          <!-- Overlay content placeholder -->
          <div class="overlay-content">
            {{ overlay.id }}
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./overlay-host.component.scss'],
})
export class OverlayHostComponent {
  protected readonly overlayService = inject(OverlayService);
}
