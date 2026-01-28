# Application Layer Agent Directives — Summary

Context: `src/app/application` — Role: orchestrate domain use cases, manage Signal stores, and expose facades for Presentation.

Short rules (refer to root AGENTS and `src/app/AGENTS_INDEX.md` for index):
- State lives in `signalStore()` only; use `withState`, `withComputed`, `withMethods`.
- Use `rxMethod()` for async streams; prefer `tapResponse` for error handling; avoid plain `.subscribe()`.
- Event Chain: Append to `eventStore` → Publish to `EventBus` → React in stores/effects.
- Facades produce read-only ViewModel Signals (map Domain → UI DTOs here; no domain logic in Presentation).
- Keep handlers simple: Command/Handler orchestrates domain and calls repository interfaces; side effects via stores/events.

Edit process: Update this file for application-level rules only; keep architecture policy in root `AGENTS.md` and operational index in `src/app/AGENTS_INDEX.md`.

