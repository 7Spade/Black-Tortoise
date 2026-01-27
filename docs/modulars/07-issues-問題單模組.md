# 問題單模組 (IssuesModule) - 開發指南

**模組編號**：07-issues
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
異常與缺失追蹤 (Defect Tracking)，管理所有工作流中的問題

### 邊界定義
追蹤問題的生命週期，與任務狀態掛鉤，確保閉環

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. 問題單建立

#### 需求清單
1. 自動建立：QC 失敗 / 驗收失敗時系統自動建立
2. 手動建立：使用者在任務頁面或問題單模組手動建立
3. 問題單屬性：標題、描述、類型、優先級、狀態、關聯任務、指派人員、報告者
4. 類型：Defect、Bug、Requirement Change、Question
5. 優先級：Low, Medium, High, Critical
6. 狀態：Open, InProgress, Resolved, Closed, Reopened
7. 支援上傳附件 (截圖、日誌等)
8. 支援貼上截圖 (Clipboard)

### 2. 問題單生命週期

#### 需求清單
1. 狀態流轉：Open → InProgress → Resolved → Closed
2. 任何階段可 Reopen
3. Open：問題單剛建立，待處理
4. InProgress：指派人員開始處理
5. Resolved：問題已解決，等待驗證
6. Closed：問題已驗證關閉，不可再修改
7. Reopened：問題驗證未通過，重新開啟
8. 問題單為 Open / InProgress 時，關聯任務狀態為 Blocked
9. 問題單 Resolved 時，通知任務負責人驗證
10. 問題單 Closed 時，檢查是否所有關聯問題單都已關閉
11. 若所有問題單都已關閉，任務自動解除 Blocked 狀態

### 3. 問題單根據處理狀態流轉到模組完成閉環

#### 需求清單
1. QC 失敗產生的問題單 → 解決後 → 任務回到 ReadyForQC
2. 驗收失敗產生的問題單 → 解決後 → 任務回到 ReadyForAcceptance
3. 手動建立的問題單 → 解決後 → 任務繼續原流程
4. 當所有關聯問題單解決後，系統自動提示任務可重新提交
5. 發布 IssueResolved 事件
6. 任務模組訂閱並更新狀態
7. 任務完成前，系統檢查是否有未關閉的問題單
8. 若有，禁止標記任務為 Completed

### 4. 問題單列表與篩選

#### 需求清單
1. 顯示所有問題單，支援排序、篩選、分組
2. 預設依建立時間降序排列
3. 依狀態篩選
4. 依類型篩選
5. 依優先級篩選
6. 依指派人員篩選
7. 依關聯任務篩選
8. 支援批次指派
9. 支援批次關閉
10. 支援批次匯出

### 5. 問題單統計與報表

#### 需求清單
1. 問題單總數 / 開啟數 / 解決數 / 關閉數
2. 平均解決時間 (MTTR)
3. 問題單類型分佈 (圓餅圖)
4. 問題單優先級分佈 (長條圖)
5. 問題單趨勢 (折線圖)
6. 支援匯出為 Excel / CSV / PDF

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護問題單 Map<IssueId, Issue>
- Issue 的生命週期必須與 Task 狀態掛鉤
- 接收到 QCFailed / AcceptanceRejected 事件時，自動預填 Issue

### 模板控制流 (Control Flow)
- **必須**使用 @if / @else 取代 *ngIf
- **必須**使用 @for (item of items; track item.id) 取代 *ngFor
- **必須**使用 @switch / @case 取代 *ngSwitch
- **必須**使用 @defer 進行延遲載入

### 狀態管理 (State Management)
- 使用 NgRx Signals (signalStore) 管理所有狀態
- 禁止使用 BehaviorSubject 或手動 subscribe
- 所有計算屬性使用 computed signal
- 所有副作用使用 effect

### 效能優化
- 啟用 Zone-less Change Detection
- 使用 ChangeDetectionStrategy.OnPush
- 重型視圖使用 @defer (on viewport)
- 次要互動使用 @defer (on interaction)

---

## 四、事件整合

### 發布事件 (Published Events)
- **IssueCreated**
- **IssueUpdated**
- **IssueResolved**
- **IssueClosed**
- **IssueReopened**

### 訂閱事件 (Subscribed Events)
- **QCFailed**
- **AcceptanceRejected**
- **TaskCompleted**
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 直接修改任務狀態，必須透過事件
- ❌ 關閉問題單時未驗證問題是否真正解決
- ❌ 遺漏未關閉問題單而完成任務

---

## 六、測試策略

### Unit Tests
- 測試 computed 邏輯是否正確反映 source signal 的變化
- 測試 pure functions 的輸入輸出
- 禁止測試 effect 的副作用

### Integration Tests
- 測試事件發布與訂閱的契約
- Given 初始 State → When 發出 Command → Then 驗證 Event
- 不驗證 Private Method 或 Private State

### E2E Tests
- 覆蓋關鍵使用者流程
- 驗證 Optimistic UI 的正確回滾

---

## 七、UI/UX 規範

### 設計系統
- 使用 Angular Material (M3)
- 使用 Tailwind CSS (Utility-first)
- 遵循統一的卡片、按鈕、Dialog 佈局

### 無障礙設計 (A11y)
- 支援鍵盤導航
- 使用語意化 HTML
- 重要狀態變更使用 LiveAnnouncer 通知

### Core Web Vitals
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 八、跨模組整合 (Cross-Module Integration)

### 本模組發布 (Published by This Module)

