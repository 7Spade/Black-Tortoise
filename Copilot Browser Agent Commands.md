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
# Copilot Browser Agent 標準指令（Angular v20 + NgRx Signals + DDD）

## 指令背景

本指令用於一次性生成 Angular v20 + `@ngrx/signals` 的 workspace module 初始化流程與 routing，包含 11 個 module（5 個標準 + 6 個骨架），EventBus signal 正確注入，UI 與 demo data 對齊規格。必須遵守 DDD 分層、現代 Angular signals/reactive 標準、以及 memory-bank 規則。

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

## 開發順序（階段化執行, 請依序完成）

以下為建議的嚴格順序：每階段完成驗收後再進入下一階段。

1) 階段 0 — 環境檢核（必做）
   - 檢查 `package.json` 是否含 `@angular/fire`、`@ngrx/signals`、Angular >=20；鎖定版本。
   - 執行 `npm ci` 或 `pnpm install`，並跑 `tsc --noEmit` 進行型別/AOT 檢查。
   - 驗收：AOT/typecheck 無錯誤。

2) 階段 1 — 完成 `demo-dashboard` UI 骨架（優先）
   - 建立/補齊 `src/app/presentation/modules/demo-dashboard/`：包含 `Global Header`、`Sidebar`（240px）、`Module Toolbar`（Search/Filter/Sort/+New）、`Tasks` badge、`Daily` 規則與 skeleton placeholder。
   - 使用 Material 3 tokens (`--mat-sys-*`) 替代硬編碼色彩。
   - 使用 Angular 20 control-flow（`@if/@for/@switch`）於 template 中呈現 signals 驅動的 UI。
   - 驗收：骨架在 DOM 可見、sidebar 為 240px、樣式使用 tokens。

3) 階段 1.1 — demo-dashboard 與 AngularFire 範例整合
   - 在 demo-dashboard 使用 `inject()` 取得 AngularFire（如 `Firestore`），並以 `toSignal()` 或 store 的 `rxMethod()` 將 Observable 轉為 Signal，禁止 manual `subscribe()`。
   - 驗收：至少一個 AngularFire 資料流被轉為 Signal 並驅動 UI。

4) 階段 2 — 建立 `ModuleHostContainerComponent`（signals 驅動 Host）
   - 新增 `src/app/presentation/workspace-host/module-host-container.component.ts`（standalone component），在 Host 建立 `workspaceEventBusSignal = signal<WorkspaceEventBus | null>(null)`。
   - Host 以 `input()` 將該 signal 傳給子元件，並以 route data 驅動選擇要顯示的 module。
   - 驗收：Host 可被 `loadComponent` 載入並傳遞 `workspaceEventBusSignal`。

5) 階段 3 — 路由整合（所有 route 指向 Host）
   - 修改 `src/app/app.routes.ts`：五個主要 module 與六個骨架皆以 `loadComponent` 載入 Host，並帶 `data: { moduleId: '...' }`。
   - Host 讀取 `route.data.moduleId` 並 render 相對應子元件或動態載入。
   - 驗收：路由能載入 Host 並顯示對應 skeleton。

6) 階段 4 — 建立 11 個 module skeleton 並標準化 `input()`
   - 在 `src/app/presentation/modules/` scaffold 11 個 skeleton components（overview, documents, tasks, daily, settings, quality-control, acceptance, issues, members, permissions, audit）。
   - 每個 component 使用 `input()` 接收 `Signal<WorkspaceEventBus | null>`，並使用 `effect()`/`computed()` 處理事件；完全移除 `@Input()` decorator 與 manual RxJS subscriptions。
   - 驗收：11 個 skeleton 可被載入，皆使用 `input()` 與 signals。

7) 階段 5 — 更新 `WorkspaceContextStore` 與 store 示範
   - 修改 `src/app/application/stores/workspace-context.store.ts`：`moduleIds = ['overview','documents','tasks','daily','settings','quality-control','acceptance','issues','members','permissions','audit']`。
   - 在 store 範例中使用 `rxMethod()` + `tapResponse()` 與 AngularFire 做示範查詢（Signal 化）。
   - 驗收：store demo 資料正確並示範 signals I/O。

