# Header Unification Architecture Diagram

## Before Fix (Selector Conflict)

```
┌─────────────────────────────────────────────────────────────┐
│                    GlobalShellComponent                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              HeaderComponent                        │    │
│  │                                                     │    │
│  │  Import: WorkspaceSwitcherContainerComponent       │    │
│  │  From: @presentation/shared/components/...         │    │
│  │                                                     │    │
│  │  Template: <app-workspace-switcher />              │    │
│  │            ^                                        │    │
│  │            |                                        │    │
│  │            ❌ SELECTOR CONFLICT!                   │    │
│  └────────────┼───────────────────────────────────────┘    │
│               |                                             │
└───────────────┼─────────────────────────────────────────────┘
                |
                v
        ┌───────┴────────┐
        │                │
┌───────▼────────┐  ┌────▼─────────────┐
│ Container      │  │ Component        │
│ (shared)       │  │ (features)       │
│                │  │                  │
│ selector:      │  │ selector:        │
│ app-workspace- │  │ app-workspace-   │
│ switcher       │  │ switcher         │
│                │  │                  │
│ ❌ CONFLICT!  │  │ ❌ CONFLICT!    │
└────────────────┘  └──────────────────┘

⚠️ Problem: Two components with same selector
⚠️ Result: Unpredictable rendering behavior
```

## After Fix (Unified Component)

```
┌─────────────────────────────────────────────────────────────────┐
│                    GlobalShellComponent                          │
│  Route: /demo or /workspace                                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              HeaderComponent                              │  │
│  │                                                           │  │
│  │  Import: WorkspaceSwitcherComponent                      │  │
│  │  From: @presentation/features/workspace                  │  │
│  │                                                           │  │
│  │  Template: <app-workspace-switcher />                    │  │
│  │            ^                                              │  │
│  │            |                                              │  │
│  │            ✅ Single Component                           │  │
│  └────────────┼─────────────────────────────────────────────┘  │
│               |                                                 │
└───────────────┼─────────────────────────────────────────────────┘
                |
                v
        ┌───────────────────┐
        │ WorkspaceSwitcher │
        │ Component         │
        │ (features)        │
        │                   │
        │ selector:         │
        │ app-workspace-    │
        │ switcher          │
        │                   │
        │ ✅ UNIQUE        │
        └─────────┬─────────┘
                  |
                  v
        ┌─────────────────────┐
        │  WorkspaceFacade     │
        │  (Application)       │
        │                      │
        │  Signals:            │
        │  - hasWorkspace()    │
        │  - currentWorkspace  │
        │    Name()            │
        │  - availableWork     │
        │    spaces()          │
        │  - showWorkspace     │
        │    Menu()            │
        │                      │
        │  Methods:            │
        │  - selectWorkspace() │
        │  - toggleWorkspace   │
        │    Menu()            │
        │  - createWorkspace() │
        └──────────────────────┘

✅ Solution: Single component with unique selector
✅ Result: Consistent rendering across all routes
```

## Component State Flow (After Fix)

```
┌──────────────────────────────────────────────────────────┐
│                   Route Navigation                        │
│                                                           │
│   /demo          or        /workspace                    │
└───────┬─────────────────────────┬────────────────────────┘
        │                         │
        v                         v
┌───────────────────────────────────────────────────────────┐
│              GlobalShellComponent                          │
│                                                            │
│  ShellFacade.showWorkspaceControls()                      │
│    ├─ /demo → false                                       │
│    └─ /workspace → true                                   │
└───────┬────────────────────────────────────────────────────┘
        │
        v
┌───────────────────────────────────────────────────────────┐
│              HeaderComponent                               │
│                                                            │
│  Input: showWorkspaceControls = true                      │
│                                                            │
│  @if (showWorkspaceControls()) {                          │
│    <app-workspace-switcher />                             │
│  }                                                         │
└───────┬───────────────────────────────────────────────────┘
        │
        v
┌───────────────────────────────────────────────────────────┐
│         WorkspaceSwitcherComponent                         │
│         (features/workspace)                               │
│                                                            │
│  Template Bindings:                                        │
│  ├─ facade.hasWorkspace()           → @if condition       │
│  ├─ facade.currentWorkspaceName()   → display             │
│  ├─ facade.showWorkspaceMenu()      → @if dropdown        │
│  ├─ facade.availableWorkspaces()    → @for list           │
│  └─ facade.isWorkspaceActive(id)    → [class.active]      │
│                                                            │
│  Event Handlers:                                           │
│  ├─ (click)="facade.toggleWorkspaceMenu()"                │
│  ├─ (click)="facade.selectWorkspace(id)"                  │
│  └─ (click)="openCreateDialog()"                          │
│                                                            │
│  ✅ Zero Hidden State                                     │
│  ✅ All State from Facade                                 │
│  ✅ Pure Reactive                                          │
└───────┬───────────────────────────────────────────────────┘
        │
        v
┌───────────────────────────────────────────────────────────┐
│              WorkspaceFacade                               │
│              (Application Layer)                           │
│                                                            │
│  State Source: WorkspaceContextStore                      │
│                                                            │
│  Computed Signals (Read-Only):                            │
│  ├─ hasWorkspace()                                        │
│  ├─ currentWorkspaceName()                                │
│  ├─ availableWorkspaces()                                 │
│  └─ showWorkspaceMenu()                                   │
│                                                            │
│  Methods (Write):                                          │
│  ├─ selectWorkspace(id)                                   │
│  ├─ toggleWorkspaceMenu()                                 │
│  └─ createWorkspace(result)                               │
└───────┬───────────────────────────────────────────────────┘
        │
        v
┌───────────────────────────────────────────────────────────┐
│         WorkspaceContextStore                              │
│         (Application Layer - Single Source of Truth)       │
│                                                            │
│  State:                                                    │
│  ├─ currentWorkspace: WritableSignal<Workspace>           │
│  ├─ workspaces: WritableSignal<Workspace[]>               │
│  └─ menuOpen: WritableSignal<boolean>                     │
│                                                            │
│  ✅ Single State Authority                                │
│  ✅ Signal-based State                                     │
│  ✅ Zone-less Architecture                                 │
└────────────────────────────────────────────────────────────┘
```

