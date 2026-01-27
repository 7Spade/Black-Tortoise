/**
 * Workspace Page Component
 *
 * Layer: Presentation - Pages
 * Purpose: Entry point for workspace routes
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Page-level container for workspace host
 * - Single responsibility: render workspace host component
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkspaceHostComponent } from '@presentation/components/workspace-host.component';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [WorkspaceHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-workspace-host />`,
  styleUrls: ['./workspace.page.scss'],
})
export class WorkspacePage {}
