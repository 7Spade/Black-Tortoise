---
description: 'GPT-5.2-Codex MCP Unified Specification: DDD × Angular 20+ × NgRx Signals × Firebase × Pure Reactive (zone-less)'
model: GPT-5.2-Codex
name: 'Angular 20+ Pure Reactive Agent 5.2-v3'
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

## 2. 明確可判斷的規則句 (Rule Sentence)

*   **分層依賴**: Domain 層所有檔案 MUST 保持框架無關性 (禁止 import Angular/RxJS/Firebase)。
*   **響應式數據流**: Infrastructure 層 Repository MUST 返回 `Observable<T>`，禁止使用 `.subscribe()` 或 Promise。
*   **狀態管理**: Application 層 Store MUST 使用 `signalStore()` 與 `withState`, `withComputed`, `withMethods`。
*   **非同步處理**: 所有非同步操作 (API/I/O) MUST 在 `rxMethod()` 中使用 `tapResponse()` 處理回調。
*   **狀態更新**: Application 狀態更新 MUST 僅通過 `patchState()` 進行，禁止直接變更屬性。
*   **UI 指令**: 所有組件範本 MUST 使用 Angular 20+ 新版控制流 (`@if`, `@for`, `@switch`)。
*   **組件通訊**: 跨 Store 通訊 MUST 使用 `EventBus` 模式，禁止 Store 之間相互注入。
*   **命名規範**: 檔案命名 MUST 使用 kebab-case (如: `user-profile.store.ts`)。

## 3. 適用範圍鎖定句 (Scope Sentence)

*   **applyTo: `src/app/domain/**`**:
    *   僅包含純 TypeScript 定義 (Model, Policy, Types)。
    *   嚴禁導入任何以 `@angular/`, `firebase/`, `rxjs/` 開頭的庫。
*   **applyTo: `src/app/infrastructure/**`**:
    *   負責封裝 Firebase SDK 與 API 呼叫。
    *   必須轉換外部 DTO 為 Domain Model 後再回傳。
*   **applyTo: `src/app/application/**`**:
    *   負責狀態調度與業務流，嚴禁使用 `async/await`。
    *   必須確保所有狀態為 Signal-based 且 Zone-less。
*   **applyTo: `src/app/presentation/**`**:
    *   僅限展示邏輯，嚴禁直接注入 Firebase 服務。
    *   必須透過注入 Store 或 Application Services 獲取數據。
*   **applyTo: `**/*.html`**:
    *   強制使用 `@if`, `@for`, `@switch`, `@defer`。

## 4. 禁止行為句 (Forbidden Sentence)

*   **FORBIDDEN**: 使用傳統 NgRx 包 (`@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`)。
*   **FORBIDDEN**: 在 Application 或 Interface 層手動調用 `.subscribe()`。
*   **FORBIDDEN**: 直接在組件中注入 `Firestore`, `Auth`, `Functions` 等 Firebase SDK 服務。
*   **FORBIDDEN**: 使用 `*ngIf`, `*ngFor` 或 `*ngSwitch` 指令。
*   **FORBIDDEN**: 使用 `async/await` 處理狀態更新 (Application Layer)。
*   **FORBIDDEN**: 在 Domain 層中包含任何框架裝飾器 (如 `@Injectable`) 或依賴。
*   **FORBIDDEN**: 依賴 `zone.js` 進行變更檢測 (本專案為 Zone-less 架構)。
*   **FORBIDDEN**: 導入 `@angular/platform-browser-dynamic` (僅限 `bootstrapApplication`)。
*   **FORBIDDEN**: 直接 store-to-store 依賴導致循環引用。

## 5. 優先權宣告句 (Priority / Severity)

*   **CRITICAL**: 若 Domain 層檢測到框架依賴，或 Interface 層檢測到 Firebase 注入，必須立即停止開發並優先修正。
*   **P0 (Blocker)**: 範本中使用 `*ngIf`/`*ngFor`、或非同步邏輯缺少 `tapResponse` 處理。
*   **P0 (Correctness)**: 狀態更新未使用 `patchState` 或在 `effect()` 中變更狀態。
*   **P1 (Standard)**: 檔案命名不符合層級對應 (如 `*.model.ts` 不在 domain 中)。
*   **P2 (Optimization)**: 未在組件中使用 `computed()` 處理複雜 UI 派生狀態。

---

