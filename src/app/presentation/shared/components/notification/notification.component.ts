import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

/**
 * NotificationComponent
 * - Presentation 層共用通知清單元件（可用於顯示 toast / 列表）
 * - 註解摘要: 元件管理 UI 層級的通知顯示；通知的來源（新增/移除）應由 application 層或服務提供。
 * - 設計要點:
 *   1) 將通知維持在簡單的純資料陣列中（id、message、type、timestamp）。
 *   2) 不在元件內直接呼叫後端。新增/移除應透過注入的 store/service。此處僅提供本地示範 API。
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  notifications = signal<Array<{ id: string; message: string; type?: 'info' | 'warning' | 'error'; ts: number }>>([]);

  // 本地示範：新增通知。實際應由 application 層觸發。
  addNotification(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    const note = { id: Date.now().toString(), message, type, ts: Date.now() };
    this.notifications.update(arr => [note, ...arr]);
  }

  // 移除通知
  dismiss(id: string) {
    this.notifications.update(arr => arr.filter(n => n.id !== id));
  }

  // 範例初始化（開發用）
  constructor() {
    this.addNotification('歡迎！這只是示範通知', 'info');
  }
}
