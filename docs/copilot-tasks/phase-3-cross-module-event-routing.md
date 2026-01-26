# Phase 3: 跨模組事件路由 (Daily 監聽 Tasks)

> **注意**: 在開始此階段前，請確保 Phase 2: Firestore Event Store 已經完成並通過驗證。

## 任務描述
實現 Daily Module 自動記錄 Task 完成事件，這是跨模組事件路由的示範。

---

## 實施步驟

### 步驟 1: 確認現有的 Event Handler 註冊機制
檔案: `application/daily/handlers/daily.event-handlers.ts`

根據報告, 這個檔案已存在。請檢查當前結構:
- 是否有 `registerDailyEventHandlers()` 函數?
- 是否已監聽任何事件?

### 步驟 2: 新增 TaskCompleted Handler
在 `application/daily/handlers/daily.event-handlers.ts` 中新增:

```typescript
import { inject } from '@angular/core';
import { EventBus } from '../../../domain/event-bus/event-bus.interface';
import { DailyStore } from '../stores/daily.store';
import { DomainEvent } from '../../../domain/event/domain-event';

/**
 * ✨ 新增: Task Completed 事件處理
 * 當 Task 完成時, 自動記錄到 Daily
 */
export function handleTaskCompleted(event: DomainEvent<any>): void {
  const dailyStore = inject(DailyStore);
  
  console.log('📝 Daily Module received TaskCompleted:', {
    taskId: event.payload.taskId,
    workspaceId: event.metadata?.workspaceId,
    moduleType: event.metadata?.moduleType
  });

  // 記錄到 Daily Store
  dailyStore.recordActivity({
    type: 'task_completed',
    taskId: event.payload.taskId,
    taskTitle: event.payload.title,
    timestamp: new Date(event.timestamp),
    workspaceId: event.metadata?.workspaceId || '',
    userId: event.metadata?.userId
  });
}

/**
 * 註冊 Daily Module 的 Event Handlers
 */
export function registerDailyEventHandlers(eventBus: EventBus): void {
  // ✨ 訂閱 TaskCompleted 事件
  eventBus.subscribe<any>('TaskCompleted', handleTaskCompleted);
  
  console.log('✅ Daily Module event handlers registered');
}
```

### 步驟 3: 擴展 DailyStore
檔案: `application/daily/stores/daily.store.ts`

新增 activities 狀態和 recordActivity 方法:

```typescript
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

// ✨ 新增 Activity 介面
export interface Activity {
  type: string;
  taskId?: string;
  taskTitle?: string;
  timestamp: Date;
  workspaceId: string;
  userId?: string;
}

export interface DailyState {
  entries: DailyEntry[];
  activities: Activity[];  // ✨ 新增
  loading: boolean;
  error: string | null;
}

export const DailyStore = signalStore(
  { providedIn: 'root' },
  
  withState<DailyState>({
    entries: [],
    activities: [],  // ✨ 新增
    loading: false,
    error: null
  }),

  withMethods((store) => ({
    // ... 現有方法保留

    // ✨ 新增: 記錄活動
    recordActivity: rxMethod<Activity>(
      pipe(
        tap((activity) => {
          patchState(store, {
            activities: [...store.activities(), activity]
          });
          
          console.log('📋 Activity recorded:', activity);
        })
      )
    ),

    // ✨ 新增: 清除活動記錄
    clearActivities(): void {
      patchState(store, { activities: [] });
    }
  }))
);
```

### 步驟 4: 在 Daily Module 初始化時註冊 Handlers
檔案: `presentation/workspaces/modules/daily.module.ts`

```typescript
import { registerDailyEventHandlers } from '../../../application/daily/handlers/daily.event-handlers';

export class DailyModule extends BaseModule {
  override onActivate(): void {
    super.onActivate();
    
    // ✨ 註冊事件處理器
    registerDailyEventHandlers(this.eventBus);
    
    console.log('✅ Daily Module activated with event handlers');
  }
}
```

### 測試流程:
1. 切換到包含 Daily Module 的 Workspace
2. 在 Tasks Module 完成一個任務
3. 打開 Console 確認訊息:
   - "📝 Daily Module received TaskCompleted: ..."
   - "📋 Activity recorded: ..."
4. 檢查 `DailyStore.activities()` signal 是否有新記錄:
   ```typescript
   const dailyStore = inject(DailyStore);
   console.log('Activities:', dailyStore.activities());
   ```

完成後回報:
- Daily Module 是否成功接收 TaskCompleted 事件?
- DailyStore.activities() 是否有記錄?
- workspaceId 是否正確?

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

1. 請專注於完成 Phase 3 任務。
2. 完成後回報:
   - 修改的檔案清單
   - 新增的檔案清單
   - 遇到的問題 (如果有)
   - 測試結果
3. 如果遇到衝突或不確定, 立即停止並詢問。
4. 所有的實作都必須通過 `ng build` 驗證。
```
