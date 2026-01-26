# Phase 1: Workspace Context 自動注入 (MANDATORY)

> **注意**: 這是 Event Architecture 實施計畫的第一階段。完成此階段對於後續功能至關重要。

## 任務描述
讓所有 Domain Event 自動包含 workspace metadata, 無需手動傳遞。

## 目標
- 從報告的 65% 提升到 75% 完成度
- 風險: 低 (只擴展現有介面)
- 工時: 1-2 天

---

## 實施步驟

### 步驟 1: 擴展 EventMetadata
檔案: `domain/event/event-metadata.ts`

根據報告, 這個檔案已被標記為 deprecated, 我們要重新啟用它:

```typescript
/**
 * Event Metadata - Re-activated for Workspace Context
 * 包含事件的上下文資訊, 用於多租戶隔離和追蹤
 */
export interface EventMetadata {
  // 現有欄位 (保留)
  readonly eventId: string;
  readonly eventType: string;
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causationId: string | null;
  
  // ✨ 新增 Workspace Context
  readonly workspaceId: string;       // 多租戶隔離
  readonly moduleType?: string;       // 模組分類 (tasks/documents/daily 等)
  readonly userId?: string;           // 操作者
  readonly aggregateId?: string;      // 聚合根 ID
  readonly version?: number;          // 事件版本 (未來用於 Event Upcasting)
}
```

### 步驟 2: 修改 DomainEvent 基礎介面
檔案: `domain/event/domain-event.ts`

根據報告, 當前結構是:
```typescript
export interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
}
```

修改為:
```typescript
export interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
  readonly metadata: EventMetadata;  // ✨ 新增
}
```

### 步驟 3: 建立 Workspace Context Service
新檔案: `infrastructure/context/workspace-context.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { WorkspaceContextStore } from '../../application/workspace/stores/workspace-context.store';
import { EventMetadata } from '../../domain/event/event-metadata';

/**
 * Workspace Context Service
 * 提供當前 Workspace 上下文, 供 Domain Event 自動注入
 */
@Injectable({
  providedIn: 'root'
})
export class WorkspaceContextService {
  private readonly workspaceStore = inject(WorkspaceContextStore);

  /**
   * 獲取當前 Workspace ID
   */
  getCurrentWorkspaceId(): string {
    const workspaceId = this.workspaceStore.currentWorkspaceId?.();
    if (!workspaceId) {
      throw new Error('No active workspace context. Ensure workspace is selected.');
    }
    return workspaceId;
  }

  /**
   * 為事件建立 Metadata
   */
  createEventMetadata(overrides?: Partial<EventMetadata>): EventMetadata {
    const workspaceId = this.getCurrentWorkspaceId();
    
    return {
      eventId: crypto.randomUUID(),
      eventType: overrides?.eventType || '',
      workspaceId: overrides?.workspaceId || workspaceId,
      moduleType: overrides?.moduleType,
      timestamp: Date.now(),
      correlationId: overrides?.correlationId || crypto.randomUUID(),
      causationId: overrides?.causationId || null,
      userId: overrides?.userId,
      aggregateId: overrides?.aggregateId,
      version: overrides?.version || 1
    };
  }

  /**
   * 檢查當前是否在 Workspace 上下文中
   */
  hasActiveWorkspace(): boolean {
    return !!this.workspaceStore.currentWorkspaceId?.();
  }
}
```

### 步驟 4: 更新 3 個 Event Factory 作為示範
根據報告, 選擇這三個檔案範例進行修改 (請確保修改其餘相關 Event Factory):
- `domain/events/domain-events/task-created.event.ts`
- `domain/events/domain-events/task-completed.event.ts`
- `domain/events/domain-events/document-uploaded.event.ts`

修改 `task-created.event.ts` 範例:

