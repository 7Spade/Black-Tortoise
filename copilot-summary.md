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