8) 階段 6 — DDD 強制：禁止 module 內部建立 EventBus
   - 檢查並移除 module 內 `new EventBus()` 或直接注入 infrastructure 實作，改由 Host 提供 signal 或 application 層處理。
   - 驗收：module 檔案不含 EventBus 實作或直接注入。

9) 階段 7 — 樣式統一與可及性
   - 更新 `src/global_styles.scss` 與各元件樣式以使用 `--mat-sys-*` tokens，sidebar 寬度設為 `240px`，檢查 ARIA 與鍵盤互動。
   - 驗收：無硬編碼顏色/尺寸，a11y 基本檢查通過。

10) 階段 8 — 測試、AOT 與 CI
   - 為 Host、demo module 與 AngularFire flow 新增 `.spec.ts`；執行 `tsc --noEmit`、`npm run lint`、`npm run test`（如有），修正問題。
   - 驗收：型別檢查與主要測試通過，CI 能順利執行。

---

## 前置條件（總覽）
- `demo-dashboard` 必須先完成作為樣式與共用元件基準。
- 本機需能執行 `npm ci` / `pnpm install` 並跑 `tsc --noEmit`。
- 所有變更必須遵循下列 memory-bank 規則檔（最高優先權）。

---

## 重要檔案對應（快速索引）
- Host container: `src/app/presentation/workspace-host/module-host-container.component.ts`（新增）
- 路由: `src/app/app.routes.ts`（修改）
- Demo dashboard: `src/app/presentation/modules/demo-dashboard/*`（建立/修改）
- Module skeletons: `src/app/presentation/modules/{overview,...,audit}/*.ts`（建立）
- Store: `src/app/application/stores/workspace-context.store.ts`（修改）
- Global styles: `src/global_styles.scss`（修改）
- Domain EventBus interface: `src/app/domain/workspace/workspace-event-bus.ts`（檢查）
- Infrastructure EventBus 實作: `src/app/infrastructure/...`（不得由 presentation 直接依賴）

---

## 事件總線檢視（EventBus 評估）與 EventFlow 規劃

目的：確認目前以 Host 提供 `workspaceEventBusSignal`（`Signal<WorkspaceEventBus|null>`）為主的架構，是否為整個專案最穩健與可維護的解法；同時在 Commands.md 中加入具體的 EventFlow（事件流）規劃，讓自動化與開發者有明確、可驗收的實作步驟。

結論（建議）：
- 保持「Host 提供 EventBus signal」的模式為首選方案，理由如下：
  - 符合 DDD 層次：presentation 只消費 signal，EventBus 的具體實作留在 infrastructure 或 application，避免 presentation 直接 new/注入實作。
  - 易於測試與 Mock：Host 可在測試或 storybook 中替換 signal 為 mock，模擬事件流。
  - 支援多 workspace / 多實例：每個 Host 可以持有獨立的 `workspaceEventBusSignal`，避免全域單例帶來的共享狀態問題。

替代方案（僅在特殊需求下考慮）：
- Application 層集中事件總線（單一 source-of-truth）並以 store 發佈 signals 給 Host；適用於需要跨 workspace 聚合或全域事件審計的場景，但會增加 coupling 與複雜度。

風險與防範：
- 切勿在 presentation/module 內 `new EventBus()` 或直接 import infrastructure 實作（Commands.md 已列為禁止）。若發現此情形，請先建立 DecisionRecord 再做遷移。
- 確保 EventBus 的介面（domain 層）為純 domain types（不可含 Angular/Firestore types），以利換層測試與替換實作。

EventFlow（事件流）規劃：

1) 事件分類（Event Types）
   - Command (意圖): 由 UI 發起，例如 `OpenTaskCommand`, `CreateTaskCommand`。
   - Domain Event (事實): 由 Domain/Application 發佈，例如 `TaskCreatedEvent`, `WorkspaceSwitchedEvent`。
   - Integration Event: 與外部系統（Firebase、外部 API）互動後的事件，例如 `TaskSyncedEvent`。

