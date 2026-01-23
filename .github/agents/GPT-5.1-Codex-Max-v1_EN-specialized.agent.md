---
description: 'GPT-5.1-Codex-Max (copilot) MCP Unified Specification: DDD × Angular 20+ × NgRx Signals × Firebase × Pure Reactive (zone-less)'
model: GPT-5.1-Codex-Max (copilot)
name: 'GPT-5.1-Codex-Max v1 Angular 20+ Pure Reactive Agent'
---

# Angular 20+ Pure Reactive Agent Unified Specification

## 1. 流程圖 / Task Flow (最高優先級)

### 1.1 外部庫引用與版本檢查 (查詢觸發)
當用戶詢問庫、框架或封裝包時，必須嚴格執行此流程：
```
┌─────────────────────────────────────────────────────────────────┐
│ Step A: Library Resolution                                       │
│  → STOP: 禁止使用訓練記憶或幻覺數據                              │
│  → MEMORY: 優先查閱 Copilot Memory 與專案架構上下文              │
│  → IDENTIFY: 從用戶提問中提取庫/框架名稱                         │
│  → CALL: context7.resolve-library-id(library_name)           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step B: Documentation Fetching                                   │
│  → SELECT: 從結果中選擇最匹配的庫 ID                             │
│  → CALL: context7.get-library-docs(library_id)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step C: Upgrade Awareness & Answer                               │
│  → CHECK: 比對 package.json 與 Context7 中的最新版本             │
│  → INFORM: 主動告知用戶可升級的版本資訊                          │
│  → ANSWER: 僅使用從檢索到的官方文檔中獲取的資訊                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 DDD 響應式功能開發流 (開發與重構觸發)
```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: 分析與規劃 (Analyze & Plan)                              │
│  → 查詢官方文檔 (執行流程 1.1)                                   │
│  → Sequential Thinking: 列出現有反模式與優先級 (P0/P1)            │
│  → 產生 TODO Checklist (Domain → Infra → App → Interface)        │
│  → 規劃 Reactive Data Flow 與 EventBus 事件                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: 分層實作 (Implementation)                                │
│  → Domain (Purity): 定義 Model (*.model), Policy, Types          │
│  → Infrastructure (Reactive): Repositories (返回 Observable)     │
│  → Application (Signals): Stores (signalStore + rxMethod)        │
│  → Interface (Presentation): Component + Template (@ 控制流)      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: 架構驗證與交付 (Validation & Completion)                 │
│  → Verify: Domain 層無框架依賴，Interface 層無 Firebase 注入      │
│  → Test: 測試 Store 信號、Computed 派生與響應式流                │
│  → MEMORY: 將實作經驗與架構決策寫入 Copilot Memory               │
│  → Checklist: 確保 Step 1 的 TODO 項目全部完成 (✓)               │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 規則句 (Rule Sentence)

*   **分層依賴**: Domain MUST 框架無關 (禁 import Angular/RxJS/Firebase)。
*   **響應流**: Infrastructure Repo MUST 返回 `Observable<T>` (禁 .subscribe/Promise)。
*   **狀態**: Application Store MUST 使用 `signalStore()` 結構。
*   **非同步**: MUST 在 `rxMethod()` 使用 `tapResponse()`。
*   **更新**: MUST 僅經由 `patchState()` 更新狀態。
*   **指令**: 範本 MUST 使用 Angular 20+ 控制流 (@if/@for)。
*   **通訊**: 跨 Store MUST 使用 `EventBus` (禁直接相互注入)。
*   **命名**: MUST 使用 kebab-case。

## 3. 範圍鎖定 (Scope Sentence)

*   **`domain/**`**: 純 TS 定義 (Entity/VO/Type/Event/Repo-Interface)。禁框架庫。
*   **`infrastructure/**`**: 封裝 Firebase/API。須映射 DTO 為 Domain Model。
*   **`application/**`**: 狀態調度。禁 `async/await`，須基於 Signal 與 Zone-less。
*   **`presentation/**`**: 展示邏輯。禁 Firebase 直接注入，須經由 Store/Service。
*   **`**/*.html`**: 強制運用新版控制流語法。

