/**
 * Team Switcher Container Component
 *
 * Layer: Presentation
 * Purpose: Team switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - UI controls only - emits user intent events
 * - Must NOT open dialog or interpret dialog result
 * - Must only call facade for app actions (switch team)
 * - Uses TeamCreateTriggerComponent for dialog opening
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { filter, tap } from 'rxjs/operators';
import { TeamCreateResult } from '../../features/team/models/team-create-result.model';
import { TeamCreateTriggerComponent } from './components/team-create-trigger/team-create-trigger.component';

// Import facade (to be created)
import { HeaderFacade } from '../../features/header/facade/header.facade';

@Component({
  selector: 'app-team-switcher',
  standalone: true,
  imports: [CommonModule, TeamCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./team-switcher.container.scss'],
  template: `
    <!-- Team Switcher -->
    @if (workspaceContext.hasTeam()) {
      <div class="team-switcher">
        <button
          class="team-button"
          (click)="toggleTeamMenu()"
          aria-label="Switch team"
          type="button">
          <span class="material-icons">groups</span>
          <span class="team-name">
            {{ workspaceContext.currentTeamName() }}
          </span>
          <span class="material-icons">expand_more</span>
        </button>

        @if (showTeamMenu()) {
          <div class="team-menu">
            @for (team of workspaceContext.availableTeams(); track team.id) {
              <button
                class="team-menu-item"
                [class.active]="team.id === workspaceContext.currentTeam()?.id"
                (click)="selectTeam(team.id)"
                type="button">
                <span class="material-icons">groups</span>
                <span>{{ team.name }}</span>
              </button>
            }
            <div class="team-menu-divider"></div>
            <button
              class="team-menu-item"
              (click)="createNewTeam()"
              type="button">
              <span class="material-icons">add</span>
              <span>Create Team</span>
            </button>
          </div>
        }
      </div>
    }

    <!-- TeamCreateTriggerComponent - hidden, used programmatically -->
    <app-team-create-trigger />
  `,
})
export class TeamSwitcherContainer {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly facade = inject(HeaderFacade);

  readonly showTeamMenu = signal(false);

  // Reference to trigger component
  private readonly createTrigger = viewChild(TeamCreateTriggerComponent);

  toggleTeamMenu(): void {
    this.showTeamMenu.update(v => !v);
  }

  /**
   * Emit user intent: switch team
   * Delegates to facade for app action
   */
  selectTeam(teamId: string): void {
    this.showTeamMenu.set(false);
    this.facade.switchTeam(teamId);
  }

  /**
   * Emit user intent: create new team
   * Uses TeamCreateTriggerComponent to open dialog
   * Processes result via facade - NO business logic here
   */
  createNewTeam(): void {
    const trigger = this.createTrigger();
    if (!trigger) {
      return;
    }

    // Trigger opens dialog and returns Observable<unknown>
    trigger.openDialog().pipe(
      // Filter and type-narrow to TeamCreateResult
      filter((result): result is TeamCreateResult =>
        result !== null &&
        result !== undefined &&
        typeof result === 'object' &&
        'teamName' in result &&
        typeof (result as TeamCreateResult).teamName === 'string' &&
        !!(result as TeamCreateResult).teamName
      ),
      // Delegate to facade for app action
      tap((result) => {
        this.showTeamMenu.set(false);
        this.facade.createTeam(result);
      })
    ).subscribe({
      error: () => {
        this.workspaceContext.setError('Failed to process dialog result');
      }
    });
  }
}