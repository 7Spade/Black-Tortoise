import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

/**
 * ProfileComponent
 * - Presentation layer 元件，用於顯示使用者個人檔案
 * - 註解: 實際資料來源應由 Application 層 (store / use-case) 提供。
 * - 此範例使用 `signal()` 與 `computed()` 示範呈現邏輯；請勿在此元件內包含商業邏輯或直接存取基礎設施。
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  // 使用 signal 儲存目前顯示的使用者資料（Presentation 層暫存）
  userProfile = signal<{ id: string; firstName: string; lastName: string; email?: string } | null>(null);

  // derived: 顯示完整名稱。保持純粹、無副作用。
  fullName = computed(() => {
    const p = this.userProfile();
    return p ? `${p.firstName} ${p.lastName}` : '未登入';
  });

  // 範例載入方法：在真實系統中應呼叫 application 層的 use-case/store
  loadProfile() {
    // TODO: 將此呼叫替換為注入的 application store 或 use-case
    this.userProfile.set({ id: 'user-1', firstName: '示例', lastName: '使用者', email: 'user@example.com' });
  }

  constructor() {
    // 簡單初始化以利開發檢視；生產環境請由 store / resolver 提供
    this.loadProfile();
  }
}
