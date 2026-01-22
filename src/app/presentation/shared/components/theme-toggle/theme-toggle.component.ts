import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

/**
 * ThemeToggleComponent
 * - Presentation 層共用元件：切換應用主題（light / dark）
 * - 註解摘要: 元件只處理 UI 層級的切換與暫存，實際持久化（localStorage、user profile）或
 *   全局樣式應由 Application 層或主題服務負責；此處僅示範 signal 綁定與介面。
 * - 設計要點:
 *   1) 使用 `signal()` 儲存本地狀態，保持元件純粹、無副作用。
 *   2) 若需跨應用共享/持久化，注入 application 層的 store 或 service 並以 rxMethod 處理。
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  // 本地 ui state：是否為深色模式
  isDark = signal(false);

  toggle() {
    // 範例：切換本地狀態並觸發簡單 DOM 類名變更（如需），但建議將樣式變更委派至全局主題服務
    this.isDark.update(v => !v);
    // TODO: 將變更通知 application 層或呼叫注入的 ThemeService 以進行持久化與全域生效
    if (this.isDark()) {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }

  constructor() {
    // 可在此初始化狀態（例如從 localStorage 或注入的 service 讀取），但不要直接存取基礎設施
    // TODO: 用 application 層提供的初始化來源取代下列硬編碼
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark.set(prefersDark);
    if (prefersDark) document.documentElement.classList.add('theme-dark');
  }
}
