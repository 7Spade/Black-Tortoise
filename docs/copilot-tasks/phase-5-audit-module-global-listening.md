# Phase 5: Audit Module 全局監聽

> **注意**: 在開始此階段前，請確保 Phase 4: QC Module 自動觸發 已經完成並通過驗證。

## 任務描述
Audit Module 記錄所有 Domain Events (全域事件監聽)。

---

## 實施步驟

### 步驟 1: 擴展 InMemoryEventBus 支援全局訂閱
檔案: `infrastructure/events/in-memory-event-bus.impl.ts`

```typescript
export class InMemoryEventBus implements EventBus {
  private readonly typeHandlers = new Map<string, Set<EventHandler>>();
  private readonly globalHandlers = new Set<EventHandler>();  // ✨ 新增

  // ... 現有方法保留

  /**
   * ✨ 新增: 訂閱所有事件 (用於 Audit Module)
   */
  subscribeAll(handler: EventHandler): UnsubscribeFunction {
    this.globalHandlers.add(handler);
    
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    // 通知特定類型的訂閱者
    const handlers = this.typeHandlers.get(event.type) || new Set();
    const promises: Promise<void>[] = [];

    for (const handler of handlers) {
      promises.push(Promise.resolve(handler(event)));
    }

    // ✨ 通知全局訂閱者 (Audit Module)
    for (const handler of this.globalHandlers) {
      promises.push(Promise.resolve(handler(event)));
    }

    await Promise.all(promises);
  }
}
```

### 步驟 2: 建立 Audit Event Handler
新檔案: `application/audit/handlers/audit.event-handlers.ts`

```typescript
import { inject } from '@angular/core';
import { EventBus } from '../../../domain/shared/events/event-bus/event-bus.interface';
import { AuditStore } from '../stores/audit.store';
import { DomainEvent } from '../../../domain/shared/events/domain-event';

/**
 * ✨ Audit Module 全局事件處理器
 * 記錄所有 Domain Events
 */
export function handleAnyDomainEvent(event: DomainEvent<any>): void {
  const auditStore = inject(AuditStore);
  
  // 記錄到 Audit Store
  auditStore.logEvent({
    eventId: event.eventId,
    eventType: event.type,
    workspaceId: event.metadata?.workspaceId || '',
    moduleType: event.metadata?.moduleType || 'unknown',
    timestamp: new Date(event.timestamp),
    userId: event.metadata?.userId,
    correlationId: event.correlationId,
    causationId: event.causationId,
    payload: event.payload
  });
}

/**
 * 註冊 Audit Module 的全局事件監聽
 */
export function registerAuditEventHandlers(eventBus: any): void {
  // ✨ 訂閱所有事件
  if (typeof eventBus.subscribeAll === 'function') {
    eventBus.subscribeAll(handleAnyDomainEvent);
    console.log('✅ Audit Module subscribed to ALL events');
  } else {
    console.warn('⚠️ EventBus does not support subscribeAll()');
  }
}
```

### 步驟 3: 擴展 AuditStore
檔案: `application/audit/stores/audit.store.ts`

```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

export interface AuditLog {
  eventId: string;
  eventType: string;
  workspaceId: string;
  moduleType: string;
  timestamp: Date;
  userId?: string;
  correlationId: string;
  causationId: string | null;
  payload: any;
}

export interface AuditFilters {
  workspaceId?: string;
  moduleType?: string;
  eventType?: string;
  userId?: string;
}

export interface AuditState {
  logs: AuditLog[];
  filters: AuditFilters;
}

export const AuditStore = signalStore(
  { providedIn: 'root' },
  
  withState<AuditState>({
    logs: [],
    filters: {}
  }),

  withComputed((store) => ({
    // ✨ 過濾後的日誌
    filteredLogs: computed(() => {
      let logs = store.logs();
      const filters = store.filters();
      
      if (filters.workspaceId) {
        logs = logs.filter(l => l.workspaceId === filters.workspaceId);
      }
      if (filters.moduleType) {
        logs = logs.filter(l => l.moduleType === filters.moduleType);
      }
      if (filters.eventType) {
        logs = logs.filter(l => l.eventType === filters.eventType);
      }
      if (filters.userId) {
        logs = logs.filter(l => l.userId === filters.userId);
      }
      
      return logs;
    }),
    
    // ✨ 按模組統計
    logsByModule: computed(() => {
      return store.logs().reduce((acc, log) => {
        acc[log.moduleType] = (acc[log.moduleType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }),
    
    // ✨ 最近 100 條日誌
    recentLogs: computed(() =>
      store.logs().slice(0, 100)
    )
  })),

  withMethods((store) => ({
    // ✨ 記錄事件
    logEvent: rxMethod<AuditLog>(
      pipe(
        tap((log) => {
          patchState(store, {
            logs: [log, ...store.logs()].slice(0, 1000)  // 最多保留 1000 條
          });
          
          console.log('📋 Audit logged:', log.eventType, 'in', log.moduleType);
        })
      )
    ),
    
    // ✨ 設定過濾條件
    setFilters(filters: Partial<AuditFilters>): void {
      patchState(store, {
        filters: { ...store.filters(), ...filters }
      });
    },
    
    // ✨ 清除過濾
    clearFilters(): void {
      patchState(store, { filters: {} });
    },
    
    // ✨ 清除日誌
    clearLogs(): void {
      patchState(store, { logs: [] });
    }
  }))
);
```

### 步驟 4: 在 Audit Module 註冊
檔案: `presentation/workspaces/modules/audit.module.ts`

```typescript
import { registerAuditEventHandlers } from '../../../application/audit/handlers/audit.event-handlers';

export class AuditModule extends BaseModule {
  override onActivate(): void {
    super.onActivate();
    
    // ✨ 註冊全局事件監聽
    registerAuditEventHandlers(this.eventBus);
    
    console.log('✅ Audit Module activated with global event listener');
  }
}
```

### 測試:
1. 執行任何操作 (建立 Task、完成 Task、上傳文件)
2. 檢查 `AuditStore.logs()`
3. 測試過濾功能
4. 驗證 `logsByModule` 統計

完成後回報:
- 是否記錄所有事件?
- 過濾功能是否正常?
- 統計是否正確?

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

1. 請專注於完成 Phase 5 任務。
2. 完成後回報:
   - 修改的檔案清單
   - 新增的檔案清單
   - 遇到的問題 (如果有)
   - 測試結果
3. 如果遇到衝突或不確定, 立即停止並詢問。
4. 所有的實作都必須通過 `ng build` 驗證。
```
