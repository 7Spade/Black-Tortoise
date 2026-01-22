import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

/**
 * SettingsPageComponent
 * - Presentation layer 的設定頁面範例
 * - 註解: 實際設定的讀取/儲存應由 Application 層的 store 或 service 負責。
 */
@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {
  // 示範性本地 signal，僅作 UI 暫存使用
  isDarkMode = signal<boolean>(false);
  saving = signal<boolean>(false);

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
  }

  // 範例儲存行為：請用 rxMethod + store 取代直接 setTimeout
  saveSettings() {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 600);
  }
}
