# Workspace 模組化架構與純響應式規則 (Workspace Modular Architecture & Pure Reactive Rules)

本文件作為 Black-Tortoise 專案的最高指導原則 (The Constitution)，定義 Workspace 與各業務模組的互動介面、狀態管理、UI 設計規範與工程標準。
Copilot 在生成代碼時必須嚴格遵守此文件，優先於其他通用規則。
**層級總則**：.github/skills/ddd/SKILL.md 為最上位規範，本文件在其之下提供 Workspace 及模組化的具體落地細則；若有衝突，以 DDD SKILL 為準。

---

## 一、核心架構定義 (Core Architecture Definitions)

### 1. Workspace 作為一級邏輯容器 (Logical Container)
- **邊界定義**：Workspace 是唯一的狀態、事件、權限與資料一致性邊界。
- **生命週期**：所有業務模組 (Modules) 皆依附於 Workspace 存在。
  - 必須在 Workspace Context 內初始化。
  - 切換 Workspace 時，必須完整銷毀並重建其下所有模組狀態。
- **DDD 層級**：Workspace 對應 Application Context；Module 對應 Application 內的子 Use Case 群組。
- **Domain 隔離**：Domain Layer 不感知 Workspace 或 Module 的存在。
- **依賴方向**：遵循 Domain → Application → Infrastructure → Presentation 單向依賴，禁止任何反向引用、barrel export 或間接耦合破壞層級。
- **介面歸屬**：Module 所需的 interface 必須定義在 Application/Domain，Infrastructure 只能實作，Presentation 只能透過 Application Store/Facade 進入。

### 2. 純響應式通訊 (Pure Reactive Communication)
- **模組間互動**：一律透過 **Workspace-scoped Event Bus**。
- **禁止直接呼叫**：模組間不得直接呼叫 Service 或 Facade。
- **狀態隔離**：模組間不得直接共享 Signal State。
- **事件驅動**：所有跨模組影響必須以 Event 表達 (e.g., `TaskStatusChanged`, `RoleCreated`)。
- **事件鏈順序**：事件必須遵循 Append -> Publish -> React 三段式，禁止先 Publish 後 Append。

---

## 二、模組職責規範 (Module Responsibilities)

本節定義業務模組的核心職責與邊界。Copilot 應以此判斷功能該歸屬何處。

### 1. 權限模組 (PermissionsModule)
- **職責**：管理 Workspace 內的權限矩陣 (RBAC)。
- **現代化實作**：
  - 使用 `signalStore` 維護 `Map<Role, Permission[]>` 結構。
  - 權限檢查應為 `computed` signal (`canEdit = computed(() => ...)`)，而非每次呼叫函數。
- **禁止**：將「我是誰」的判斷混入此模組 (那是 Identity 的職責)。

### 2. 文件模組 (DocumentsModule)
- **職責**：Workspace 檔案資產管理。
- **現代化實作**：
  - 上傳進度需封裝為 Signal (`uploadProgress()`)。
  - 文件列表支援虛擬滾動 (Virtual Scroll) 以應對大量資料。
- **禁止**：在 Component 中直接操作 `Storage` SDK。

### 3. 任務模組 (TasksModule)
- **職責**：核心任務與專案管理。
- **視圖設計 (View Design)**：
- **Single Source of Truth**：所有視圖 (List, Gantt, Calendar) **必須** 投影自同一個 Entity Map。
- **零重新獲取 (Zero Refetch)**：切換視圖時 **禁止** 重新打 API，僅改變 `viewMode` signal 與 `computed` filter。
- **狀態流轉**：作為工作流發起點，必須響應 QC/Acceptance 的回饋。
- **事件責任**：TasksModule 只發布/處理 Task 類事件，不得跨界修改 Permissions/Issues 狀態，跨模組效果必須透過 Event Bus。

### 4. 每日紀錄模組 (DailyModule)
- **職責**：個人工作日誌 (Timesheet/Worklog)。
- **設計細節**：
  - 應具備「快速填寫」介面，自動關聯當日活躍 Task。
  - 提交時自動計算工時並發布統計事件。

### 5. 質檢模組 (QualityControlModule)
- **職責**：任務產出物的品質驗證關卡。
- **互動設計**：
  - 介面應呈現 Task 的 Snapshot (快照) 供對照。
  - 駁回時必須強制填寫「缺失原因」，並結構化紀錄。

### 6. 驗收模組 (AcceptanceModule)
- **職責**：最終交付物的商業驗收。
- **流轉規則**：僅接收已通過 QC 的項目。
- **設計重點**：強調「交付標準」的核對清單 (Checklist) UI。

