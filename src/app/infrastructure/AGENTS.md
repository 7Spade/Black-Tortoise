# Infrastructure Layer Agent Directives — Summary

Context: `src/app/infrastructure` — Role: implement Application ports, map between Domain and external systems, and contain all framework-specific code.

Short rules:
- Implement Domain repository interfaces here; keep mappers (`toDomain`/`toDto`) pure and simple.
- Do not leak platform types (Firestore `Timestamp`) into Domain — convert to `Date`/ISO.
- All Firebase or external SDK imports live in this layer only.
- Catch infra errors and translate to typed Domain/Application errors for semantic handling.

Maintenance: Reference root AGENTS and `src/app/AGENTS_INDEX.md` for change-log and owner info.

