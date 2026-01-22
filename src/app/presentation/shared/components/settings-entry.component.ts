import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings-entry',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="settings-entry">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Settings are not implemented yet. This is a placeholder for future functionality.</p>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: [`
    .settings-entry {
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

    p {
      color: var(--mat-sys-on-surface-variant, #49454f);
      font-size: 0.875rem;
      line-height: 1.5;
    }
  `],
})
export class SettingsEntryComponent {}