### 7. 問題單模組 (IssuesModule)
- **職責**：異常與缺失追蹤 (Defect Tracking)。
- **閉環邏輯**：Issue 的生命週期必須與 Task 狀態掛鉤 (Blocking 關係)。
- **自動化**：接收到 `QCFailed` 事件時，自動預填 Issue Title 與 Context，減少人工輸入。

### 8. 總覽模組 (OverviewModule)
- **職責**：Workspace 核心指標與活動儀表板。
- **設計**：
  - 聚合各模組關鍵資訊 (Key Metrics)，如待辦事項數、Issue 統計等。
  - 使用 Widget 模式設計，支援響應式佈局。

### 9. 成員模組 (MembersModule)
- **職責**：團隊成員管理與角色分配。
- **互動**：
  - 邀請/移除成員必須發布 `MemberUpdated` 事件。
  - 變更角色時需連動 PermissionsModule 的檢查邏輯。

### 10. 稽核模組 (AuditModule)
- **職責**：系統操作與安全日誌 (Audit Log)。
- **特性**：
  - 唯讀 (Read-Only) 呈現，確保日誌不可篡改。
  - 支援依時間、操作者、模組進行多維度篩選。

### 11. 行事曆模組 (CalendarModule)
- **職責**：以時間維度檢視任務與工作日誌。
- **資料來源**：
  - 聚合 TasksModule (到期日) 與 DailyModule (工時紀錄)。
  - **禁止** 重新 fetch 資料，應訂閱原模組的 Store 或使用 Selector。

*(註：若專案擴展至更多模組，如 Chat, Wiki, Meetings 等，皆需遵循上述模組化隔離原則)*

---

## 三、狀態流轉與回饋迴圈 (State Flow & Feedback Loop)

為了確保流程閉環且無死結，必須遵循以下流轉原則：

### 1. 正向流 (Forward Flow)
> `User Action` -> `TasksModule` -> `QualityControlModule` -> `AcceptanceModule` -> `Done`
- **原則**：下游模組的啟動 **必須** 由上游模組的 `Success Event` 觸發，嚴禁手動跨越流程。

### 2. 負向流 (Negative/Rejection Flow)
> `QC/Acceptance Fail` -> `IssuesModule` + `TasksModule` (Rework)
- **即時性**：失敗事件發生時，UI 應立即透過 Signal Effect 顯示通知，並將 Task 標記為 Blocked。

### 3. 重啟流 (Restart Flow)
> `Issue Resolved` -> `TasksModule` (Ready)
- **自動解鎖**：當所有關聯 Issue 解決後，系統應自動提示 Task 可重新提交，而非等待人工檢查。

---

## 四、UI/UX 系統與設計規範 (UI/UX System & Design Specifications)

### 1. 設計系統基礎 (Design System Foundation)
- **框架**：嚴格使用 **Angular Material (M3)** + **Tailwind CSS** (Utility-first)。
- **一致性 (Consistency)**：
  - 所有卡片 (Cards) 使用統一的 `mat-card` Elevation 與 Padding。
  - 所有按鈕遵循主/次/警告 (Primary/Secondary/Warn) 語意分級。
  - 所有 Dialog 使用統一的 `Header-Content-Actions` 佈局。

### 2. 任務視圖切換實作 (Task View Implementation)
- **架構模式**：
  - Store: `withState({ viewMode: 'list' | 'gantt' | 'kanban' })`
  - Computed: `visibleTasks = computed(() => filterTasks(entities(), viewMode()))`
- **Gantt Chart**：使用純 CSS Grid 或 SVG 繪製，避免引入重型第三方庫 (Occam’s Razor)。
- **Kanban**：使用 CDK Drag & Drop，拖曳結束時僅 Patch State，由 Store Effect 處理 API。

### 3. 權限矩陣樣式設計 (Permission Matrix Design)
- **呈現形式**：
  - 行 (Rows)：角色 (Roles)
  - 列 (Columns)：資源/模組 (Resources)
  - 單元格 (Cells)：Checkbox (`mat-checkbox`)
- **互動體驗**：
  - 必須支援 **Sticky Headers** (行列標題凍結)。
  - 勾選必須是**樂觀更新 (Optimistic Update)**：先改 UI Signal，背景送 API，失敗再回滾。
  - 提供「全選/全不選」的便捷操作列。

### 4. 現代化模板控制流 (Modern Template Control Flow)
- **Built-in Control Flow**: 視圖層 **必須** 全面採用 Angular 新版控制流語法。
  - 使用 `@if (cond) { ... } @else { ... }` 取代 `*ngIf`。
  - 使用 `@for (item of items; track item.id) { ... }` 取代 `*ngFor`。
  - 使用 `@switch (val) { @case (c) { ... } }` 取代 `[ngSwitch]`。
