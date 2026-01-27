# 設定模組 (SettingsModule) - 開發指南

**模組編號**：12-settings
**版本**：2.0
**最後更新**：2026-01-27
**父文件**：workspace-modular-architecture_constitution_enhanced.md

---

## 一、模組概述

### 核心職責
管理 Workspace 及模組的全域設定

### 邊界定義
先做出基礎功能，未來擴展

### 在架構中的位置
本模組是 Workspace 的子模組之一，遵循 Domain → Application → Infrastructure → Presentation 的分層架構。

---

## 二、功能需求規格

### 1. Workspace 基本設定 (基礎版)

#### 需求清單
1. Workspace 名稱 (可編輯)
2. Workspace 描述 (可編輯)
3. Workspace 圖示 (可上傳)
4. Workspace 建立時間 (唯讀)
5. Workspace 建立者 (唯讀)
6. 時區設定
7. 語言設定 (中文、英文等)
8. 日期格式 (YYYY-MM-DD, DD/MM/YYYY 等)
9. 貨幣設定 (用於任務單價)

### 2. 模組啟用/停用 (基礎版)

#### 需求清單
1. 顯示所有可用模組列表
2. 支援啟用/停用特定模組
3. 停用的模組在導航列中隱藏
4. Tasks, Members, Overview 預設啟用，不可停用
5. 其他模組可自由啟用/停用

### 3. 通知設定 (基礎版)

#### 需求清單
1. 通知類型：任務指派通知、任務到期提醒、問題單建立通知、質檢/驗收結果通知
2. 通知方式：Email 通知、In-App 通知
3. 支援為每種通知類型選擇通知方式

### 4. 設定變更事件

#### 需求清單
1. 設定變更必須發布 SettingsChanged 事件
2. 相關模組訂閱此事件，調整行為
3. 記錄設定變更歷史
4. 支援回滾到先前的設定版本 (Optional)

### 5. 未來擴展方向

#### 需求清單
1. 主題設定：支援深色模式、淺色模式、自訂主題色
2. 權限範本：預設的角色權限範本管理
3. 整合設定：第三方服務整合 (Google Drive, Slack, Jira 等)
4. 自動化規則：自訂工作流自動化規則

---

## 三、現代化實作要求

### Angular 20+ 最佳實踐

- 使用 signalStore 維護設定 Map<SettingKey, SettingValue>
- 設定變更必須發布事件，通知相關模組調整行為
- 提供統一的設定介面，支援即時更新與版本控制

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
- **SettingsChanged**

### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

### 事件處理原則
1. 事件必須遵循 Append -> Publish -> React 順序
2. 事件 Payload 必須是純資料 DTO
3. 所有事件必須包含 correlationId
4. 禁止在事件中傳遞 Service/Function/UI Reference

---

## 五、禁止事項 (Forbidden Practices)

- ❌ 未發布事件就變更設定
- ❌ 跨 Workspace 共享設定
- ❌ 在 Component 中直接修改設定

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
// Application Layer: 12-settings/application/providers/settings-context.provider.ts
export abstract class SettingsContextProvider {
  abstract getSetting(key: string): unknown;
  abstract isModuleEnabled(moduleId: string): boolean;
}
```

#### 發布事件 (Published Events)
- **SettingsChanged**
- **ModuleActivated**
- **ModuleDeactivated**

### 本模組訂閱 (Consumed by This Module)

#### 訂閱事件 (Subscribed Events)
- **WorkspaceSwitched**

#### 使用的 Context Providers
- **WorkspaceContextProvider**: 查詢當前 Workspace ID

### 整合範例

```typescript
// Application Layer: 12-settings/application/stores/settings.store.ts
export const SettingsStore = signalStore(
  { providedIn: 'root' },
  withState<SettingsState>(initialState),
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
export class SettingsStore {
  private taskStore = inject(TaskStore); // 緊密耦合
}
```

✅ **正確**：使用 Context Provider 或 Event Bus
```typescript
export class SettingsStore {
  private workspaceContext = inject(WorkspaceContextProvider); // 鬆散耦合
  private eventBus = inject(WorkspaceEventBus);
}
```

---

## 九、DDD 實作規範

### Aggregate Root: WorkspaceSettingsEntity

#### Creation Pattern (產生 Domain Event)
```typescript
// Domain Layer: 12-settings/domain/aggregates/settings.aggregate.ts
export class WorkspaceSettingsEntity {
  private constructor(...) {}
  
  public static create(..., eventMetadata?: EventMetadata): WorkspaceSettingsEntity {
    // 產生 Domain Event
    // ...
  }
  
  public static reconstruct(props): WorkspaceSettingsEntity {
    // 從 Snapshot 重建，不產生 Event
    return new WorkspaceSettingsEntity(...);
  }
}
```

#### Factory Pattern (強制執行 Policy)
```typescript
// Domain Layer: 12-settings/domain/factories/settings.factory.ts
export class SettingsFactory {
  public static create(..., metadata?: EventMetadata): WorkspaceSettingsEntity {
    // 執行 Policy 檢查
    SettingsValidationPolicy.assertIsValid(...);
    
    // 透過 Aggregate 創建
    return WorkspaceSettingsEntity.create(..., metadata);
  }
}
```

#### Policy Pattern (封裝業務規則)
```typescript
// Domain Layer: 12-settings/domain/policies/settings.policy.ts
export class SettingsValidationPolicy {
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
// Application Layer: 12-settings/application/ports/settings-repository.port.ts
export interface IWorkspaceSettingsRepository {
  findById(id: string): Promise<WorkspaceSettingsEntity | null>;
  save(entity: WorkspaceSettingsEntity): Promise<void>;
}

// Application Layer: 12-settings/application/tokens/settings-repository.token.ts
export const WORKSPACESETTINGS_REPOSITORY_TOKEN = new InjectionToken<IWorkspaceSettingsRepository>(
  'WORKSPACESETTINGS_REPOSITORY_TOKEN'
);
```

### Mapper Pattern (Domain <-> DTO/Firestore)
- Application Layer: WorkspaceSettingsToDtoMapper
- Infrastructure Layer: WorkspaceSettingsFirestoreMapper

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
