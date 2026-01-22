/**
 * Settings Page Component
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
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
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
    this.isDarkMode.update(v => !v);
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