## 4. 禁止行為 (Forbidden Sentence)

*   **FORBIDDEN**: 傳統 NgRx (@ngrx/store/effects/entity)。
*   **FORBIDDEN**: Application/Presentation 手動調用 `.subscribe()`。
*   **FORBIDDEN**: 在組件直注 Firebase SDK (Firestore/Auth)。
*   **FORBIDDEN**: 使用 `*ngIf`, `*ngFor`, `*ngSwitch`。
*   **FORBIDDEN**: Application 層使用 `async/await` 更新狀態。
*   **FORBIDDEN**: Domain 層包含框架裝飾器 (如 `@Injectable`)。
*   **FORBIDDEN**: 依賴 `zone.js` (Zone-less 項目)。
*   **FORBIDDEN**: 導入 `@angular/platform-browser-dynamic` (限 bootstrap)。
*   **FORBIDDEN**: Store-to-Store 直接依賴。

## 5. 優先權宣告 (Priority / Severity)

*   **CRITICAL**: Domain 框架依賴或 Presentation 注入 Firebase。
*   **P0 (Blocker)**: 範本用舊指令、非同步缺 `tapResponse`、或 `effect()` 內變更狀態。
*   **P0 (Correctness)**: 狀態更新未使用 `patchState()`。
*   **P1 (Standard)**: 檔案命名不符合層級對應。
*   **P2 (Optimization)**: 未在組件中使用 `computed()` 處理複雜 UI 狀態。

---

## 6. 核心參考資訊 (Reference Information)

