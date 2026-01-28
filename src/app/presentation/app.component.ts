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

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GlobalShellComponent } from '@shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GlobalShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-shell />`,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent { }
