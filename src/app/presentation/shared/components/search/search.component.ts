import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

/**
 * SearchComponent
 * - Presentation 層的共用搜尋元件（Standalone component）
 * - 註解摘要: 元件僅負責顯示與輸入（query）行為；實際搜尋應由 Application 層（store / service / use-case）執行。
 * - 設計要點:
 *   1) 使用 `signal()` 儲存本地輸入狀態以便 UI 綁定。
 *   2) 不在元件內直接呼叫基礎設施或執行副作用；改由注入的 store 或外部 handler 處理。
 *   3) 若需要 debounce / 非同步控制，請在 application 層以 rxMethod/tapResponse 或相應策略處理。
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  // 本地 UI state：使用者輸入的查詢字串
  query = signal('');

  // 範例事件發射方法：實際系統應提供 callback 或注入 store
  onQueryChange(value: string) {
    // TODO: 將此事件傳遞給 application 層的搜尋 handler（不要在此直接發出網路請求）
    this.query.set(value);
  }

  // 當按下搜尋時呼叫（示範）
  submit() {
    // TODO: 呼叫注入的 service 或 dispatch action（示範用）
    console.log('Search submitted:', this.query());
  }
}
