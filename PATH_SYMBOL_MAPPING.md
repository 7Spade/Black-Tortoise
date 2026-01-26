# Complete Path & Symbol Mapping

This document provides the complete mapping of old import paths to new barrel-based imports after the refactoring.

---

## Application Layer Mappings

### Workspace Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/workspace/adapters/workspace-event-bus.adapter` | `@application/workspace` | `WorkspaceEventBusAdapter` |
| `@application/workspace/facades/identity.facade` | `@application/workspace` | `IdentityFacade` |
| `@application/workspace/facades/workspace.facade` | `@application/workspace` | `WorkspaceFacade` |
| `@application/workspace/facades/workspace-host.facade` | `@application/workspace` | `WorkspaceHostFacade` |
| `@application/workspace/interfaces/workspace-runtime-factory.interface` | `@application/workspace` | `WorkspaceRuntimeFactory` |
| `@application/workspace/models/workspace-create-result.model` | `@application/workspace` | `WorkspaceCreateResult` |
| `@application/workspace/models/workspace-create-result.validator` | `@application/workspace` | `validateWorkspaceCreateResult` |
| `@application/workspace/stores/workspace-context.store` | `@application/workspace` | `WorkspaceContextStore`, `WorkspaceContextState` |
| `@application/workspace/tokens/workspace-runtime.token` | `@application/workspace` | `WORKSPACE_RUNTIME_FACTORY` |
| `@application/workspace/use-cases/create-workspace.use-case` | `@application/workspace` | `CreateWorkspaceUseCase` |
| `@application/workspace/use-cases/handle-domain-event.use-case` | `@application/workspace` | `HandleDomainEventUseCase` |
| `@application/workspace/use-cases/switch-workspace.use-case` | `@application/workspace` | `SwitchWorkspaceUseCase` |

### Events Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/events/module-events` | `@application/events` | Module event types |
| `@application/events/tokens/event-infrastructure.tokens` | `@application/events` | `EVENT_BUS`, `EVENT_STORE` |
| `@application/events/use-cases/publish-event.use-case` | `@application/events` | `PublishEventUseCase` |
| `@application/events/use-cases/query-events.use-case` | `@application/events` | `QueryEventsUseCase` |

### Root-Level Application

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/facades/header.facade` | `@application` or `@application/facades` | `HeaderFacade` |
| `@application/facades/module.facade` | `@application` or `@application/facades` | `ModuleFacade` |
| `@application/facades/notification.facade` | `@application` or `@application/facades` | `NotificationFacade` |
| `@application/facades/search.facade` | `@application` or `@application/facades` | `SearchFacade` |
| `@application/facades/shell.facade` | `@application` or `@application/facades` | `ShellFacade` |
| `@application/interfaces/module-event-bus.interface` | `@application` or `@application/interfaces` | `IModuleEventBus` |
| `@application/interfaces/module.interface` | `@application` or `@application/interfaces` | `IAppModule` |
| `@application/stores/presentation.store` | `@application` or `@application/stores` | `PresentationStore` |

### Feature Modules

#### Acceptance
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/acceptance/handlers/acceptance.event-handlers` | `@application/acceptance` | `registerAcceptanceEventHandlers` |
| `@application/acceptance/stores/acceptance.store` | `@application/acceptance` | `AcceptanceStore`, `AcceptanceState`, `AcceptanceTask` |
| `@application/acceptance/use-cases/approve-task.use-case` | `@application/acceptance` | `ApproveTaskUseCase` |
| `@application/acceptance/use-cases/reject-task.use-case` | `@application/acceptance` | `RejectTaskUseCase` |

#### Audit
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/audit/stores/audit.store` | `@application/audit` | `AuditStore` |

#### Daily
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/daily/handlers/daily.event-handlers` | `@application/daily` | Daily event handlers |
| `@application/daily/stores/daily.store` | `@application/daily` | `DailyStore` |
| `@application/daily/use-cases/create-daily-entry.use-case` | `@application/daily` | `CreateDailyEntryUseCase` |

#### Documents
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/documents/stores/documents.store` | `@application/documents` | `DocumentsStore` |

#### Issues
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/issues/handlers/issues.event-handlers` | `@application/issues` | Issues event handlers |
| `@application/issues/stores/issues.store` | `@application/issues` | `IssuesStore` |
| `@application/issues/use-cases/create-issue.use-case` | `@application/issues` | `CreateIssueUseCase` |
| `@application/issues/use-cases/resolve-issue.use-case` | `@application/issues` | `ResolveIssueUseCase` |

#### Members
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/members/stores/members.store` | `@application/members` | `MembersStore` |

#### Overview
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/overview/stores/overview.store` | `@application/overview` | `OverviewStore` |

