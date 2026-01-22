# Presentation Layer Architecture Map

## Layer Hierarchy & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                           │
│                     (Pure UI - No Business Logic)                    │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
        ┌─────────────────────────┼─────────────────────────┐
        ↓                         ↓                         ↓
┌──────────────┐        ┌──────────────┐         ┌──────────────┐
│    SHELL     │        │   FEATURES   │         │    SHARED    │
│   (Layout)   │        │  (Business)  │         │  (Reusable)  │
└──────────────┘        └──────────────┘         └──────────────┘
        ↓                         ↓                         ↓
┌──────────────┐        ┌──────────────┐         ┌──────────────┐
│ Global Shell │        │   Header     │         │ Search       │
│ Main Layout  │        │   Settings   │         │ Notification │
└──────────────┘        │   Dashboard  │         │ Theme Toggle │
                        │   Profile    │         └──────────────┘
                        └──────────────┘
                                ↓
                        ┌──────────────┐
                        │   MODULES    │
                        │ (Workspace)  │
                        └──────────────┘
```

## Directory Structure (DDD Compliant)

```
src/app/presentation/
│
├── 📁 shell/                          # Global Application Shell
│   ├── global-shell.component.ts      # Top-level routing shell
│   ├── layout/                        # Layout Compositions
│   │   ├── main-layout.component.ts   # Reusable layout wrapper
│   │   └── index.ts
│   └── index.ts
│
├── 📁 features/                       # Feature Modules
│   │
│   ├── �� header/                     # Header Feature (Standard Structure)
│   │   ├── components/                # UI Components
│   │   │   ├── global-header/
│   │   │   └── workspace-header/
│   │   ├── dialogs/                   # Dialog Components
│   │   │   └── workspace-create-dialog/
│   │   ├── facade/                    # Feature Facade (Store Interaction)
│   │   │   └── header.facade.ts
│   │   ├── models/                    # UI Models
│   │   │   └── workspace-create-result.model.ts
│   │   └── index.ts                   # Public API
│   │
│   ├── 📁 settings/                   # Settings Feature (Restructured)
│   │   ├── components/                # UI Components
│   │   │   ├── settings-entry/        # Main entry component
│   │   │   └── settings-page/         # Settings page component
│   │   └── index.ts                   # Public API
│   │
│   ├── 📁 dashboard/                  # Dashboard Feature
│   │   ├── demo-dashboard.component.ts
│   │   └── index.ts
│   │
│   ├── 📁 profile/                    # Profile Feature
│   │   ├── profile.component.ts
│   │   └── index.ts
│   │
│   └── index.ts                       # Features Public API
│
├── 📁 shared/                         # Shared UI Components
│   ├── components/
│   │   ├── search/                    # Global search component
│   │   │   ├── search.component.ts
│   │   │   └── index.ts
│   │   ├── notification/              # Notification component
│   │   │   ├── notification.component.ts
│   │   │   └── index.ts
│   │   └── theme-toggle/              # Theme toggle component
│   │       ├── theme-toggle.component.ts
│   │       └── index.ts
│   └── index.ts                       # Shared Public API
│
├── 📁 modules/                        # Workspace Modules (Event-Driven)
│   ├── overview.module.ts
│   ├── documents.module.ts
│   ├── tasks.module.ts
│   ├── calendar.module.ts
│   ├── daily.module.ts
│   ├── quality-control.module.ts
│   ├── acceptance.module.ts
│   ├── issues.module.ts
│   ├── members.module.ts
│   ├── permissions.module.ts
│   ├── audit.module.ts
│   ├── settings.module.ts
│   └── shared/                        # Module Helpers
│       ├── base-module.ts
│       ├── module-event-helper.ts
│       └── index.ts
│
├── 📁 workspace-host/                 # Workspace Container
│   ├── workspace-host.component.ts    # Main workspace host
│   └── module-host-container.component.ts
│
├── app.component.ts                   # Root component
└── index.ts                           # Presentation Public API
```

## Feature Structure Pattern

Each feature MUST follow this standard structure:

```
feature-name/
├── components/           # UI Components (presentational)
│   └── component-name/
│       ├── component.ts
│       ├── component.html
│       └── component.spec.ts
├── dialogs/             # Dialog/Modal Components
│   └── dialog-name/
│       ├── dialog.ts
│       └── dialog.html
├── facade/              # Feature Facade (if needed)
│   └── feature.facade.ts
├── models/              # UI-specific Models (if needed)
│   └── model.ts
└── index.ts            # Public API Exports
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      User Interaction                         │
│                    (Click, Input, Event)                      │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                 PRESENTATION COMPONENT                        │
│              (Signals, Computed, Template)                    │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    FACADE (Optional)                          │
│           (Orchestrates Store/Use Case calls)                 │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                  APPLICATION STORE                            │
│         (signalStore + rxMethod + tapResponse)                │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│              INFRASTRUCTURE REPOSITORY                        │
│                  (Observable<T> only)                         │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      DOMAIN MODEL                             │
│              (Pure TS - No Framework deps)                    │
└──────────────────────────────────────────────────────────────┘
```

## Communication Patterns

### 1. Component → Store (Standard Flow)
```typescript
// Component injects Store
readonly store = inject(SomeFeatureStore);

// Triggers action
onClick() {
  this.store.someAction({ param: 'value' });
}

// Binds to signal
readonly data = this.store.someData; // Signal<T>
```

### 2. Cross-Feature Communication (EventBus)
```typescript
// Feature A emits event
eventBus.publish(new WorkspaceSwitched({ id: 'ws-1' }));

// Feature B subscribes (in Store rxMethod)
this.eventBus.on(WorkspaceSwitched).pipe(
  tapResponse(
    (event) => patchState(state, { workspaceId: event.id }),
    (error) => console.error(error)
  )
);
```

### 3. Parent → Child (Input Signals)
```typescript
// Parent
<app-child [data]="parentSignal()" />

// Child
readonly data = input.required<DataType>();
```

### 4. Child → Parent (Output Events)
```typescript
// Child
readonly onAction = output<string>();
emitAction() { this.onAction.emit('value'); }

// Parent
<app-child (onAction)="handleAction($event)" />
```

## Forbidden Patterns ❌

1. ❌ Direct Firebase injection in components
2. ❌ Domain service usage in presentation
3. ❌ Manual `.subscribe()` in components
4. ❌ Service-based state management
5. ❌ Store-to-Store direct injection
6. ❌ `async/await` for state updates
7. ❌ Legacy directives (`*ngIf`, `*ngFor`)

## Best Practices ✅

1. ✅ Use signals for all component state
2. ✅ Use computed() for derived state
3. ✅ Use rxMethod() for async operations
4. ✅ Use tapResponse() for error handling
5. ✅ Use patchState() for state updates
6. ✅ Use @if/@for for control flow
7. ✅ Use EventBus for cross-feature communication
8. ✅ Keep components pure and presentational
9. ✅ Inject facades/stores, not repositories
10. ✅ Export only public APIs via index.ts

---

**Architecture Version:** 2.0 (Post-Restructure)
**Compliance:** DDD + Angular 20+ Pure Reactive
**Last Updated:** 2025-01-22
