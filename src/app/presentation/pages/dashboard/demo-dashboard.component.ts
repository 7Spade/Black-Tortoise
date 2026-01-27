import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WorkspaceStore } from '@application/stores/workspace.store';

@Component({
  selector: 'app-demo-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <div class="dashboard-scroll">
        <div class="module-card">
          <h3>Workspace</h3>
          <p>Ready</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./demo-dashboard.component.scss'],
})
export class DemoDashboardComponent {
  readonly workspaceStore = inject(WorkspaceStore);
}
