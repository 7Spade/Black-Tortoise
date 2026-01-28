# Domain Layer Agent Directives — Summary

Context: `src/app/domain` — Role: pure business logic, immutable value objects, aggregates, and domain events. **No framework imports.**

Short rules:
- Domain must be framework-agnostic. No Angular, Firestore, or Presentation imports.
- Entities are rich (methods + invariants). Use Value Objects for validated primitives.
- Factories: `create()` for new, `reconstruct()` for hydration.
- Repositories are interfaces (define WHAT); prefer `Promise<T>` for operations; only use `Observable<T>` for necessary continuous streams.

Edit guidance: Keep domain examples minimal; reference root AGENTS for architecture and `src/app/AGENTS_INDEX.md` for update policy.