#### Permissions
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/permissions/stores/permissions.store` | `@application/permissions` | `PermissionsStore` |

#### Quality Control
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/quality-control/handlers/quality-control.event-handlers` | `@application/quality-control` | QC event handlers |
| `@application/quality-control/stores/quality-control.store` | `@application/quality-control` | `QualityControlStore` |
| `@application/quality-control/use-cases/fail-qc.use-case` | `@application/quality-control` | `FailQCUseCase` |
| `@application/quality-control/use-cases/pass-qc.use-case` | `@application/quality-control` | `PassQCUseCase` |

#### Settings
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/settings/stores/settings.store` | `@application/settings` | `SettingsStore` |

#### Tasks
| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@application/tasks/handlers/tasks.event-handlers` | `@application/tasks` | `registerTasksEventHandlers` |
| `@application/tasks/stores/tasks.store` | `@application/tasks` | `TasksStore`, `TasksState` |
| `@application/tasks/use-cases/create-task.use-case` | `@application/tasks` | `CreateTaskUseCase` |
| `@application/tasks/use-cases/submit-task-for-qc.use-case` | `@application/tasks` | `SubmitTaskForQCUseCase` |

---

## Presentation Layer Mappings

### Layout Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@presentation/layout/header/header.component` | `@presentation/layout/header` | `HeaderComponent` |
| `@presentation/layout/widgets/identity-switcher/identity-switcher.component` | `@presentation/layout/widgets/identity-switcher` | `IdentitySwitcherComponent` |
| `@presentation/layout/widgets/notification/notification.component` | `@presentation/layout/widgets/notification` | `NotificationComponent` |
| `@presentation/layout/widgets/search/search.component` | `@presentation/layout/widgets/search` | `SearchComponent` |
| `@presentation/layout/widgets/theme-toggle/theme-toggle.component` | `@presentation/layout/widgets/theme-toggle` | `ThemeToggleComponent` |
| `@presentation/layout/widgets/user-avatar/user-avatar.component` | `@presentation/layout/widgets/user-avatar` | `UserAvatarComponent` |

### Organization Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@presentation/organization/components/organization-create-trigger/organization-create-trigger.component` | `@presentation/organization` | `OrganizationCreateTriggerComponent` |
| `@presentation/organization/components/dialogs/organization-create-dialog/organization-create-dialog.component` | `@presentation/organization` | `OrganizationCreateDialogComponent` |
| `@presentation/organization/team/components/team-create-trigger/team-create-trigger` | `@presentation/organization/team` | `TeamCreateTriggerComponent` |
| `@presentation/organization/team/components/team-placeholder.component` | `@presentation/organization/team` | `TeamPlaceholderComponent` |
| `@presentation/organization/team/dialogs/team-create-dialog/team-create-dialog` | `@presentation/organization/team` | `TeamCreateDialogComponent` |

### Pages Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@presentation/pages/dashboard/demo-dashboard.component` | `@presentation/pages/dashboard` | `DemoDashboardComponent` |
| `@presentation/pages/profile/profile.component` | `@presentation/pages/profile` | `ProfileComponent` |
| `@presentation/pages/settings/settings.component` | `@presentation/pages/settings` | `SettingsComponent` |
| `@presentation/pages/workspace/workspace.page` | `@presentation/pages/workspace` | `WorkspacePageComponent` |

### Shell Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@presentation/shell/context-switcher/context-switcher.component` | `@presentation/shell/context-switcher` | `ContextSwitcherComponent` |
| `@presentation/shell/global-shell.component` | `@presentation/shell` | `GlobalShellComponent` |

### Workspaces Module

