import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-settings-entry',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="settings-entry">
      <h2>Settings</h2>
      <p>Settings are not implemented yet.</p>
    </section>
  `,
  styles: [`
    .settings-entry {
      padding: 2rem;
    }
  `],
})
export class SettingsEntryComponent {}