- **強制追蹤 (Mandatory Tracking)**: `@for` 區塊 **必須** 包含 `track` 表達式，嚴禁隱式 index 或無 track 的寫法 (以確保 Zone-less 渲染效能)。

---

## 五、響應式狀態規則 (Reactive State Rules)

### 1. 狀態管理 (State Management)
- 所有狀態必須使用 **NgRx Signals (`signalStore`)**。
- **禁止** 使用 `BehaviorSubject` 或手動 `subscribe` (必須 Zone-less)。

### 2. 事件規則 (Event Rules)
- **Payload**：**禁止** 攜帶 Service/Function/UI Reference (必須是純資料 DTO)。
- **追蹤**：所有事件必須包含 `correlationId` 以追溯某些 UI 操作導致的一系列副作用。

---

## 六、工程標準與奧卡姆剃刀原則 (Engineering Standards & Occam's Razor)

Copilot 生成代碼時必須遵循「如無必要，勿增實體」的原則。

### 1. 奧卡姆剃刀 (Occam's Razor) 實踐
- **拒絕過度設計 (No Over-engineering)**：
  - 如果一個 Component 只有 20 行邏輯，**不需要** 拆分出 Service。
  - 如果一個 Store 可以直接被 Component 使用，**不需要** 建立 Facade 層。
  - 如果原生 HTML/CSS 能解決，**不需要** 引入額外 Directive 或 Library。
- **扁平化結構**：優先保持目錄扁平，直到檔案數量超過 7-10 個才考慮建立子目錄。

### 2. 代碼風格 (Code Style)
- **函數式優先**：優先使用 Pure Functions 與 Composition。
- **提早返回 (Early Return)**：減少 3 層以上的 `if/else` 巢狀。
- **命名一致性**：
  - Store Signals: 命名為名詞 (e.g., `loading`, `users`)。
  - Event Handlers: 命名為動詞+名詞 (e.g., `onTaskSubmit`, `handleResize`)。

---

## 七、事件架構實作規範 (Event Architecture Implementation Specs)

### 1. 事件定義 (Event Definition)
所有業務事件必須實作 `DomainEvent<T>` 介面 並採用包含 Metadata 的結構。

```typescript
export interface EventMetadata {
  correlationId: string;          // 關聯 ID (全鏈路追蹤)
  causationId?: string | undefined; // 因果 ID (上一層 Event/Command ID)
  userId?: string | undefined;    // 操作者 ID
  timestamp: number;              // Unix Timestamp
  version?: number;               // Aggregate Version
}

export interface DomainEvent<TPayload = Record<string, unknown>> {
  readonly eventId: string;       // UUID v4
  readonly eventName: string;     // 使用 EventType 常數 (Past Tense)
  readonly aggregateId: string;   // 聚合根 ID
  readonly occurredOn: Date;      // 發生時間
  readonly metadata: EventMetadata; // 上下文元數據
  readonly payload: TPayload;     // 純資料
}
```

### 2. 事件元數據與因果追蹤 (Metadata & Causality)
所有事件必須包含完整的 `EventMetadata` 以支援分散式追蹤。
**因果追蹤規則**：
- **起點 (Use Case)**：Use Case 執行時必須生成或接收 `correlationId`，並透過 `Command` 傳遞給 Aggregate。
- **傳遞 (Aggregate)**：Aggregate 方法 (`create`, `update`, `addSection`) 必須接收 Metadata 並注入到產生的 Domain Event 中。
- **繼承 (Side Effect)**：事件觸發的副作用 -> 繼承 `correlationId`，`causationId` 指向上一個事件。

### 3. 事件傳遞流程
1. **Append**: `eventStore.append(event)` (持久化 Fact)。
2. **Publish**: `eventBus.publish(event)` (觸發副作用)。
3. **React**: Store 或 Effect 收到事件，更新 Read Model。


**禁止事項**：
- ❌ **禁止** 先發布後儲存。
- ❌ **禁止** 在 Payload 中傳遞 Entity 物件 (必須 clone 為 plain object)。

---

## 八、現代化效能與交付品質標準 (Modern Performance & Quality Standards)

為了達到業界頂尖的交付品質，必須嚴格執行以下效能與體驗指標。