| Old Import | New Import | Exported Symbols |
|-----------|-----------|------------------|
| `@presentation/workspaces/host/workspace-host.component` | `@presentation/workspaces/host` | `WorkspaceHostComponent` |
| `@presentation/workspaces/host/module-host-container.component` | `@presentation/workspaces/host` | `ModuleHostContainerComponent` |
| `@presentation/workspaces/host/components/module-content.component` | **INTERNAL** (not re-exported) | `ModuleContentComponent` |
| `@presentation/workspaces/host/components/module-navigation.component` | **INTERNAL** (not re-exported) | `ModuleNavigationComponent` |
| `@presentation/workspaces/switcher/workspace-switcher.component` | `@presentation/workspaces/switcher` | `WorkspaceSwitcherComponent` |
| `@presentation/workspaces/switcher/types` | `@presentation/workspaces/switcher` | `WorkspaceItem` |
| `@presentation/workspaces/dialogs/workspace-create-dialog.component` | `@presentation/workspaces/dialogs` | `WorkspaceCreateDialogComponent` |
| `@presentation/workspaces/create-trigger/workspace-create-trigger.component` | `@presentation/workspaces/create-trigger` | `WorkspaceCreateTriggerComponent` |
| `@presentation/workspaces/modules/overview.module` | `@presentation/workspaces/modules` | `OverviewModule` |
| `@presentation/workspaces/modules/documents.module` | `@presentation/workspaces/modules` | `DocumentsModule` |
| `@presentation/workspaces/modules/tasks.module` | `@presentation/workspaces/modules` | `TasksModule` |
| `@presentation/workspaces/modules/calendar.module` | `@presentation/workspaces/modules` | `CalendarModule` |
| `@presentation/workspaces/modules/daily.module` | `@presentation/workspaces/modules` | `DailyModule` |
| `@presentation/workspaces/modules/quality-control.module` | `@presentation/workspaces/modules` | `QualityControlModule` |
| `@presentation/workspaces/modules/acceptance.module` | `@presentation/workspaces/modules` | `AcceptanceModule` |
| `@presentation/workspaces/modules/issues.module` | `@presentation/workspaces/modules` | `IssuesModule` |
| `@presentation/workspaces/modules/members.module` | `@presentation/workspaces/modules` | `MembersModule` |
| `@presentation/workspaces/modules/permissions.module` | `@presentation/workspaces/modules` | `PermissionsModule` |
| `@presentation/workspaces/modules/audit.module` | `@presentation/workspaces/modules` | `AuditModule` |
| `@presentation/workspaces/modules/settings.module` | `@presentation/workspaces/modules` | `SettingsModule` |
| `@presentation/workspaces/modules/basic/base-module` | `@presentation/workspaces/modules/basic` | `BaseModule` |
| `@presentation/workspaces/modules/basic/module-event-helper` | `@presentation/workspaces/modules/basic` | `ModuleEventHelper` |

---

## Usage Examples

### Importing from Application Layer

```typescript
// ❌ OLD - Deep imports
import { WorkspaceFacade } from '@application/workspace/facades/workspace.facade';
import { WorkspaceContextStore } from '@application/workspace/stores/workspace-context.store';
import { AcceptanceStore } from '@application/acceptance/stores/acceptance.store';

// ✅ NEW - Barrel imports
import { WorkspaceFacade, WorkspaceContextStore } from '@application/workspace';
import { AcceptanceStore } from '@application/acceptance';

// ✅ ALSO VALID - Root barrel (re-exports everything)
import { WorkspaceFacade, AcceptanceStore } from '@application';
```

### Importing from Presentation Layer

```typescript
// ❌ OLD - Deep imports
import { WorkspaceSwitcherComponent } from '@presentation/workspaces/switcher/workspace-switcher.component';
import { OverviewModule } from '@presentation/workspaces/modules/overview.module';

// ✅ NEW - Feature barrels
import { WorkspaceSwitcherComponent } from '@presentation/workspaces/switcher';
import { OverviewModule } from '@presentation/workspaces/modules';

// ✅ ALSO VALID - Main feature barrel
import { WorkspaceSwitcherComponent, OverviewModule } from '@presentation/workspaces';
```

### Cross-Layer Imports

```typescript
// ✅ Presentation importing from Application
import { WorkspaceFacade } from '@application/workspace';
import { AcceptanceStore } from '@application/acceptance';

// ✅ Application importing from Domain
import { WorkspaceEntity } from '@domain/workspace';
import { TaskEntity } from '@domain/task/task.entity';

// ❌ FORBIDDEN - Presentation importing from Domain
// Presentation must go through Application layer as a facade
```

---

## Internal vs. Public API

### Public API (Re-exported in barrels)
- Components intended for external use
- Stores, facades, use cases
- Public types and interfaces
- Feature modules

### Internal API (NOT re-exported)
- `workspaces/host/components/*` → Internal navigation/content components
- Helper utilities specific to a module
- Private types and interfaces

**Example**:
```typescript
// ✅ PUBLIC - Available via barrel
import { WorkspaceHostComponent } from '@presentation/workspaces/host';

// ❌ INTERNAL - Must use direct import (discouraged)
import { ModuleNavigationComponent } from '@presentation/workspaces/host/components/module-navigation.component';
```

---

## Notes

1. **Backward Compatibility**: Old deep imports still work but are discouraged. Use barrels.
2. **Tree Shaking**: Barrel exports enable better tree-shaking in production builds.
3. **Encapsulation**: Internal components not re-exported enforce proper encapsulation.
4. **Root Barrels**: Both `@application` and `@presentation` re-export all sub-modules for convenience.

---

**Last Updated**: 2025-01-24