2) 發送（Emit）與處理（Handle）流程
   - UI / Module → Host: module 透過 `effect()` 或直接呼叫 Host 暴露的 API 發送 Command（例如：`host.sendCommand({ type:'CreateTask', payload })`）。
   - Host → Application: Host 將 Command 轉交給 Application 層的 use-case / handler（保持同步或非同步視需求），Application 回傳 Domain Event 或結果（以 Promise/Signal）。
   - Application → Infrastructure: 若需 persist（Firestore 等），由 Application 層呼叫 Repository/AngularFire；IO 採用 `rxMethod()` + `tapResponse()` 或 `toSignal()` 包裝成 Signal，並將結果轉譯為 Domain Event。
   - Domain Event → Host/Modules: Application 發佈 Domain Event 到 EventBus（infrastructure 實作或 runtime factory），EventBus 以 signal 封裝，使 Host/Module 能以 `input()` 消費。

3) EventBus API（建議介面）
   - domain 層介面（純型別）例如：
     ```ts
     export interface WorkspaceEventBus {
       emit(event: DomainEvent): void; // 非阻塞
       on<T extends DomainEvent>(type: string, handler: (e: T) => void): Unsubscribe;
       eventsSignal(): Signal<DomainEvent[]>; // 選用：供 UI 顯示 recent events
     }
     ```
   - 注意：實作細節（例如持久化、重試）放在 infrastructure。

4) 信號化策略（Signals Interop）
   - 所有外部 Observable（AngularFire / RxJS）在 application/store 層轉為 Signal：`toSignal(obs$, { initialValue })` 或 `rxMethod()` → `tapResponse()`。
   - EventBus 對外暴露 `Signal` 或 `input()` 的 `Signal<WorkspaceEventBus|null>` 供 module 消費，避免 module 內部維護訂閱。

5) 錯誤處理、重試與監控
   - 所有與外部系統互動的步驟應提供錯誤回饋到 EventBus（例如 `EventBus.emit({ type:'Error', payload })`），或經由 Application 層回傳結果 signal 並由 Host 顯示 toast/error banner。
   - 為重要事件設計 audit log：Application 層在關鍵 Domain Event 發生時寫入審計（可透過 Repository 實作）。

6) 測試與驗收準則
   - 單元測試：mock WorkspaceEventBus signal 給 module，驗證 module 在接收到特定 Domain Event 時呼叫預期的 handler 或變更 ViewModel。
   - 整合測試：在 Host-level 測試中以 fake/in-memory EventBus（`in-memory-event-bus.ts`）模擬 persist 與分發，驗收整體 EventFlow（UI→Host→Application→Infrastructure→EventBus→Module）。
   - 自動化驗收：新增整合腳本以模擬 `CreateTaskCommand` 並斷言最後 module 收到 `TaskCreatedEvent` 並 UI 更新。

實作步驟（短期優先）
1. 在 `src/app/domain/workspace/workspace-event-bus.ts` 定義 domain 級介面（如上）。若已存在，確認其為純 domain types。建立 DecisionRecord 如有差異。
2. 在 `src/app/infrastructure/runtime/` 實作 `in-memory-event-bus.ts`（現有檔案應檢查並標註），並新增一個 `firestore-event-bus`（若需要持久化）。
3. Host：維持 `workspaceEventBusSignal = signal<WorkspaceEventBus|null>(null)`，並在 application 層初始化 runtime 實作後 `workspaceEventBusSignal.set(bus)`。
4. Module：只用 `input<Signal<WorkspaceEventBus|null>>()` 消費事件，並以 `effect()` 監聽需要的事件類型。
5. 測試：新增 Host-level 整合測試，使用 `in-memory-event-bus` 驗證 EventFlow。

驗收標準（Commands.md 自動化驗收對應）
- EventBus domain 介面存在且為純 domain types。
- presentation 無直接 import infrastructure EventBus 實作，也無 `new EventBus()`。
- Host 能成功注入並設定 `workspaceEventBusSignal`（非 null）且 module 能接收並處理至少一個 Domain Event（整合測試通過）。

--

## 自動檢測與修復流程（手動 / grep-based，倚賴人工審核）

目的：在不於儲存庫新增執行腳本的前提下，提供一套可被開發者/Code Review 人員逐步執行的檢測與修復流程，找出並改正 presentation 層違規使用 EventBus 或直接依賴 infrastructure 的情形。

檢測（建議本地執行，Windows PowerShell 範例）：