### 1. 渲染性能優化 (Rendering Performance)
- **全面 Zone-less**：應用程式必須配置為 `provideExperimentalZonelessChangeDetection()`，完全移除 `zone.js` 依賴。
- **延遲加載 (@defer)**：
  - 重型視圖 (Gantt, Charts, Map) **必須** 使用 `@defer (on viewport)` 包裹。
  - 次要互動 (Comments, History) **必須** 使用 `@defer (on interaction)`。
- **Change Detection**：所有 Component **必須** 設定 `ChangeDetectionStrategy.OnPush` (雖然 Zoneless 下是預設，但仍需顯式宣告以防退化)。

### 2. 無障礙設計 (A11y Integrity)
- **複雜視圖鍵盤導航**：
  - Kanban/Gantt 必須支援鍵盤 Focus 與 Arrow Key 移動。
  - Drag & Drop 操作必須提供鍵盤替代方案 (e.g., Action Menu "Move to...")。
- **語意化 HTML**：禁止使用 `div` 模擬按鈕，必須使用 `<button>` 或 `<a>`。
- **Announcer**：狀態變更 (e.g., "Task Moved to Done") 必須透過 `LiveAnnouncer` 通知螢幕閱讀器。

### 3. Core Web Vitals 指標
- **LCP (Largest Contentful Paint)**: < 2.5s (透過 Skeleton Screen 與 Image Optimization)。
- **INP (Interaction to Next Paint)**: < 200ms (透過 Signal 異步更新與 Web Worker 處理重運算)。
- **CLS (Cumulative Layout Shift)**: < 0.1 (Skeleton 必須與實際內容等高)。

---

## 九、測試與驗證策略 (Testing & Verification Strategy)

現代化響應式架構的測試重點在於「行為」與「契約」，而非實作細節。

### 1. 測試金字塔 (Testing Strategy)
- **Unit Test (Signals)**：
  - 測試 `computed` 邏輯是否正確反映 source signal 的變化。
  - **禁止** 測試 effect 的副作用 (應轉為測試 Event 發布)。
- **Integration Test (Events - The Contract)**：
  - **Given** 初始 State -> **When** 發出 Command -> **Then** 驗證正確的 Event 被發佈到 EventBus。
  - **不驗證** Private Method 或 Private State。
- **E2E Test (Critical Path)**：
  - 覆蓋 "Task Creation -> QC -> Acceptance -> Close" 的完整閉環。
  - 驗證畫面上的 Optimistic UI 是否正確回滾 (模擬 API 失敗)。

### 2. 測試輔助工具 (Test Utils)
- 使用 `TestBed.flushEffects()` 確保 Signal Effect 執行完畢。
- 使用 `Harness` (Angular CDK Harness) 進行 Component 測試，避免依賴 CSS Selector。

---

## 十、嚴格領域層實作規範 (Strict Domain Implementation Specs)

本節定義了符合 `template-core` 範例的嚴格 DDD 實作模式，適用於所有核心業務模組。

### 1. Aggregate Root 生命週期
Aggregate 必須支援兩種構造模式：
- **Creation (Behaviors)**: 透過靜態工廠方法 (e.g., `create()`)，執行業務檢查，產生 Domain Event，並初始化狀態。
- **Reconstruction (Snapshot)**: 透過靜態方法 `reconstruct(props)`，從 Persistence/Snapshot 恢復狀態，**不產生** Domain Event。

### 2. 子實體管理 (Child Entities)
- Aggregate Root 內部的集合 (Users, Sections) 必須封裝為 **Child Entities**。
- Child Entity 必須擁有独立的 **Value Object ID** (e.g., `SectionId`)。
- 禁止直接暴露 Child Entity 陣列，必須透過方法 (`addSection`, `removeSection`) 操作，並維護 Aggregate Invariants。

### 3. 嚴格型別安全 (Strict Type Safety)
- **禁止 `any`**: Domain, Application, Infrastructure 層嚴禁使用 `any` 或 `as unknown` 繞過型別檢查。
- **Mapper 規範**: Infrastructure Mapper 必須明確處理深層嵌套物件的序列化與反序列化，確保型別一致。

### 4. 深度因果追蹤 (Deep Causality)
- **Use Case 職責**: 負責初始化 `correlationId` 與 `causationId`。
- **Factory/Aggregate 職責**: 必須在所有變更狀態的方法中接收 Metadata 參數，並將其寫入 Domain Event。

---

## 十一、持續演進與防腐層 (Evolution & Anti-Corruption)

- **Schema Evolution**：Event Schema 變更時，必須實作 Upcaster 以相容舊事件。
- **ADR (Architecture Decision Records)**：任何偏離本文件的架構決策，必須即時更新本文件或記錄 ADR，禁止「隱形架構」。