## DDD Layer Boundaries (After Fix)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                                                              │
│  features/workspace/components/                             │
│  └─ workspace-switcher.component.ts ✅                      │
│     ├─ selector: app-workspace-switcher                     │
│     ├─ imports: WorkspaceFacade                             │
│     └─ state: ZERO (all from facade)                        │
│                                                              │
│  shared/components/workspace-switcher/                      │
│  ├─ workspace-trigger.component.ts (optional)               │
│  ├─ workspace-menu.component.ts (optional)                  │
│  └─ workspace-switcher-container.component.ts ❌ DELETED    │
└──────────────────────┬───────────────────────────────────────┘
                       │ depends on
                       v
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                                                              │
│  workspace/                                                  │
│  ├─ WorkspaceFacade (facade)                                │
│  │  ├─ Exposes: Computed signals                            │
│  │  └─ Delegates: To WorkspaceContextStore                  │
│  │                                                           │
│  └─ WorkspaceContextStore (store)                           │
│     ├─ Holds: Writable signals (state)                      │
│     ├─ Exposes: Computed signals (read-only)                │
│     └─ Delegates: To Infrastructure                         │
└──────────────────────┬───────────────────────────────────────┘
                       │ depends on
                       v
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│                                                              │
│  workspace/                                                  │
│  └─ WorkspaceRepository                                     │
│     └─ Implements: Data access (@angular/fire)              │
└──────────────────────┬───────────────────────────────────────┘
                       │ depends on
                       v
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                             │
│                                                              │
│  workspace/                                                  │
│  ├─ Workspace (entity)                                      │
│  ├─ WorkspaceId (value object)                              │
│  └─ IWorkspaceRepository (interface)                        │
│                                                              │
│  ✅ Pure TypeScript                                         │
│  ✅ No Framework Imports                                     │
│  ✅ No Angular/RxJS                                          │
└─────────────────────────────────────────────────────────────┘
```

## Visibility Control Flow

```
┌────────────────────────────────────────────────┐
│           Router Navigation                     │
└───────┬────────────────────────────────────────┘
        │
        v
┌────────────────────────────────────────────────┐
│  ShellFacade.showWorkspaceControls()           │
│                                                │
│  computed(() => {                              │
│    const url = urlSignal();                    │
│    return !url.startsWith('/demo')             │
│           && _showWorkspaceControls();         │
│  })                                            │
└───────┬────────────────────────────────────────┘
        │
        ├─── Route: /demo
        │    └─> Result: false ❌
        │        └─> WorkspaceSwitcher HIDDEN
        │
        └─── Route: /workspace
             └─> Result: true ✅
                 └─> WorkspaceSwitcher VISIBLE
```

## Key Architectural Properties

### ✅ Single Responsibility
- **WorkspaceSwitcherComponent**: UI rendering only
- **WorkspaceFacade**: State coordination
- **WorkspaceContextStore**: State management
- **WorkspaceRepository**: Data access

### ✅ Dependency Inversion
```
Presentation → Application → Infrastructure → Domain
(high-level)                              (low-level)
```

### ✅ Zero Hidden State
```
Component State: ❌ None
Facade State:    ❌ None (delegates to store)
Store State:     ✅ Single Source of Truth
```

### ✅ Pure Reactive Flow
```
Store Signal → Facade Computed → Component Template Binding
(write)        (read-only)      (render)
```

---

**Legend:**
- ✅ = Correct / Implemented
- ❌ = Removed / Not Used
- ⚠️ = Warning / Issue
- → = Data/Control Flow
- ├─ = Has/Contains
- └─ = End of List