1. 檢查 presentation 直接 import infrastructure EventBus 實作：
```powershell
Select-String -Path . -Pattern "in-memory-event-bus|InMemoryEventBus|workspace-runtime.factory" -SimpleMatch
```
2. 搜尋 presentation 層呼叫 runtimeFactory.getRuntime 或 new InMemoryEventBus：
```powershell
Select-String -Path src\app\presentation\**\*.ts -Pattern "getRuntime\(|new InMemoryEventBus|new .*EventBus" -CaseSensitive
```
3. 檢查 routes 是否仍直接載入 module（而非 Host + data.moduleId）：
```powershell
Select-String -Path src\app\app.routes.ts -Pattern "loadComponent: .*presentation\\modules" -SimpleMatch
```

若上述任一檢測命中，請依下列「修復步驟」執行人工 refactor 並建立 DecisionRecord。

修復步驟（示範流程，不含自動化腳本）：
1. 為每個被標記檔案建立 DecisionRecord（範本見下）。
2. 在 Host（`src/app/presentation/workspace-host/`）新增或確認 `module-host-container.component.ts`，並讓 Host 管理 `workspaceEventBusSignal`。
3. 將 presentation 中直接使用 `runtimeFactory.getRuntime()` 的邏輯移回 Application 或 UseCase，Host 於切換 workspace 時呼叫 runtimeFactory 並設定 `workspaceEventBusSignal.set(runtime.eventBus)`。
4. 變更 module component（例如 `DemoDashboardModule`）由原先 runtime 取用改為接收 `input<Signal<WorkspaceEventBus|null>>()`，以 `effect()` 監聽事件。
5. 在 PR 描述中附上 DecisionRecord 與變更摘要，Request Review 並在 CI 前人工跑一次 `tsc --noEmit`。

DecisionRecord 範本（放置路徑：`.agent_work/decision-records/<file>-decision.md`）：
```
### Decision - <檔案路徑> - <YYYY-MM-DD>
**Decision:** (遷移 / 保留 / 拆分)
**Context:** (目前狀態與發現的違規或模糊點)
**Options:** (列出可選方案與利弊)
**Rationale:** (選擇理由)
**Impact:** (需要修改的檔案、測試、風險)
**Validation:** (如何驗收、執行哪些檢查)
**Author:** (姓名)
```

--

## Demo module refactor 範例（具體 before → after）

目標：示範如何把 `DemoDashboardModule` 從直接呼叫 runtime/subscribe，改為 Host 提供 `Signal<WorkspaceEventBus|null>` 並由 module 以 `input()` 消費。

Before（現況重點摘錄）
```ts
// DemoDashboardModule (excerpt)
const runtime = this.runtimeFactory.getRuntime(workspace.id);
if (runtime) { this.initialize(runtime.eventBus); }
// initialize uses eventBus.subscribe(...)
```

After（refactor 建議）
1) Host: 在 workspace 切換或建立 runtime 時設定 signal：
```ts
// module-host-container.component.ts (Host)
import { signal } from '@angular/core';
readonly workspaceEventBusSignal = signal<WorkspaceEventBus | null>(null);

// when runtime created
const runtime = runtimeFactory.createRuntime(workspace);
this.workspaceEventBusSignal.set(runtime.eventBus);
```

2) Demo module: 改為接收 `input()` 並使用 effect()：
```ts
import { Component, input, Signal, effect } from '@angular/core';
@Component({ standalone: true })
export class DemoDashboardModule implements Module {
   readonly eventBus = input<Signal<WorkspaceEventBus | null>>();

   constructor() {
      effect(() => {
         const bus = this.eventBus?.();
         if (!bus) return;
         // use bus.publish / subscribe wrapper (prefer eventsSignal or handler registration)
         const unsub = bus.subscribe('WorkspaceSwitched', (e) => { /* update view model */ });
         // cleanup handled by module destroy
      });
   }
}
```

變更檔案清單（範例）：
- `src/app/presentation/workspace-host/module-host-container.component.ts`（新增/修改）
- `src/app/presentation/modules/demo-dashboard.module.ts`（修改為 input() consumption）
- `src/app/app.routes.ts`（更新為 Host load + `data.moduleId`）
- `src/app/application/*`（如有 runtime 取得邏輯，移至 use-case 或 factory）