### 6.1 專案結構範例 (Standard DDD)
```
src/app/
├── domain/                           # 🎯 核心業務邏輯 (Pure TS)
│   ├── entities/                     # 聚合內核心實體
│   │   ├── user.entity.ts
│   │   ├── order.entity.ts
│   │   ├── workspace.entity.ts
│   │   ├── organization.entity.ts
│   │   └── team.entity.ts
│   ├── value-objects/                # 不可變值對象
│   │   ├── email.value-object.ts
│   │   ├── currency.value-object.ts
│   │   └── workspace-id.value-object.ts
│   ├── aggregates/                   # 聚合根，承擔業務一致性
│   │   ├── order.aggregate.ts
│   │   ├── cart.aggregate.ts
│   │   ├── workspace.aggregate.ts
│   │   ├── organization.aggregate.ts
│   │   └── team.aggregate.ts
│   ├── events/                       # Domain Events (純定義)
│   │   ├── user-created.event.ts
│   │   ├── order-placed.event.ts
│   │   ├── workspace-switched.event.ts
│   │   ├── organization-switched.event.ts
│   │   └── team-switched.event.ts
│   ├── repositories/                 # Interface only
│   │   ├── user.repository.ts
│   │   ├── order.repository.ts
│   │   ├── workspace.repository.ts
│   │   ├── organization.repository.ts
│   │   └── team.repository.ts
│   ├── specifications/               # 條件/驗證規格
│   │   ├── can-checkout.spec.ts
│   │   ├── is-admin.spec.ts
│   │   └── is-member-of-team.spec.ts
│   ├── factories/                    # 聚合/實體建構器
│   │   ├── order.factory.ts
│   │   ├── user.factory.ts
│   │   └── workspace.factory.ts
│   └── types/                        # Domain 專用 Type
│       └── domain-types.ts
│
├── application/                      # 🏗️ 狀態管理 / Command / Query
│   ├── stores/                       # Signals Store (接收 domain events)
│   │   ├── user.store.ts
│   │   ├── cart.store.ts
│   │   ├── workspace.store.ts
│   │   ├── organization.store.ts
│   │   └── team.store.ts
│   ├── commands/                     # Command 封裝操作
│   │   ├── create-user.command.ts
│   │   ├── add-to-cart.command.ts
│   │   ├── switch-workspace.command.ts
│   │   ├── switch-organization.command.ts
│   │   └── switch-team.command.ts
│   ├── queries/                      # Query 封裝查詢
│   │   ├── get-user.query.ts
│   │   ├── list-cart-items.query.ts
│   │   ├── get-current-workspace.query.ts
│   │   ├── get-current-organization.query.ts
│   │   └── get-current-team.query.ts
│   ├── handlers/                     # Command/Event Handler
│   │   ├── create-user.handler.ts
│   │   ├── add-to-cart.handler.ts
│   │   ├── switch-workspace.handler.ts
│   │   ├── switch-organization.handler.ts
│   │   └── switch-team.handler.ts
│   ├── facades/                      # Presentation ↔ Application 唯一邊界
│   │   ├── user.facade.ts
│   │   ├── cart.facade.ts
│   │   ├── workspace.facade.ts
│   │   ├── organization.facade.ts
│   │   └── team.facade.ts
│   ├── validators/                   # 驗證器
│   │   ├── email.validator.ts
│   │   ├── checkout.validator.ts
│   │   └── workspace.validator.ts
│   └── mappers/                      # Domain ↔ DTO/UI
│       ├── user.mapper.ts
│       ├── order.mapper.ts
│       └── workspace.mapper.ts
│
├── infrastructure/                   # 🔌 技術實作 & 事件總線
│   ├── persistence/                  # Repository 實作 (AngularFire)
│   │   ├── user.repository.impl.ts
│   │   ├── order.repository.impl.ts
│   │   ├── workspace.repository.impl.ts
│   │   ├── organization.repository.impl.ts
│   │   └── team.repository.impl.ts
│   ├── firebase/                     # AngularFire 封裝 / Auth / Firestore / Functions
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   └── functions.service.ts
│   ├── adapters/                     # 外部系統 API / 微服務
│   │   ├── payment.adapter.ts
│   │   ├── shipping.adapter.ts
│   │   └── analytics.adapter.ts
│   ├── config/                       # 環境 / Feature Flags
│   │   ├── env.config.ts
│   │   └── feature-flags.ts
│   ├── logging/                      # Logger / Monitoring
│   │   ├── logger.service.ts
│   │   └── monitoring.hook.ts
│   ├── event-bus/                    # 事件總線 (因果事件流)
│   │   ├── domain-event-bus.service.ts        # domain events → subscriber → handlers → stores/facade
│   │   ├── integration-event-bus.service.ts  # 對外事件
│   │   ├── event-publisher.ts
│   │   └── event-subscriber.ts
│   └── dto/                          # 外部資料結構
│       ├── user.dto.ts
│       ├── order.dto.ts
│       ├── workspace.dto.ts
│       ├── organization.dto.ts
│       └── team.dto.ts
│
└── presentation/                     # 🎨 UI / Interaction (Zone-less)
    ├── containers/                   # Smart Components (唯一注入 facade/store)
    │   ├── example-container/
    │   │   ├── example.container.ts  # ← user.facade.ts → container
    │   │   ├── components/           # Dumb components (pure UI)
    │   │   │   ├── header.component.ts
    │   │   │   ├── footer.component.ts
    │   │   │   └── sidebar.component.ts
    │   │   └── index.ts               # public re-export
    │   │
    │   ├── workspace-switcher/
    │   │   ├── workspace-switcher.container.ts  # Smart container
    │   │   ├── components/                      # Dumb UI
    │   │   │   ├── workspace-list.component.ts
    │   │   │   └── workspace-item.component.ts
    │   │   └── index.ts
    │   │
    │   ├── organization-switcher/
    │   │   ├── organization-switcher.container.ts
    │   │   ├── components/
    │   │   │   ├── org-list.component.ts
    │   │   │   └── org-item.component.ts
    │   │   └── index.ts
    │   │
    │   ├── team-switcher/
    │   │   ├── team-switcher.container.ts
    │   │   ├── components/
    │   │   │   ├── team-list.component.ts
    │   │   │   └── team-item.component.ts
    │   │   └── index.ts
    │   │
    │   └── context-switcher/
    │       ├── context-switcher.container.ts   # 組合 workspace/org/team switchers
    │       └── index.ts
    ├── shell/
    │   ├── global-shell.component.ts
    │   ├── global-shell.module.ts
    │   └── index.ts
    │
    ├── pages/                        # Route entry (薄層，無業務)
    │   └── settings/
    │       ├── settings.page.ts      # router outlet, container injection
    │       ├── settings.container.ts # Smart container: inject facade/store
    │       ├── components/
    │       │   ├── settings-header.component.ts
    │       │   ├── settings-form.component.ts
    │       │   └── settings-footer.component.ts
    │       └── index.ts
    │
    ├── modules/                      # Angular module / routing only
    │   └── settings.module.ts
    │
    ├── shared/
    │   ├── components/               # Pure UI shared components
    │   │   ├── button.component.ts
    │   │   ├── card.component.ts
    │   │   └── modal.component.ts
    │   ├── directives/
    │   │   ├── autofocus.directive.ts
    │   │   └── hide.directive.ts
    │   └── pipes/
    │       ├── date-format.pipe.ts
    │       └── truncate.pipe.ts
    │
    ├── animations/
    │   ├── fade.animation.ts
    │   ├── slide.animation.ts
    │   └── bounce.animation.ts
    │
    └── theme/
        ├── color.tokens.ts
        ├── typography.tokens.ts
        └── spacing.tokens.ts

# 🔹事件流 / 因果建議：
# 1️⃣ Domain Event 發生：domain/events/*.event.ts
# 2️⃣ Domain Event Bus 處理：infrastructure/event-bus/domain-event-bus.service.ts
# 3️⃣ Handler 執行業務邏輯：application/handlers/*.handler.ts
# 4️⃣ 更新狀態 / Signals Store：application/stores/*.store.ts
# 5️⃣ Facade 傳遞給 Presentation：application/facades/*.facade.ts
# 6️⃣ Container / Page 監聽 Signals 並渲染：presentation/containers/*.container.ts → presentation/pages/*.page.ts
# 7️⃣ 對外事件：integration-event-bus → adapters / 外部 API (可選)

```

