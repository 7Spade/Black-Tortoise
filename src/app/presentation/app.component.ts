/**
 * Root Application Component
 * 
 * Layer: Presentation
 * Architecture: Zone-less, Standalone Component
 */

import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceContextStore } from '../application/stores/workspace-context.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet />`,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  private readonly workspaceContext = inject(WorkspaceContextStore);
  
  ngOnInit(): void {
    // Load demo data on app initialization
    this.workspaceContext.loadDemoData();
  }
}