回退方案：若 refactor 導致問題，可 revert PR，並在 DecisionRecord 註明阻礙點與下一步。

--

## 路由遷移（手動步驟範本）

目標：把現有 `app.routes.ts` 中直接載入 module 的路由，改為載入 Host 並附帶 `data.moduleId`。

手動步驟：
1. 在 `routes` 中把各 module route 改成：
```ts
{
   path: 'tasks',
   loadComponent: () => import('./presentation/workspace-host/module-host-container.component').then(m => m.ModuleHostContainerComponent),
   data: { moduleId: 'tasks' }
}
```
2. 在變更PR中列出被替換的原始路由條目並附上 `tsc --noEmit` 的輸出（人工執行），以便 reviewer 驗證。

注意：不要同時把 Host 與現有 `workspace-host.component.ts` 的功能重複；新 Host 應和 `WorkspaceHostComponent` 共存或合併責任（以 DecisionRecord 決定）。

--

## 測試與驗收 harness（人工步驟與範例測試片段）

整合驗收建議（手動 / unit tests 範例）：

1) Host-level 整合測試（假設使用 Jasmine/Karma 或 Jest）概念：
- Arrange: 建立 fake `WorkspaceRuntimeFactory` 回傳 `InMemoryEventBus`；Mount Host 並設定 workspace。
- Act: 從 module 或 Host 發送 `CreateTaskCommand`。
- Assert: 以 spy 或 event handler 驗證 module 收到 `TaskCreatedEvent` 並 UI state 更新。

測試樣板（概念，不寫入專案測試套件）：
```ts
it('flows CreateTaskCommand -> TaskCreatedEvent -> module updates', async () => {
   const bus = new InMemoryEventBus('ws-test');
   runtimeFactory.createRuntime.mockReturnValue({ context: ..., eventBus: bus });

   // mount Host and module, trigger command
   bus.publish({ eventType: 'TaskCreatedEvent', payload: { id: 't1' } });

   expect(moduleSpy).toHaveBeenCalled();
   // Verify UI or store state
});
```

2) 手動驗收步驟（Reviewer）：
- 切換到 demo identity -> Create demo workspace (透過 UI) -> Activate module -> Trigger create task -> 觀察 module UI 變化與 workspace store state。

--

## memory-bank 規則對照檢查表

