/**
 * App Component (Root Shell)
 * 
 * Domain-Driven Design: Presentation Layer
 * Layer: Presentation (Root Component)
 * Architecture: Zone-less, Signal-based
 * 
 * This is the root component of the application that provides the
 * router outlet for all routed components.
 * 
 * Zone-less Compliance:
 * - Standalone component (no NgModule)
 * - OnPush change detection strategy
 * - No Zone.js dependency
 * - Compatible with signal-based routing
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
