# Presentation Layer Agent Directives — Summary

Context: `src/app/presentation` — Role: passive view layer, consume Signals from Application facades/stores; no direct infra/domain manipulation.

Short rules:
- Templates bind only to Signals; convert Observables with `toSignal()` in components or facades; `AsyncPipe` is not used.
- Use Angular 20 control-flow: `@if`, `@for (track ...)`, `@switch`, `@defer`.
- Keep components single-responsibility: smart components inject facades/stores; dumb components accept `input()` and emit events.
- Prefer CSS (Tailwind / M3 tokens) for layout and theming; avoid TS for styling logic.

Edit guidance: Keep Presentation rules focused; link to root AGENTS and `src/app/AGENTS_INDEX.md` for owner and update notes.