## 6. 核心參考資訊 (Reference Information)

### 6.1 專案結構範例 (Standard DDD)
```
src/app/
├── domain/                          # 🎯 核心業務邏輯 (Pure TS - No Frameworks)
│   ├── entities/                    # 具有唯一識別碼的業務對象 (*.entity.ts)
│   ├── value-objects/               # 描述性且不可變的對象 (*.value-object.ts)
│   ├── aggregates/                  # 聚合根 (*.aggregate.ts)
│   ├── events/                      # 領域事件 (*.event.ts)
│   ├── repositories/                # 倉儲介面定義 (Interfaces ONLY)
│   ├── services/                    # 跨多個實體或聚合的業務邏輯
│   └── types/                       # 業務領域專用的 TypeScript 型別
├── application/                     # 🏗️ 應用調度與狀態管理
│   ├── stores/                      # NgRx Signals 狀態中心 (*.store.ts)
│   ├── commands/                    # 改變狀態的操作封裝 (*.command.ts)
│   ├── queries/                     # 數據讀取與篩選邏輯 (*.query.ts)
│   ├── handlers/                    # Command & Query 的執行器 (*.handler.ts)
│   ├── services/                    # 應用層級服務 (Orchestration)
│   └── mappers/                     # Domain Model 與 UI/DTO 之間的轉換
├── infrastructure/                  # 🔌 基礎技術實作 (Framework/Library specific)
│   ├── persistence/                 # 倉儲介面具體實作 (*.repository.ts)
│   ├── firebase/                    # Firestore, Auth, Functions 專屬封裝
│   ├── adapters/                    # 外部 API (REST/GraphQL) 連接器
│   └── dto/                         # 外部原始數據結構定義 (*.dto.ts)
└── presentation/                    # 🎨 使用者界面與交互 (Zone-less)
    ├── shell/                       # 全域佈局、導航與根組件 (GlobalShell)
    ├── features/                    # 具體業務功能組件 (Features/Pages)
    ├── components/                  # 純展示用共用組件 (UI Components)
    └── theme/                       # M3 設計令牌與樣式 (Styles/Tokens)
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

### ❌ 禁止反模式 (Forbidden Anti-patterns)
*   **FORBIDDEN**: 在 Domain 層導入框架依賴 (如 `@Injectable`)。
*   **FORBIDDEN**: 在 Repository 中調用 `.subscribe()`。
*   **FORBIDDEN**: 在組件中直接注入 Firebase 服務。
*   **FORBIDDEN**: 在模板中使用 `*ngIf`, `*ngFor` 被取代的舊語法。
*   **FORBIDDEN**: 在 Application Layer 使用 `async/await` 處理狀態流。
*   **FORBIDDEN**: 手動變更信號值而不通過 `patchState()`。
*   **FORBIDDEN**: 跨 Store 直接注入導致循環依賴。

---

## 開發檢查清單 (Development Checklist)

Before marking any feature as complete, verify ALL items:


## Priority/Severity Checklist (P0/CRITICAL)

P0: Domain layer MUST NOT import framework code
P0: Infrastructure layer async MUST return Observable<T>
P0: Application layer async MUST use rxMethod() + tapResponse()
P0: Application layer MUST NOT直接 mutate state，僅用 patchState()
P0: Interface layer MUST NOT注入 Firebase
P0: Template MUST 只用 @if/@for/@switch
P0: 禁止 *ngIf/*ngFor/*ngSwitch
P0: 禁止 .subscribe()、async/await 於 Application layer
P0: Cross-store 溝通 MUST 用 EventBus
P0: TypeScript strict mode 必須啟用
P0: ESLint/Prettier 必須通過

CRITICAL: 違反任一 P0 規則，build/test 必須 fail，且優先修正。

---

## General

- Repeat Architecture Validation after ANY code modification
- "Propose fixes" means both suggest and automatically apply the fixes
- Do NOT wait for user to remind you to validate architecture
- Do NOT proceed with new features if CRITICAL violations exist
- EventBus pattern is MANDATORY for cross-store communication
- Template syntax violations are CRITICAL - they must be fixed immediately
- When in doubt, consult Context7 MCP for official documentation
- Always use Sequential Thinking to break down complex requirements
- Software Planning TODO checklist is REQUIRED before implementation
- Zone-less architecture is non-negotiable - verify provideExperimentalZonelessChangeDetection()
