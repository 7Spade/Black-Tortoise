# Phase 4: QC Module 自動觸發

> **注意**: 在開始此階段前，請確保 Phase 3: 跨模組事件路由 已經完成並通過驗證。

## 任務描述
當 Task 提交質檢時 (Task Submitted for QC), QC Module 自動建立檢查項。

---

## 實施步驟

### 步驟 1: 在 QC Event Handlers 新增處理器
檔案: `application/quality-control/handlers/quality-control.event-handlers.ts`

```typescript
import { inject } from '@angular/core';
import { EventBus } from '../../../domain/shared/events/event-bus/event-bus.interface';
import { QualityControlStore } from '../stores/quality-control.store';
import { DomainEvent } from '../../../domain/shared/events/domain-event';

/**
 * ✨ 新增: Task Submitted for QC 事件處理
 */
export function handleTaskSubmittedForQC(event: DomainEvent<any>): void {
  const qcStore = inject(QualityControlStore);
  
  console.log('🔍 QC Module received TaskSubmittedForQC:', {
    taskId: event.payload.taskId,
    workspaceId: event.metadata?.workspaceId
  });

  // 自動建立質檢項
  qcStore.createInspection({
    taskId: event.payload.taskId,
    taskTitle: event.payload.taskTitle,
    workspaceId: event.metadata?.workspaceId || '',
    submittedBy: event.metadata?.userId || '',
    submittedAt: new Date(event.timestamp),
    status: 'pending',
    priority: event.payload.priority || 'normal'
  });
}

/**
 * 註冊 QC Module 的 Event Handlers
 */
export function registerQualityControlEventHandlers(eventBus: EventBus): void {
  // ✨ 訂閱 TaskSubmittedForQC 事件
  eventBus.subscribe<any>('TaskSubmittedForQC', handleTaskSubmittedForQC);
  
  console.log('✅ QC Module event handlers registered');
}
```

### 步驟 2: 擴展 QC Store
檔案: `application/quality-control/stores/quality-control.store.ts`

```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

// ✨ 新增 Inspection 介面
export interface Inspection {
  id: string;
  taskId: string;
  taskTitle: string;
  workspaceId: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'in_progress' | 'passed' | 'failed';
  priority: string;
  createdAt: Date;
}

export interface InspectionRequest {
  taskId: string;
  taskTitle: string;
  workspaceId: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'in_progress' | 'passed' | 'failed';
  priority: string;
}

export interface QCState {
  inspections: Inspection[];
  loading: boolean;
  error: string | null;
}

export const QualityControlStore = signalStore(
  { providedIn: 'root' },
  
  withState<QCState>({
    inspections: [],
    loading: false,
    error: null
  }),

  withComputed((store) => ({
    // ✨ 計算待檢查項目
    pendingInspections: computed(() =>
      store.inspections().filter(i => i.status === 'pending')
    ),
    
    pendingCount: computed(() =>
      store.inspections().filter(i => i.status === 'pending').length
    )
  })),

  withMethods((store) => ({
    // ✨ 新增: 建立質檢項
    createInspection: rxMethod<InspectionRequest>(
      pipe(
        tap((request) => {
          const newInspection: Inspection = {
            id: crypto.randomUUID(),
            ...request,
            createdAt: new Date()
          };
          
          patchState(store, {
            inspections: [...store.inspections(), newInspection]
          });
          
          console.log('🔍 QC Inspection created:', newInspection);
        })
      )
    )
  }))
);
```

### 步驟 3: 在 QC Module 註冊 Handlers
檔案: `presentation/workspaces/modules/quality-control.module.ts`

```typescript
import { registerQualityControlEventHandlers } from '../../../application/quality-control/handlers/quality-control.event-handlers';

export class QualityControlModule extends BaseModule {
  override onActivate(): void {
    super.onActivate();
    
    // ✨ 註冊事件處理器
    registerQualityControlEventHandlers(this.eventBus);
    
    console.log('✅ QC Module activated with event handlers');
  }
}
```

### 測試:
1. 在 Tasks Module 提交任務到質檢
2. 確認 Console 訊息
3. 檢查 `QualityControlStore.pendingInspections()`
4. 驗證 workspaceId 隔離

完成後回報:
- QC Module 是否自動建立檢查項?
- pendingCount 是否正確更新?

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

1. 請專注於完成 Phase 4 任務。
2. 完成後回報:
   - 修改的檔案清單
   - 新增的檔案清單
   - 遇到的問題 (如果有)
   - 測試結果
3. 如果遇到衝突或不確定, 立即停止並詢問。
4. 所有的實作都必須通過 `ng build` 驗證。
```
