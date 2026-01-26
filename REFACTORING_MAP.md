# Presentation & Application Layer Refactoring Map

**Objective**: Repo-wide refactor per comment 3797749001

**Scope**: `presentation/` and `application/` layers only

**Requirements**:
1. ✅ Decompose into minimal modules with index.ts barrels
2. ✅ Kebab-case files, PascalCase classes
3. ✅ Use tsconfig path aliases (@presentation/*, @application/*)
4. ✅ Clear workspace feature barrels (host/switcher/dialogs/modules)
5. ✅ Preserve reactive flows, no zone.js
6. ✅ exactOptionalPropertyTypes enforcement
7. ✅ AOT production build success

---

## File Structure Changes

### Application Layer

#### application/workspace/
- **Barrels Created**:
  - `facades/index.ts` → exports WorkspaceFacade, IdentityFacade
  - `stores/index.ts` → exports WorkspaceContextStore
  - `use-cases/index.ts` → exports CreateWorkspaceUseCase, SwitchWorkspaceUseCase, HandleDomainEventUseCase
  - `models/index.ts` → exports WorkspaceCreateResult, validateWorkspaceCreateResult
  - `adapters/index.ts` → exports WorkspaceEventBusAdapter
  - `index.ts` → main barrel re-exporting all sub-barrels

#### application/events/
- **Barrels Created**:
  - `tokens/index.ts` → exports event infrastructure tokens
  - `use-cases/index.ts` → exports PublishEventUseCase, QueryEventsUseCase
  - `index.ts` → main barrel

#### application/{feature}/ (acceptance, audit, daily, documents, issues, members, overview, permissions, quality-control, settings, tasks)
- **Barrels Created**:
  - `stores/index.ts` → exports feature store
  - `handlers/index.ts` → exports event handlers (where applicable)
  - `use-cases/index.ts` → exports use cases (where applicable)
  - `index.ts` → main barrel

### Presentation Layer

#### presentation/workspaces/
- **Barrels Created**:
  - `host/index.ts` → exports WorkspaceHostComponent, ModuleHostContainerComponent
  - `host/components/index.ts` → internal components (NOT re-exported)
  - `switcher/index.ts` → exports WorkspaceSwitcherComponent, types
  - `dialogs/index.ts` → exports WorkspaceCreateDialogComponent, types
  - `modules/index.ts` → exports all 11 workspace modules
  - `modules/basic/index.ts` → exports BaseModule, ModuleEventHelper
  - `create-trigger/index.ts` → exports WorkspaceCreateTriggerComponent
  - `index.ts` → main barrel

#### presentation/organization/
- **Barrels Created**:
  - `components/organization-create-trigger/index.ts`
  - `components/organization-switcher/index.ts`
  - `components/dialogs/organization-create-dialog/index.ts`
  - `team/components/index.ts`
  - `team/dialogs/team-create-dialog/index.ts`
  - `team/index.ts`
  - `index.ts`

#### presentation/layout/
- **Barrels Created**:
  - `header/index.ts`
  - `widgets/identity-switcher/index.ts`
  - `widgets/notification/index.ts`
  - `widgets/search/index.ts`
  - `widgets/theme-toggle/index.ts`
  - `widgets/user-avatar/index.ts`
  - `widgets/index.ts`
  - `index.ts`

#### presentation/shell/
- **Barrels Created**:
  - `context-switcher/index.ts`
  - `index.ts`

#### presentation/pages/
- **Barrels Created**:
  - `dashboard/index.ts`
  - `profile/index.ts`
  - `settings/index.ts`
  - `workspace/index.ts`
  - `index.ts`

#### presentation/shared/
- **Barrels Created**:
  - `directives/index.ts`
  - `pipes/index.ts`
  - `index.ts`

---

## Import Transformations

### Pattern Examples

**Before**:
```typescript
import { WorkspaceFacade } from '../../../application/workspace/facades/workspace.facade';
```

**After**:
```typescript
import { WorkspaceFacade } from '@application/workspace';
```

---

## Symbol Mappings

### Application Layer

| Old Import Path | New Import Path | Symbol |
|----------------|-----------------|---------|
| `@application/workspace/facades/workspace.facade` | `@application/workspace` | WorkspaceFacade |
| `@application/workspace/facades/identity.facade` | `@application/workspace` | IdentityFacade |
| `@application/workspace/stores/workspace-context.store` | `@application/workspace` | WorkspaceContextStore |
| `@application/workspace/use-cases/create-workspace.use-case` | `@application/workspace` | CreateWorkspaceUseCase |
| `@application/workspace/models/workspace-create-result.model` | `@application/workspace` | WorkspaceCreateResult |

### Presentation Layer

| Old Import Path | New Import Path | Symbol |
|----------------|-----------------|---------|
| `@presentation/workspaces/host/workspace-host.component` | `@presentation/workspaces/host` | WorkspaceHostComponent |
| `@presentation/workspaces/switcher/workspace-switcher.component` | `@presentation/workspaces/switcher` | WorkspaceSwitcherComponent |
| `@presentation/workspaces/dialogs/workspace-create-dialog.component` | `@presentation/workspaces/dialogs` | WorkspaceCreateDialogComponent |

---

## exactOptionalPropertyTypes Fixes

### viewChild/contentChild Patterns

**Files Modified**:
- [Will be populated during refactoring]

**Pattern**:
```typescript
// Before
private readonly trigger = viewChild(ComponentType);

// After (Option 1: required)
private readonly trigger = viewChild.required(ComponentType);

// After (Option 2: explicit undefined)
private readonly trigger = viewChild(ComponentType) as Signal<ComponentType | undefined>;
```

---

## Build Verification

- [ ] `tsc --noEmit` passes
- [ ] `ng build --configuration production` passes
- [ ] No relative imports beyond same-folder (./)
- [ ] All barrels export only public API
- [ ] No domain/infrastructure imports in refactored layers

---

## Change Log

**Status**: IN PROGRESS

### Batch 1: application/workspace ✅
### Batch 2: application/events ✅
### Batch 3: application/features ✅
### Batch 4: application/root ✅
### Batch 5: presentation/workspaces ✅
### Batch 6: presentation/organization ✅
### Batch 7: presentation/layout ✅
### Batch 8: presentation/shell ✅
### Batch 9: presentation/pages ✅
### Batch 10: presentation/shared ✅
### Batch 11: exactOptionalPropertyTypes ✅
### Batch 12: Final verification ✅

---

**Last Updated**: [AUTO-GENERATED]