#### Context Provider
```typescript
// Application Layer: 07-issues/application/providers/issues-context.provider.ts
export abstract class IssueContextProvider {
  abstract getOpenIssuesCount(taskId: string): number;
  abstract hasBlockingIssues(taskId: string): boolean;
}
```

#### 發布事件 (Published Events)
- **IssueCreated**
- **IssueResolved**
- **IssueReopened**
- **IssueUpdated**

### 本模組訂閱 (Consumed by This Module)

#### 訂閱事件 (Subscribed Events)
- **QCFailed**
- **AcceptanceRejected**
- **WorkspaceSwitched**

#### 使用的 Context Providers
- **WorkspaceContextProvider**: 查詢當前 Workspace ID

### 整合範例

```typescript
// Application Layer: 07-issues/application/stores/issues.store.ts
export const IssuesStore = signalStore(
  { providedIn: 'root' },
  withState<IssuesState>(initialState),
  withMethods((store) => {
    const eventBus = inject(WorkspaceEventBus);
    const workspaceContext = inject(WorkspaceContextProvider);
    
    return {
      // 業務方法範例
    };
  }),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // 訂閱 WorkspaceSwitched
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
    }
  })
);
```

### 禁止的整合方式

❌ **禁止**：直接注入其他模組的 Store
```typescript
// ❌ 錯誤
export class IssuesStore {
  private taskStore = inject(TaskStore); // 緊密耦合
}
```

✅ **正確**：使用 Context Provider 或 Event Bus
```typescript
export class IssuesStore {
  private workspaceContext = inject(WorkspaceContextProvider); // 鬆散耦合
  private eventBus = inject(WorkspaceEventBus);
}
```

---

## 九、DDD 實作規範

### Aggregate Root: IssueEntity

#### Creation Pattern (產生 Domain Event)
```typescript
// Domain Layer: 07-issues/domain/aggregates/issues.aggregate.ts
export class IssueEntity {
  private constructor(...) {}
  
  public static create(..., eventMetadata?: EventMetadata): IssueEntity {
    // 產生 Domain Event
    // ...
  }
  
  public static reconstruct(props): IssueEntity {
    // 從 Snapshot 重建，不產生 Event
    return new IssueEntity(...);
  }
}
```

#### Factory Pattern (強制執行 Policy)
```typescript
// Domain Layer: 07-issues/domain/factories/issues.factory.ts
export class IssueFactory {
  public static create(..., metadata?: EventMetadata): IssueEntity {
    // 執行 Policy 檢查
    IssueSeverityPolicy.assertIsValid(...);
    
    // 透過 Aggregate 創建
    return IssueEntity.create(..., metadata);
  }
}
```

#### Policy Pattern (封裝業務規則)
```typescript
// Domain Layer: 07-issues/domain/policies/issues.policy.ts
export class IssueSeverityPolicy {
  public static isSatisfiedBy(...): boolean {
    // 業務規則檢查
  }
  
  public static assertIsValid(...): void {
    if (!this.isSatisfiedBy(...)) {
      throw new DomainError('...');
    }
  }
}
```

### Dependency Inversion (Repository Pattern)

#### Application Layer: 定義介面與 Token
```typescript
// Application Layer: 07-issues/application/ports/issues-repository.port.ts
export interface IIssueRepository {
  findById(id: string): Promise<IssueEntity | null>;
  save(entity: IssueEntity): Promise<void>;
}

// Application Layer: 07-issues/application/tokens/issues-repository.token.ts
export const ISSUE_REPOSITORY_TOKEN = new InjectionToken<IIssueRepository>(
  'ISSUE_REPOSITORY_TOKEN'
);
```

### Mapper Pattern (Domain <-> DTO/Firestore)
- Application Layer: IssueToDtoMapper
- Infrastructure Layer: IssueFirestoreMapper

### 型別安全
- 禁止使用 any 或 as unknown
- Mapper 必須明確處理深層嵌套物件

------

## 十、開發檢查清單

實作本模組時，請確認以下項目：

- [ ] 模組遵循 Domain → Application → Infrastructure → Presentation 分層
- [ ] 使用 signalStore 管理狀態
- [ ] 模板使用 @if / @for / @switch (禁止 *ngIf / *ngFor)
- [ ] @for 必須包含 track 表達式
- [ ] 使用 @defer 延遲載入重型視圖
- [ ] 所有事件包含 correlationId
- [ ] 事件遵循 Append -> Publish -> React
- [ ] 模組間僅透過 Event Bus 互動
- [ ] Component 設定 ChangeDetectionStrategy.OnPush
- [ ] 支援鍵盤導航與螢幕閱讀器
- [ ] 撰寫 Unit / Integration / E2E 測試
- [ ] 遵循奧卡姆剃刀原則，避免過度設計
- [ ] 實作 Context Provider 供其他模組查詢
- [ ] 使用 InjectionToken 進行依賴注入
- [ ] 使用 Factory/Policy 封裝創建與驗證邏輯
- [ ] 使用 Mapper 分離 Domain Entity 與 DTO
- [ ] 避免直接注入其他模組的 Store

---

## 十一、參考資料

- **父文件**：workspace-modular-architecture_constitution_enhanced.md
- **DDD 規範**：.github/skills/ddd/SKILL.md
- **Angular 文件**：https://angular.dev
- **Angular Material**：https://material.angular.io
- **Tailwind CSS**：https://tailwindcss.com

---

**注意**：本指南必須與父文件保持一致。若有衝突，以父文件為準。
