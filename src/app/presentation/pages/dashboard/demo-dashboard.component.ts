/**
 * Demo Dashboard Component
 * 
 * Layer: Presentation
 * Purpose: Demo implementation of workspace overview dashboard
 * Architecture: Zone-less, OnPush, Angular 20 control flow
 */

import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo-dashboard.component.html',
  styleUrls: ['./demo-dashboard.component.scss']
})
export class DemoDashboardComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
}
