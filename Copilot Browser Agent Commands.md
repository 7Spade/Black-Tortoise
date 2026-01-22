# Copilot Browser Agent 標準指令（Angular v20 + NgRx Signals + DDD）

## 指令背景

本指令用於一次性生成 Angular v20 + @ngrx/signals 的 workspace module 初始化流程與 routing，包含 11 個 module（5 個標準 + 6 個骨架），EventBus signal 正確注入，UI 與 demo data 對齊規格。**必須完全符合 DDD 分層、現代 Angular signals/reactive 標準、以及 memory-bank DDD 與現代化規範。**

---

## 模組對應名稱

| 中文   | Module 名稱            |
| ---- | -------------------- |
| 總覽   | OverviewModule       |
| 文件   | DocumentsModule      |
| 任務   | TasksModule          |
| 每日紀錄 | DailyModule          |
| 質檢   | QualityControlModule |
| 驗收   | AcceptanceModule     |
| 問題單  | IssuesModule         |
| 成員   | MembersModule        |
| 權限   | PermissionsModule    |
| 審計   | AuditModule          |
| 設置   | SettingsModule       |

---

## 目標

1. 建立 Module Host Container component，統一注入 **workspaceEventBusSignal**（Signal<EventBus>）。
2. 將 module component 的 `input() eventBus` 綁定到 Host Container 的 signal。
3. 更新 routing（app.routes.ts）：
   - 標準 5 個 module：Overview / Documents / Tasks / Daily / Settings
   - 其他 6 個 module 建立骨架 route（QualityControlModule、AcceptanceModule、IssuesModule、MembersModule、PermissionsModule、AuditModule）
   - route 對應 loadComponent → 對應 module component 包裹 Host Container
4. 更新 WorkspaceContextStore demo data：
   - `moduleIds` 包含全部 11 個 module
5. Module UI 初始化：
   - Host Container 傳入 EventBus signal
   - Module 內使用 `effect()` 或 `computed()` 訂閱事件流，不自行建立 EventBus
   - Module skeleton 顯示 loading / empty placeholder
6. UI 與樣式：
   - Sidebar 寬度 240px，Tasks badge、DailyModule 顯示規則
   - Global Header 含 Search / Notification / Settings / Account Switcher
   - Module Toolbar 含 Search / Filter / Sort / +New
   - Material 3 tokens 替代硬編碼色彩（--mat-sys-*）
7. Event Flow：
   - Module 僅 publish / subscribe
   - 所有事件集中由 centralized handler 或 use-case 處理

---

## 執行步驟

1. 在 `src/app/workspace` 下建立 `ModuleHostContainerComponent`：
   - 注入 `workspaceEventBusSignal` (Signal<EventBus>)
   - 提供 `input() eventBus: Signal<EventBus>` 給 module component
   - Skeleton / placeholder UI，方便 module content 後續填充
2. 對每個 module route 建立 route config：
   - 標準 5 個 module：
     - `path: 'overview' | 'documents' | 'tasks' | 'daily' | 'settings'`
     - `loadComponent: () => import('...').then(m => m.ModuleHostContainerComponent)`
     - route input / binding 綁定 EventBus signal
   - 其他 6 個 module：
     - `path: 'quality-control' | 'acceptance' | 'issues' | 'members' | 'permissions' | 'audit'`
     - loadComponent 指向 Host Container + placeholder module component
     - 可設定 feature flag / hidden
3. WorkspaceContextStore demo data：
   - `moduleIds = ['overview','documents','tasks','daily','settings','quality-control','acceptance','issues','members','permissions','audit']`
4. Module component：
   - 使用 `input() eventBus: Signal<EventBus>`
   - 使用 `effect(() => eventBus()?.subscribe(...))` 處理事件
   - 禁止自行 new EventBus
   - Skeleton / empty div placeholder
5. UI 調整：
   - Sidebar 240px，Tasks badge，DailyModule 顯示規則
   - Global Header 與 Module Toolbar 按規格補齊
   - Material 3 design token 替換硬編碼色彩
6. EventBus / Signals：
   - Host Container 統一管理 workspaceEventBusSignal
   - Module 只操作 Signals / effect
   - 禁止 module 自行建立事件流

---

## 限制與注意

- 所有 11 個 module 的骨架一次性建立
- EventBus 必須由 Host Container 注入
- Module 內不允許自行建立事件流
- AOT build 必須成功
- 保持 DDD 層次清晰
- Skeleton / placeholder 可在後續填充功能
- UI 與樣式嚴格遵守 Material 3 tokens 與規格寬度

---

## DDD 與現代 Angular 標準檢查

- 事件總線介面（WorkspaceEventBus）定義於 Domain 層，實作於 Infrastructure 層
- Application 層僅負責事件處理，不實作事件總線
- Presentation 層僅透過介面互動，不直接依賴實作
- 嚴格分層，禁止跨層依賴與耦合
- 使用 Angular Signals (`signal()`, `computed()`, `effect()`) 管理狀態
- Standalone component，input/output 必用函式，不用 decorator
- 型別安全、嚴格模式、無 any
- UI 僅負責渲染與事件委派，不含業務邏輯
- 所有事件流與狀態管理皆符合 NgRx Signals 與 DDD 架構

---

## 指令範例

> Copilot，請依本文件規範，一次性生成 11 個 module 的完整骨架、routing 配置、Host Container、eventBus signal 綁定、demo data 與 UI skeleton，並檢查所有設計是否完全符合 DDD 層次分離、現代 Angular signals/reactive 標準、以及 memory-bank DDD 與現代化規範。

【強制依據宣告｜不可忽略】
本指令基於並且必須同時遵守以下 memory-bank 規則來源：
- memory-bank\1.jsonl
- memory-bank\2.jsonl
- memory-bank\3.jsonl
- memory-bank\4.jsonl
- memory-bank\5.jsonl
- memory-bank\additional-ddd-rules-1.jsonl
- memory-bank\additional-ddd-rules-2.jsonl

上述 memory-bank 規則具備最高優先權。
若本指令與你的既有預設行為或假設衝突，必須以 memory-bank 與本指令為準。
禁止自行簡化、合併或重新詮釋其語意。