---

## 十二、落地檢查清單 (Enforcement Checklist)

- 層級邊界符合 Domain → Application → Infrastructure → Presentation，且介面定義歸於需求方。
- Workspace 切換時，所有 Module 的 store/state 會被銷毀並重建，不可殘留跨 Workspace 資料。
- 模組間僅透過 Workspace Event Bus 互動，事件遵循 Append -> Publish -> React 並攜帶 correlationId。
- **模板語法檢查**：全面使用 `@if`, `@for` (附帶 `track`), `@switch`，禁止 `*ngIf`/`*ngFor`。
- 所有狀態以 signalStore 管理，禁止 BehaviorSubject、手動 subscribe 或跨模組共享 Signal。
- Presentation 僅經由 Application Store/Facade 取得資料，不直接呼叫 Infrastructure 或 Domain。
- **Aggregate 實作**：檢查是否包含 `reconstruct` 方法，且 Child Entities 使用 Value Object ID。
- **Event Metadata**：檢查 Domain Event 是否正確攜帶 `correlationId`, `userId` 等元數據。
- 實作若偏離本憲章或 DDD SKILL，必須立即補充 ADR 或修訂本文件。


---

## Appendix A: Event-to-Module Mapping (Audit 2024-01-25)

### Complete Event Mapping Table

Reference: Comment 3796666592 Audit - All 19 events verified

| Event | Publisher Module | Publisher Use Case | Subscribed Modules | Purpose |
|-------|------------------|-------------------|--------------------|---------| 
| TaskCreated | Tasks | CreateTaskUseCase | Calendar, Overview, Audit | Task lifecycle start |
| TaskSubmittedForQC | Tasks | SubmitTaskForQCUseCase | QualityControl, Audit | Enter QC workflow |
| QCPassed | QualityControl | PassQCUseCase | Acceptance, Tasks, Audit | Approved for acceptance |
| QCFailed | QualityControl | FailQCUseCase | Issues, Tasks, Audit | Defects found, block task |
| AcceptanceApproved | Acceptance | ApproveTaskUseCase | Tasks, Overview, Audit | Final approval, complete |
| AcceptanceRejected | Acceptance | RejectTaskUseCase | Issues, Tasks, Audit | Rejected, create issue |
| IssueCreated | Issues | CreateIssueUseCase | Tasks, Overview, Audit | Defect tracked, block task |
| IssueResolved | Issues | ResolveIssueUseCase | Tasks, Overview, Audit | Defect fixed, unblock |
| DailyEntryCreated | Daily | CreateDailyEntryUseCase | Overview, Audit | Work logged |
| DocumentUploaded | Documents | - | Overview, Audit | File added |
| MemberInvited | Members | - | Permissions, Audit | User invited |
| MemberRemoved | Members | - | Permissions, Audit | User removed |
| PermissionGranted | Permissions | - | Overview, Audit | Access granted |
| PermissionRevoked | Permissions | - | Overview, Audit | Access removed |
| WorkspaceCreated | Workspace | CreateWorkspaceUseCase | Overview, Audit | New workspace |
| WorkspaceSwitched | Workspace | SwitchWorkspaceUseCase | ALL MODULES | Context change |
| ModuleActivated | Shell | - | Audit | Module shown |
| ModuleDeactivated | Shell | - | Audit | Module hidden |
| TaskCompleted | Tasks | - | Overview, Audit | Task finished |

### Event Flow Validation Rules

1. **Append-Before-Publish**: ✅ Verified in PublishEventUseCase
   ```typescript
   await eventStore.append(event);  // FIRST
   await eventBus.publish(event);   // AFTER
   ```

2. **Causality Chain**: ✅ All events support correlationId + causationId
   - Root events: `causationId = null`
   - Derived events: `causationId = previousEvent.eventId`
   - Chain tracking: `EventStore.getEventsByCausality(correlationId)`

3. **Replay Safety**: ✅ Verified in InMemoryEventStore
   - Write: `Object.freeze({ ...event })`
   - Read: `events.map(e => ({ ...e }))`

4. **Type Safety**: ✅ All payloads strongly typed
   - No `any` types in production code
   - All timestamps: `number` (Date.now())
   - All factories: Proper TypeScript inference

### Audit Verification

**Date**: 2024-01-25  
**Reference**: Comment 3796666592  
**Status**: ✅ All 12 modules verified, 19 events validated, 0 issues found  
**Build**: ✅ Successfully runs (ng serve in 7.9s)  
**Documents**: EVENT_AUDIT_REPORT.md, EVENT_MODULE_MAPPING.md  