為確保 Commands.md 與開發準則不違反記憶庫規則，請在變更前後以此清單核對：
- [ ] Domain 層不含 Angular/Firestore/RxJS（檢查 domain/*.ts 進口）
- [ ] Application 層不 import presentation 或 infrastructure 實作
- [ ] Presentation 不直接 new/import infrastructure EventBus（Search & DecisionRecord）
- [ ] 所有 store 使用 `signalStore` 與 `patchState`（檢查 store 檔案）
- [ ] Routes 以 Host 為入口（若採用此策略）
- [ ] 不在 repo 新增執行腳本；所有檢查均提供手動指令或 reviewer 步驟

確認說明：目前文件已調整以對齊上述檢查表的要求；實際符規性需在每次 PR 變更時以上述檢查步驟驗證。


## 可能造成混淆的檔案（請檢查並註記）

以下檔案經常在 codebase 中引起「page vs module」、「Host vs Shell」、「EventBus 實作位置」等混淆，請在自動化或手動重構前逐一檢查並在 Commands.md 中註記處理決策（遷移/保留/合併）：

- `src/app/presentation/modules/demo-dashboard.module.ts`：是否為 page（遷移到 `presentation/pages`）或為 module aggregator（保留於 modules）需明確註記。
- `src/app/presentation/modules/*.module.ts`（如 `overview.module.ts`、`tasks.module.ts` 等）：檢查是否含有 page 級 layout 或直接注入 runtime/store 的程式碼。
- `src/app/presentation/modules/shared/base-module.ts`：共享基底類別可能包含 page 行為，需確認只含共用 UI/輕量行為。
- `src/app/presentation/modules/shared/module-event-helper.ts`：若這裡封裝 EventBus 相關邏輯，務必確認它只使用 domain interface，不依賴 infrastructure 實作。
- `src/app/presentation/shell/global-shell.component.ts`：Shell 與 Host 的責任邊界（全域 header vs workspace host）需清楚畫分。
- `src/app/presentation/workspace-host/workspace-host.component.ts`：若同時存在 `workspace-host` 與將新增的 `ModuleHostContainerComponent`，需定義誰管理 `workspaceEventBusSignal` 與 layout。
- `src/app/presentation/app.component.ts` / `src/main.ts`：應檢查是否有直接初始化 Firebase、EventBus 或 global stores 的程式，避免在 bootstrap 階段破壞分層。
- `src/app/app.routes.ts`：路由若同時指向 module components 與 page components，請統一為 Host 或 Page wrapper 的入口策略。
- `src/app/application/stores/workspace-context.store.ts`：store demo data 與現有 moduleId 列表是否同步，避免 runtime 與 UI 不一致。
- `src/app/domain/workspace/workspace-event-bus.ts`：Domain 層介面若與 presentation 層使用不一致（Signal vs 物件 API），需排定轉接策略。
- `src/app/infrastructure/runtime/workspace-runtime.factory.ts`、`src/app/infrastructure/runtime/in-memory-event-bus.ts`：檢查是否有被 presentation 直接 import 或 new 的情況（禁止）。
- `src/app/domain/module/module.interface.ts`：確認 interface 中的 initialize/inputs 是否與 `input()` pattern 對齊。
- `src/environments/environment.ts` / `src/environments/environment.prod.ts`：檢查 Firebase key 與環境設定是否被正確管理（不要硬編碼）。
- `dataconnect-generated/` 下的自動產生檔：若被直接 import 到 presentation，請改由 application 層或 repository 轉接。
- `src/app/presentation/modules/README.md`：若內含使用說明與範例，請同步更新以反映 pages/modules 的決策。

建議：對上述每一檔案，在執行自動化修改前建立一個小紀錄（DecisionRecord）註明：目前位置、為何可能混淆、最終決策（遷移/保留/拆分）、所需變更與測試要點。


## 決策說明：`presentation/modules` vs `presentation/pages`

問題：目前 `demo-dashboard` 放在 `presentation/modules`，這會讓人混淆它是否為可重用的 feature module 或為路由入口頁面（page）。為了清楚責任邊界與路由管理，建議採取以下規則並在本指令檔中明確說明，讓 Copilot 在自動化時能依此遷移或保留。

規則：
- 若該元件是一個「路由入口、整個頁面（page）」且包含頁面級共用布局（Global Header、Sidebar、Page-level toolbar）或多個子 feature，則應放在 `src/app/presentation/pages/<page-name>/`。Page 代表完整的 route view，Host container 應從 pages 入口載入。
- 若該元件是可在多個頁面間重用的「feature module / 小範圍 UI 組件」，則放在 `src/app/presentation/modules/<feature>/`。

判定對 `demo-dashboard` 的建議：
- `demo-dashboard` 為整體展示頁面（包含 header/sidebar、toolbar、多個 widget/skeleton），屬於路由入口頁面（Page）。因此建議把 `demo-dashboard` 遷移到 `src/app/presentation/pages/demo-dashboard/`，並把原有 `presentation/modules/demo-dashboard/` 改為 `presentation/pages/demo-dashboard/` 或建立頁面 wrapper 指向 modules 的小組件。

遷移步驟（如果決定遷移）：
1. 新增目錄 `src/app/presentation/pages/demo-dashboard/`，建立 `demo-dashboard.page.ts`（standalone page component）負責 layout（Header/Sidebar/Toolbar）並在 page 內載入原先的 module-level widgets（可維持在 `presentation/modules/*`）。
2. 把原本 `presentation/modules/demo-dashboard/*` 的大範圍頁面邏輯抽成 `demo-dashboard.page.ts`，將可重用子組件（widget）保留於 `presentation/modules/demo-dashboard/widgets/`。
3. 更新 `src/app/app.routes.ts`：把 `path: 'demo'` 或相關路由的 `loadComponent` 指向 `presentation/pages/demo-dashboard/demo-dashboard.page.ts`。
4. 更新 `Copilot Browser Agent Commands.md` 中的檔案 mapping（已包含 pages 路徑），並在變更紀錄附上 `tsc --noEmit` 與單元測試檢查。
5. 確保 styles 路徑與 selector 名稱同步，並更新任一被引用的 `import` 路徑。

如果不遷移（保留在 `presentation/modules`）：請在 Commands.md 加註該 module 僅可作為「page wrapper」或「feature aggregator」，且 route 裡必須明確由 Host 或 Page wrapper 承擔 layout 職責，避免 module 同時扮演 page 與可重用元件的雙重角色。

驗收（決策完成的條件）：
- Commands.md 記錄了 clear rule（pages vs modules）與 demo-dashboard 的最終決定（遷移或保留）。
- 若選擇遷移：新增 `src/app/presentation/pages/demo-dashboard/demo-dashboard.page.ts` 或等價 wrapper，並更新路由示例於 Commands.md。若選擇保留：在 Commands.md 明確標註保留原因與必須遵守的設計限制。


## 範例程式片段（精簡）

ModuleHostContainerComponent（示意）：
```ts
import { Component, effect, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceEventBus } from '../../domain/workspace/workspace-event-bus';

@Component({
   standalone: true,
   selector: 'app-module-host-container',
   template: `
      <app-global-header></app-global-header>
      <div class="workspace-body">
         <aside class="workspace-sidebar"></aside>
         <main class="workspace-main">
            <ng-container *ngIf="moduleId === 'demo'">
               <app-demo-module [eventBus]="workspaceEventBusSignal"></app-demo-module>
            </ng-container>
         </main>
      </div>`
})
export class ModuleHostContainerComponent {
   readonly workspaceEventBusSignal = signal<WorkspaceEventBus | null>(null);
   moduleId = '';

   constructor(route: ActivatedRoute) {
      this.moduleId = route.snapshot.data['moduleId'] ?? '';
      effect(() => {
         const bus = this.workspaceEventBusSignal();
         if (bus) {
            // central logging/metrics (keep business logic in application layer)
         }
      });
   }
}
```

路由範例：
```ts
{
   path: 'overview',
   loadComponent: () => import('./presentation/workspace-host/module-host-container.component').then(m => m.ModuleHostContainerComponent),
   data: { moduleId: 'overview' }
}
```

Module skeleton 接收 eventBus（示意）：
```ts
import { Component, input, Signal, effect } from '@angular/core';
import { WorkspaceEventBus } from '../../../domain/workspace/workspace-event-bus';

@Component({ standalone: true, selector: 'app-overview-module', template: `<div>Overview skeleton</div>` })
export class OverviewModuleComponent {
   readonly eventBus = input<Signal<WorkspaceEventBus | null>>();

   constructor() {
      effect(() => {
         const bus = this.eventBus?.();
         if (bus) {
            // use bus API (no manual RxJS subscribe)
         }
      });
   }
}
```

---

## 自動化驗收清單（可程式檢查）
- demo-dashboard UI 骨架完成且以 Material tokens 呈現。
- `ModuleHostContainerComponent` 已存在並持有 `workspaceEventBusSignal`。
- 路由指向 Host 並帶入 `data.moduleId`，Host 可依據該資料 render 子元件。
- 11 個 module skeleton 存在且使用 `input()`、`effect()` 處理 eventBus。
- `WorkspaceContextStore` demo `moduleIds` 包含完整 11 項。
- AngularFire 資料流示範以 `toSignal()` 或 `rxMethod()` 處理，無 manual subscription。
- AOT/typecheck (`tsc --noEmit`) 無錯誤。

---

【強制依據宣告｜不可忽略】
本指令基於並且必須同時遵守以下 memory-bank 規則來源：
- memory-bank\1.jsonl
- memory-bank\2.jsonl
- memory-bank\3.jsonl
- memory-bank\4.jsonl
- memory-bank\5.jsonl
- memory-bank\additional-ddd-rules-1.jsonl
- memory-bank\additional-ddd-rules-2.jsonl

上述 memory-bank 規則具備最高優先權。如本指令與預設行為衝突，必須以 memory-bank 與本指令為準。

---

請指示從哪個階段開始（建議先執行 **階段 0：環境檢核**）。
請確認：我已把指令檔補上前置條件、分步實作與範例。接下來要我直接開始在 repo 中實作「第 1 項：完成 demo-dashboard.module 的 UI 骨架」還是先建立 `ModuleHostContainerComponent` 與路由 patch？
