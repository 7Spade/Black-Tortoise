import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * ContextSwitcherComponent
 *
 * 功能與設計指引：
 * - 本元件負責顯示與切換應用程式的當前上下文（例如 workspace/identity）。
 * - 不在此處直接操作 domain 或基礎設施；應透過 application 層的 facade/store 發出切換指令。
 * - 使用 Signals 管理 UI local state（例如下拉開關狀態），並保留單一來源的真相（single source of truth）。
 */
@Component({
  selector: 'app-context-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-switcher.container.html',
  styleUrls: ['./context-switcher.container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextSwitcherContainer {
  // 下拉菜單是否開啟的本地 state
  isOpen = signal(false);

  // TODO: 在 application/facade 中建立 API 以取得 context 列表與執行切換。
  // 例如: contextFacade.switchTo(newContextId)

  toggle() {
    this.isOpen.update(v => !v);
  }
}
