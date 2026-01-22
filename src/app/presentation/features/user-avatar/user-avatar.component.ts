import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * UserAvatarComponent
 *
 * 為簡單的呈現元件（presentational component）。
 * 設計原則：
 * - 只有顯示相關的 UI 與 local state（使用 Signals），不包含商業邏輯或直接存取基礎層。
 * - 不直接呼叫基礎設施或 repository；若需資料，應由 Application 層的 service/Facade 提供。
 * - 使用 standalone component（Angular 現代化慣例）並開啟 OnPush 以利效能。
 *
 * 下一步：把 `avatarUrl` 從應用層的 store 或 facade 注入或綁定（例如透過輸入值或注入的 service）。
 */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  // Local signal for the avatar URL. 初始值為 null，代表尚未載入或使用預設頭像。
  // 為何使用 signal(): 本元件的狀態為 UI 本地狀態，使用 Signals 符合現代 Angular 的 reactive 慣例。
  avatarUrl = signal<string | null>(null);

  // NOTE: 不在此處執行 I/O 或直接訂閱 Observables；若需非同步資料，應由上層注入一個 facade 並以 signals 供應。
}
