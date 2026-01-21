---
description: 'Strict enforcement rules for project structure, naming conventions, and layer dependencies'
applyTo: '**'
---

# Project Structure Rules

## CRITICAL: Dependency Direction

**ALLOWED:** Presentation → Application → Domain ← Infrastructure; All layers → Shared
**FORBIDDEN:** Domain/Shared → any layer; Infrastructure → Application/Presentation; Application → Infrastructure (use DI)
**VIOLATION:** Build rejection, architecture corruption, security vulnerability

## Layer Directory Structure

**presentation/**: layouts, features, shared, core, theme
**application/**: store, commands, queries, services, mappers, validators, guards, interceptors, pipes, models
**domain/**: entities, value-objects, aggregates, events, commands, queries, repositories, services
**infrastructure/**: firebase, persistence, storage, auth, event-sourcing, caching, external-services, adapters, dto
**shared/**: components, directives, pipes, validators, services, utils, constants, types, interfaces

## Naming Conventions (ALL MANDATORY - File rejected on violation)

| Layer | Type | Pattern | Example |
|-------|------|---------|---------|
| **Domain** | Entity | `{name}.entity.ts` | `workspace.entity.ts` |
| | Value Object | `{name}.value-object.ts` | `workspace-id.value-object.ts` |
| | Aggregate | `{name}.aggregate.ts` | `workspace.aggregate.ts` |
| | Event | `{name}.event.ts` | `workspace-created.event.ts` |
| | Command | `{action}-{entity}.command.ts` | `create-workspace.command.ts` |
| **Application** | Store | `{feature}.store.ts` | `workspace.store.ts` |
| | Models | `{feature}.models.ts` | `workspace.models.ts` |
| | Handler | `{action}-{entity}.handler.ts` | `create-workspace.handler.ts` |
| | Mapper | `{source}-to-{target}.mapper.ts` | `workspace-to-dto.mapper.ts` |
| **Infrastructure** | Repository | `{entity}-firestore.repository.ts` | `workspace-firestore.repository.ts` |
| | Converter | `{entity}.firestore-converter.ts` | `workspace.firestore-converter.ts` |
| | DTO | `{entity}-firebase.dto.ts` | `workspace-firebase.dto.ts` |
| **Presentation** | Component | `{name}.component.ts` | `workspace-list.component.ts` |
| | Page | `{name}-page.component.ts` | `workspace-detail-page.component.ts` |

## Store Hierarchy (MANDATORY)

```
GlobalShell (Root) → WorkspaceList (Account) → Workspace (Context) → Feature Stores → Entity Stores
```

| Type | Pattern | Example |
|------|---------|---------|
| Global | `{feature}.store.ts` | `auth.store.ts` |
| Context | `{context}.store.ts` | `workspace.store.ts` |
| Feature | `{feature}s.store.ts` | `tasks.store.ts` |
| Entity | `{entity}-entity.store.ts` | `task-entity.store.ts` |

## Import Patterns (MANDATORY - Use path aliases ONLY)

**REQUIRED:** `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*`, `@shared/*`
**FORBIDDEN:** Relative paths across layers, direct infrastructure imports, domain importing outer layers

## Core Rules (15 CRITICAL)

1. **Layer Isolation**: Files in designated layer only; incorrect placement → build rejection
2. **Zero Framework Domain**: Domain MUST NOT import Angular/Firebase/HTTP → immediate refactoring
3. **Inward Dependencies**: Domain/Shared import NOTHING; reverse flow → architecture corruption
4. **DI for Infrastructure**: Application uses domain interfaces, never concrete implementations
5. **Path Aliases Only**: Cross-layer imports via `@layer/*`; relative paths → refactoring required
6. **Naming Enforcement**: File patterns per layer; deviations → file rejected
7. **Store Hierarchy**: GlobalShell → WorkspaceList → Workspace → Feature → Entity; flat → rejected
8. **Component Structure**: .ts, .html, .scss, .spec.ts, index.ts all REQUIRED; missing → build failure
9. **Test Colocation**: All files need .spec.ts in same directory; missing → deployment blocked
10. **TypeScript Strict**: `strict: true`, no `any`, `readonly` for immutable; violations → build rejection
11. **Standalone Components**: Angular standalone + Signals + OnPush; non-standalone → migration required
12. **NgRx Signals Only**: `signalStore`, `patchState`, `computed()`, `rxMethod`; direct mutation → state corruption
13. **Firebase via Repos**: Converters + query builders required; missing → data mapping failure
14. **Layer Content**: Domain = entities/VOs/events; Application = stores/handlers; Infrastructure = repos/adapters; Presentation = components/templates; Shared = utilities
15. **Test Naming**: `describe('FeatureName', () => { it('should X when Y', () => {}) })`; violations → suite rejected
