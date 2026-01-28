/**
 * Settings Component
 *
 * Layer: Presentation
 * Purpose: Unified settings page for application configuration
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display and manage application settings UI
 * - Use signals for local UI state
 * - Delegate state persistence to application layer (store/facade)
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Settings Component Template
     Layer: Presentation
     Architecture: Angular 20+ control flow (@if, @for) -->
    <section class="settings">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="settings-content">
            <h3>Appearance</h3>
            <label class="setting-item">
              <input
                type="checkbox"
                [checked]="isDarkMode()"
                (change)="toggleDarkMode()"
              />
              <span>Dark Mode</span>
            </label>

            <div class="settings-actions">
              <button
                class="save-button"
                (click)="saveSettings()"
                [disabled]="saving()"
              >
                @if (saving()) {
                  Saving...
                } @else {
                  Save Settings
                }
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [
    `
      /**
 * Settings Component Styles
 * Layer: Presentation
 * Architecture: Material 3 tokens
 */

      .settings {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      mat-card {
        margin-bottom: 1rem;
      }

      mat-card-content {
        padding-top: 1rem;
      }

      .settings-content {
        h3 {
          color: var(--mat-sys-on-surface, #1c1b1f);
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .setting-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          cursor: pointer;

          input[type='checkbox'] {
            margin-right: 0.75rem;
            cursor: pointer;
          }

          span {
            color: var(--mat-sys-on-surface-variant, #49454f);
            font-size: 0.875rem;
          }
        }

        .settings-actions {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--mat-sys-outline-variant, #c4c7c5);

          .save-button {
            padding: 0.5rem 1.5rem;
            background-color: var(--mat-sys-primary, #6750a4);
            color: var(--mat-sys-on-primary, #ffffff);
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;

            &:hover:not(:disabled) {
              background-color: var(--mat-sys-primary-container, #eaddff);
              color: var(--mat-sys-on-primary-container, #21005d);
            }

            &:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          }
        }
      }
    `,
  ],
})
export class SettingsComponent {
  /**
   * Local UI signals - demonstration only
   * In production, these should be managed by application layer store
   */
  isDarkMode = signal<boolean>(false);
  saving = signal<boolean>(false);

  /**
   * Toggle dark mode setting
   * TODO: Delegate to application layer store with rxMethod
   */
  toggleDarkMode(): void {
    this.isDarkMode.update((v) => !v);
  }

  /**
   * Save settings
   * TODO: Replace with rxMethod + store for reactive persistence
   */
  saveSettings(): void {
    this.saving.set(true);
    // Simulate async save - replace with real store interaction
    setTimeout(() => this.saving.set(false), 600);
  }
}