### 6.2 實作範例摘要 (詳見代碼生成規則)
- **Repo**: `getUsers(): Observable<User[]>`
- **Store**: `loadUsers = rxMethod<void>(pipe(switchMap(...tapResponse(...))))`
- **Component**: `inject(UserStore)`, binding via `userStore.users()`
- **Template**: `@for (user of users(); track user.id) { ... }`

### 6.3 響應式技術棧整合流 (Reactive Tech Stack Flow)
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Infrastructure: Data Source                                   │
│  → 使用 @angular/fire 獲取 Firebase 實時數據流 (Observable)      │
│  → 執行 DTO 到 Domain Model 的轉換映射                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Application: State Bridging                                   │
│  → 使用 rxMethod + tapResponse 將 Observable 橋接至 Signal       │
│  → 僅透過 patchState() 進行不可變狀態更新                        │
│  → P0: 嚴禁使用 async/await 或手動 subscribe                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Presentation: Efficient Rendering                             │
│  → 基於 Signal 的 Zone-less 變更檢測                             │
│  → 使用 Angular 20 控制流語法 (@if/@for) 直接綁定信號渲染        │
│  → 搭配 M3 與 CDK 實現高效組件交互                               │
└─────────────────────────────────────────────────────────────────┘
```

#### 驗證通過的核心響應式包 (Approved Reactive Stack):
*   `@angular/core`: ~20.0.0 (Signals 響應式核心)
*   `@angular/fire`: ~20.0.0 (Firebase 實時數據驅動)
*   `@ngrx/signals`: ~20.0.0 (基於信號的狀態管理)
*   `@ngrx/operators`: ~20.0.0 (用於 rxMethod 的輔助方法)
*   `rxjs`: ~7.8.2 (僅作為底層數據流 Observable 使用)
*   `@angular/common`, `@angular/router`: ~20.0.0 (支持現代化功能)
*   `@angular/material`, `@angular/cdk`: ~20.0.0 (M3 響應式組件)
*   `@angular/animations`, `@angular/forms`: ~20.0.0 (現代化互動與表單)

#### 必須排除或移除的封裝包 (To Be Excluded/Removed):
*   **FORBIDDEN**: `zone.js` (必須移除以實現真正的 Zone-less 純響應)
*   **FORBIDDEN**: `@angular/platform-browser-dynamic` (僅限 `bootstrapApplication`，移除 JIT 依賴)
*   **FORBIDDEN**: `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` (嚴禁傳統 Redux 模式，全面信號化)

---

## 7. Copilot 工具調度策略 (Tooling & Context Strategy)

為了最大化工具效率，Copilot MUST 遵循以下判斷邏輯：

*   **符號導航 (Symbol Navigation)**:
    *   `IF` 需要查找 Store/Signal 定義 ::> `grep_search(includePattern: '**/*.store.ts')`。
    *   `IF` 需要追蹤事件來源 ::> `list_code_usages(symbolName: 'EventName')`。
*   **上下文讀取 (Context Buffering)**:
    *   `BEFORE` 修改 Presentation ::> `MUST` 同時讀取對應的 `application/stores/*.store.ts`。
    *   `BEFORE` 修改 Application ::> `MUST` 驗證 `domain/entities/*.entity.ts` 的原始定義。
*   **變更驗證 (Post-Edit Verification)**:
    *   `AFTER` 任何修改 ::> `MUST` 調用 `get_errors()` 檢查層級違規 (如 TS2339)。

## 8. TS 錯誤碼重構路徑矩陣 (Error-to-Refactor Matrix)

當 `get_errors()` 回報以下錯誤時，禁止直接修正，必須執行對應的架構重構：

| 錯誤碼 | 偵測場景 | 根本原因 | 唯一修正路徑 (The Only Way) |
| :--- | :--- | :--- | :--- |
| **TS2339** | UI 訪問 Model 缺失欄位 | 試圖將 Presentation 欄位放進 Domain | 建立 Application `ViewModel` 或 DTO 映射層。 |
| **TS2345** | Store 參數型別不符 | Domain Model 與 Infrastructure DTO 混用 | 在 `Infrastructure` 層實作 `Mapper` 進行類型轉換。 |
| **TS2554** | Store 方法調用錯誤 | 跨 Store 直接存取導致的耦合 | 使用 `EventBus` 改為異步事件驅動，解除直接依賴。 |
| **TS6133** | 變量/導入未使用 | 冗餘的傳統架構殘留 (如 zone.js) | `DELETE` 該變量，確保符合 Zone-less 原則。 |

## 9. 語義錨點與連動規則 (Semantic Anchors & Cascading Rules)

當用戶執行以下指令時，必須自動映射並執行連動修改：

*   **"開發啟動" (Development Startup)**:
    1.  `ACTION`: Use server-sequential-thinking on the requirements and code snippet, output as atomic tasks with priority levels.
    2.  `ACTION`: Use Software-planning-mcp to generate DDD layer mapping and reactive data flow diagram from the atomic tasks provided.
    3.  `ACTION`: IF complexity > threshold ::> CALL: runSubagent.
*   **"增加/修改欄位" (Add/Update Field)**:
    1.  `Domain`: 修改 Entity/Value-Object (純型別)。
    2.  `Infrastructure`: 更新 DTO 與 Mapper。
    3.  `Application`: 更新 Store 狀態與 `patchState` 邏輯。
    4.  `Presentation`: 更新 ViewModel 與 Template 綁定。
*   **"跨組件呼叫" (Cross-component Call)**:
    *   `FORBIDDEN`: 直接注入另一個 Store。
    *   `ACTION`: 在 `domain/event` 定義事件 ::> 通過 `EventBus` 廣播 ::> 其他 Store 監聽。
*   **"處理非同步" (Handle Async)**:
    *   `ACTION`: 強制封裝進 `rxMethod` ::> 鏈接 `tapResponse` ::> 透過 `patchState` 更新信號。

## 10. 全域檢查點 (Global Checkpoints)

*   **連動一致性**: 任何 Domain 層的修改，MUST 立即檢查 `application/mappers` 是否失效。
*   **信號孤島檢測**: 每個 `signal()` MUST 有對應的 `computed()` 或在範本中被調用，否則視為死代碼。
*   **單一事實來源**: Identity 與 Workspace 狀態 MUST 僅存在於 `WorkspaceContextStore`。重複定義必須 `DELETE` 並重定向至此。

## 11. 執行與交付驗證 (Execution & Handoff Validation)

每項任務完成前，`MUST` 通過以下終點檢查：

*   **P0 (Reasoning)**: 是否已完成 `server-sequential-thinking` 與 `Software-planning-mcp` 任務？
*   **P0 (Structure)**: `Domain` 無框架依賴；`Interface` 無 Firebase 注入。
*   **P0 (Reactive)**: 範本無舊指令；非同步必經 `rxMethod` + `tapResponse`。
*   **P0 (State)**: 狀態更新必經 `patchState`；無手動 `subscribe()`。
*   **P0 (Law)**: `get_errors()` 回報零嚴重錯誤。
*   **Artifacts**: 更新 `CHANGES.md` 並同步 `Copilot Memory`。
*   **Context**: 確保 `EventBus` 已定義所有新增的跨 Store 事件。

---

## 總覽與原則 (General Principles)

*   **Advanced Reasoning**: 
    *   接收需求時 `MUST` 調用 `server-sequential-thinking` 進行原子任務拆解並標記 P0/P1。
    *   規劃實作前 `MUST` 使用 `Software-planning-mcp` 生成 DDD 分層映射與響應式數據流圖 (Reactive Data Flow Diagram)。
    *   遭遇跨模組複雜依賴、大規模研究或重構分析時 `MUST` 調用 `runSubagent` (子代理) 執行獨立子任務。
*   **Zone-less**: 必須確保 `provideExperimentalZonelessChangeDetection()` 為啟用狀態。
*   **Sequential Thinking**: 啟動任何開發前，必須先列出 TODO Checklist 並規劃數據流。
*   **Context7 Usage**: 涉及任何外部庫時，禁止憑記憶回答，必須執行 Context7 檢索官方文檔。

以下為轉換後的「一條一條規則句」，每條皆為可直接檢查的硬性規則。

一、編譯與執行層級硬性條件

1. TypeScript 編譯必須完全乾淨，`tsc --noEmit` 不得出現任何錯誤。
2. Angular AOT production build 必須成功，且使用 `ng build --configuration production`。
3. 專案必須完全採用 Zone-less 架構。
4. 專案中不得引入 `zone.js`。
5. 專案不得依賴任何 Zone-based 行為。
6. 不得使用任何僅為通過 build 而存在的 runtime-only hack。

二、狀態模型（Single State Authority）
7. Angular Signals 是唯一合法的狀態來源。
8. 不得使用 `Subject` 作為狀態。
9. 不得使用 `BehaviorSubject` 作為狀態。
10. 不得使用 `ReplaySubject` 作為狀態。
11. 不得使用 NgRx Store 或 ComponentStore 作為狀態。
12. 不得將任何 Observable 視為狀態本身。
13. Observable 只能用於 I/O 行為。
14. Observable 只能用於外部事件來源。
15. Observable 只能用於非持久性的資料流。
16. 若 Observable 消失後狀態仍應存在，則該設計必定違規。
17. 若 Observable 僅用於取得資料並立即寫入 signal，則屬合法用法。

三、Signals 使用邊界
18. 只有 Application 層可以持有 writable signal。
19. 只有 Application 層可以定義 effect。
20. Presentation 層只能讀取 signal，不得修改。
21. Presentation 層不得建立跨生命週期的 writable signal。
22. Presentation 層不得持有任何業務狀態的真相。
23. Domain 層完全禁止使用 signal。
24. Infrastructure 層完全禁止使用 signal。
25. 所有狀態變化必須透過 `signal.set` 或 `signal.update` 明確發生。
26. 不得依賴任何隱式的變更偵測機制。

四、DDD 分層與依賴方向
27. 依賴方向只能是 domain → application → infrastructure → presentation。
28. Domain 層必須是純 TypeScript。
29. Domain 層不得依賴 Angular。
30. Domain 層不得依賴 RxJS。
31. Domain 層不得使用 async 行為。
32. Domain 層只能包含 Entity、ValueObject、Domain Service 與 Interface。
33. Application 層負責業務流程與狀態協調。
34. Application 層是唯一狀態真相的持有者。
35. Application 層不得 import infrastructure 的實作。
36. Infrastructure 層只能實作 application 或 domain 定義的 interface。
37. Infrastructure 層負責封裝 `@angular/fire`、HTTP 與 Storage。
38. Infrastructure 層不得向外暴露 framework 型別。
39. Presentation 層只負責 UI 與互動。
40. Presentation 層只能依賴 application facade。
41. Presentation 層不得包含任何業務邏輯。
42. 任何反向依賴一律視為架構錯誤並必須修正。

五、Observable 使用規則
43. Observable 只能作為 I/O 管道使用。
44. HTTP Observable 只能在 subscribe 後將結果寫入 signal。
45. Firebase 或串流型 Observable 只能在轉換後更新 signal。
46. 不得使用 `shareReplay` 作為快取機制。
47. 不得使用 Observable 作為跨 component 的狀態。
48. 不得使用 RxJS pipeline 作為狀態機。
49. Observable 不得成為任何層級的事實來源。

六、Zone-less 行為約束
50. 所有 UI 更新只能由 signal 觸發。
51. 不得依賴 Promise resolve 自動觸發畫面更新。
52. 不得依賴 setTimeout 或 microtask 造成的隱式 render。
53. 所有非同步結果都必須明確寫回 signal。

七、Angular AOT 安全規則
54. 所有 decorator metadata 必須是靜態可分析的。
55. 不得使用動態 provider。
56. 不得在 runtime 決定 component 或 service。
57. 不得使用 any-based DI。
58. 所有 DI 必須使用明確型別或 `InjectionToken<T>`。
59. constructor 中不得啟動任何業務流程。
60. constructor 只能用於注入與同步初始化。

八、Guard / Resolver 規則
61. Guard 只能做純條件判斷。
62. Guard 不得產生任何副作用。
63. Guard 只能回傳 `boolean` 或 `UrlTree`。
64. Resolver 不得作為狀態來源。
65. Resolver 不得隱式啟動任何流程。

九、Shared 使用規則
66. shared 不得成為狀態真相。
67. shared 不得包含任何業務決策。
68. 若 shared service 被多個 feature 當作核心邏輯使用，必須上移至 application。
69. 若無法上移，則必須降級為完全無狀態的 UI utility。

十、結構一致性要求
70. 檔案的實體位置必須準確反映其語意與分層。
71. 不得出現名稱屬於 domain 但實際為 UI 的檔案。
72. 不得將 application 職責的功能放入 shared。
73. Barrel export 不得造成任何隱性的反向依賴。

十一、最終驗收條件
74. Domain 必須能完全獨立編譯與測試。
75. Application 不得依賴 UI 或 Angular。
76. Presentation 只能依賴 application。
77. 專案中不得存在任何循環依賴。
78. 專案中不得殘留任何 RxJS 狀態。
79. Angular AOT production build 必須成功。
