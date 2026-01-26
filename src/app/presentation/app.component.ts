/**
 * Root Application Component
 * 
 * Layer: Presentation
 * Architecture: Zone-less, Standalone Component
 * 
 * Responsibilities:
 * - Render global shell component only
 * - NO router-outlet (shell contains the only router-outlet)
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GlobalShellComponent } from '@presentation/shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GlobalShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-shell />`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {}
