# Copilot Summary — Black-Tortoise 精簡指令

本文為 Copilot 被動閱讀時的首要、最高優先級摘要；請以此作為自動建議的主要依據。

核心原則（優先順序由上至下）：

1. 專案定位：Angular 20+（Zone-less / Signals）、DDD、事件驅動。優先遵守 `src/app/*/AGENTS.md` 的層級規則。
2. 依賴方向：Presentation → Application → Domain。Infrastructure 實作 Application 介面。禁止 Domain 依賴 Framework。
3. Templates：只綁定 Signals；使用 Angular 20 控制流 `@if`、`@for (track ...)`、`@switch`、`@defer`。
4. State：使用 `signalStore()`、`withState()`、`withComputed()`、`withMethods()`；所有 async 在 `rxMethod()` 處理。
5. Event Flow：Append (persist) → Publish (EventBus) → React (stores/effects)。優先選用事件鏈而非直接跨-store呼叫。
6. Infrastructure：所有 Firebase / SDK import 只在 `src/app/infrastructure`。使用純粹 mapper `toDomain`/`toDto`。
7. Templates/Components：Smart components 注入 Facades/Stores；Dumb components 只 `input()` / `output()`。
8. Keep it minimal：優先簡潔、單一職責、避免新增未必要的抽象（Occam's razor）。
9. 優先閱讀：若規則衝突，先遵守根 `AGENTS.md` → `src/app/AGENTS_INDEX.md` → 各層 `AGENTS.md`。
10. 變更流程：非 trivial 改動請透過 PR 並附 ADR；policy 變更需更新 `src/app/AGENTS_INDEX.md`。

使用指引：
- Copilot 在被動模式（讀取 repository context）時，僅使用本檔與 `src/app/*/AGENTS.md` 作為高優先上下文；其他 `.github` 長篇檔案為參考，但非首要規則來源。

維護者：請把大型 agent/instructions/skills 檔案移至 `.github/archive/` 或外部 repo，並保持此摘要最新。

強制遵守（必讀且優先）:

- **目標：** 使 Copilot 在所有情況下 100% 遵守下列五份專案指示檔，且在規則衝突時以它們為最高優先權（即優於本摘要與其他一般檔案）。
- **請務必遵守的檔案（路徑）:**
	- .github/instructions/00-user-guidelines.instructions.md
	- .github/instructions/01-organization-guidelines.instructions.md
	- .github/instructions/02-workspace-guidelines.instructions.md
	- .github/instructions/03-modules-guidelines.instructions.md
	- .github/instructions/04-event-sourcing-and-causality.instructions.md

- **執行原則：**
	1. Copilot 在解析與建議時，必須把上述五份檔案視為法規等級的規則（hard constraints）。
	2. 若本摘要與上述檔案內容有衝突，應以上述檔案為準，並在輸出中註明採用哪一份檔案的哪一段規則。 
	3. 任何對程式碼結構、層級或安全性的重要變更，都必須優先考量這五份檔案中的規範，並於 PR 描述中指明對應的規則條目。

建議流程（維護者/Reviewer）：
- 在合併任何影響架構或工作流程的 PR 前，檢查是否違反上述五份檔案的規定；若違反，請回退或要求修改，並在 PR 留下對應規則引用。

設計與實作原則（強制執行）:

- **現代控制流（Angular 20）:** 所有模板應使用 `@if`、`@for (track ...)`、`@switch`、`@defer` 等控制流語法；禁止使用舊式 `*ngIf`/`*ngFor` 作為首選。元件模板僅綁定 Signals（不可直接訂閱 Observables）。
- **純響應（Zone-less / Signals）:** 所有跨模組狀態與異步操作應使用 `@ngrx/signals` 模式：`signalStore()`、`withState()`、`computed()`、`rxMethod()`；避免在 presentation 或 domain 層使用 RxJS 訂閱作為狀態來源。
- **嚴格 DDD 層級隔離:** Domain 層為純商業邏輯，禁止引入框架或基礎設施依賴。Application 層以介面（ports）依賴 Domain，Infrastructure 實作這些介面並僅在 infrastructure 目錄出現實作細節。
- **單一職責（SRP）:** 每個類/模組/檔案只負責一項職責；若描述需用到「AND」，請拆分成多個單一職責元件或服務。
- **高內聚、低耦合:** 模組間透過事件（EventBus / domain events）或抽象介面溝通，避免直接匯入或依賴外層 store 內部實作；鼓勵使用 injection token 與介面進行依賴反轉。
- **奧卡姆剃刀（簡潔優先）:** 優先選擇最簡單可行的設計；不引入未必要的抽象、層級或工具。若可用現有 pattern 解決，應重用而非新建複雜系統。

執行檢查與驗證：
- 所有重要架構變更需在 PR 描述中註明受影響的原則（從上列清單中對應項目）與對應的 `.github/instructions` 條目。
- 建議在 CI 增加自動檢查（例如檢測 domain 檔案是否 import 框架、模板是否使用控制流語法、store 是否使用 signals patterns），以自動化強制執行這些原則。