```typescript
import { DomainEvent, EventMetadata } from '../../event';
import { inject } from '@angular/core';
import { WorkspaceContextService } from '../../../infrastructure/context/workspace-context.service';

export interface TaskCreatedPayload {
  taskId: string;
  workspaceId: string;  // 保留 (向後相容)
  title: string;
  description: string;
  priority: string;
  createdById: string;
}

export type TaskCreatedEvent = DomainEvent<TaskCreatedPayload>;

/**
 * ✨ 改進版: 自動注入 workspace context
 */
export function createTaskCreatedEvent(
  taskId: string,
  workspaceId: string,  // 保留參數 (向後相容)
  title: string,
  description: string,
  priority: string,
  createdById: string,
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  // ✨ 使用 WorkspaceContextService 自動獲取 workspace
  const contextService = inject(WorkspaceContextService, { optional: true });
  const actualWorkspaceId = contextService?.getCurrentWorkspaceId() || workspaceId;

  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  return {
    eventId,
    type: 'TaskCreated',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      taskId,
      workspaceId: actualWorkspaceId,
      title,
      description,
      priority,
      createdById,
    },
    // ✨ 新增 metadata
    metadata: {
      eventId,
      eventType: 'TaskCreated',
      workspaceId: actualWorkspaceId,
      moduleType: 'tasks',  // ✨ 標記模組類型
      timestamp: Date.now(),
      correlationId: newCorrelationId,
      causationId: causationId ?? null,
      userId: createdById,
      aggregateId: taskId,
      version: 1
    }
  };
}
```

### 步驟 5: 驗證
新建測試檔案: `infrastructure/context/workspace-context.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { WorkspaceContextService } from './workspace-context.service';
import { WorkspaceContextStore } from '../../application/workspace/stores/workspace-context.store';
import { createTaskCreatedEvent } from '../../domain/events/domain-events/task-created.event';

describe('WorkspaceContextService', () => {
  it('should auto-inject workspaceId into events', () => {
    TestBed.configureTestingModule({
      providers: [
        WorkspaceContextService,
        {
          provide: WorkspaceContextStore,
          useValue: {
            currentWorkspaceId: () => 'ws-test-123'
          }
        }
      ]
    });

    const event = createTaskCreatedEvent(
      'task-1',
      '', // ✨ 可以傳空字串, 會自動填充
      'Test Task',
      'Description',
      'high',
      'user-1'
    );

    expect(event.metadata.workspaceId).toBe('ws-test-123');
    expect(event.metadata.moduleType).toBe('tasks');
    expect(event.metadata.eventType).toBe('TaskCreated');
  });
});
```

### ⚠️ 檢查點:
1. 編譯是否通過? (`ng build`)
2. 現有測試是否通過? (`ng test`)
3. 事件是否包含完整的 metadata?
4. workspaceId 是否自動注入?

完成後回報:
- 修改了哪些檔案
- 新增了哪些檔案
- 是否有任何衝突或問題

---

## 通用規範 (所有階段適用)

```text
技術要求:

1. Angular 20 控制流:
   - 所有新模板使用 @if/@else
   - 使用 @for 替代 *ngFor
   - 使用 @switch/@case 替代 *ngSwitch
   - 使用 @defer 進行延遲載入

2. @ngrx/signals:
   - 使用 signalStore() 建立 Store
   - 使用 withState() 定義狀態
   - 使用 withComputed() 定義計算屬性
   - 使用 withMethods() 定義方法
   - 使用 rxMethod() 處理非同步操作

3. @angular/fire:
   - 使用 inject(Firestore) 注入
   - 使用 collection(), addDoc(), getDocs()
   - 使用 Timestamp 處理時間
   - 建立適當的 Firestore 索引

4. 向後相容:
   - 不刪除現有 public API
   - 保留現有方法簽名
   - 新功能用「新增」而非「替換」
   - 標記 deprecated 但不移除

5. 命名規範:
   - 檔案: kebab-case (workspace-context.service.ts)
   - Class: PascalCase (WorkspaceContextService)
   - Interface: PascalCase with I prefix optional
   - Signal Store: PascalCase + Store suffix

檢查點:
- 每個階段完成後執行 ng build
- 確認無編譯錯誤
- 手動測試關鍵流程
- 一個階段一個 commit
```

## 執行建議

```text
給 Copilot 的工作流程:

1. 請專注於完成 Phase 1 任務。
2. 完成後回報:
   - 修改的檔案清單
   - 新增的檔案清單
   - 遇到的問題 (如果有)
   - 測試結果
3. 如果遇到衝突或不確定, 立即停止並詢問。
4. 所有的實作都必須通過 `ng build` 驗證。
```
