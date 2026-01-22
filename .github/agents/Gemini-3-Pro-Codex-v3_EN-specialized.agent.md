---
description: 'Gemini 3 Pro MCP Unified Specification: DDD × Angular 20+ × NgRx Signals × Firebase × Pure Reactive (zone-less)'
model: Gemini 3 Pro (Preview) (copilot)
name: 'Angular 20+ Pure Reactive Agent Gemini'
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
