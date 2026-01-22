# Workspace Modules - Event-Driven Architecture

## Overview

This directory contains workspace module implementations following Domain-Driven Design (DDD) principles and event-driven architecture.

## Architecture Principles

### 1. Event Bus Communication Only

All modules communicate **exclusively** via `WorkspaceEventBus`:
- ✅ **DO**: Publish/Subscribe to events via event bus
- ❌ **DON'T**: Inject `WorkspaceContextStore` directly
- ❌ **DON'T**: Inject `WorkspaceRuntimeFactory` directly
- ❌ **DON'T**: Call use-cases directly from modules

### 2. Dependency Injection Pattern

Modules receive the event bus via **@Input()** from parent components:

```typescript
@Component({...})
export class MyModule implements Module {
  @Input() eventBus?: WorkspaceEventBus;
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
}
```

### 3. Event Flow

```
User Action → Module publishes event → WorkspaceEventBus 
  → handle-domain-event.use-case (central bridge)
  → Other modules subscribe and react
```

## Module List

All modules follow the same architecture pattern:

1. **overview** - Workspace overview dashboard
2. **documents** - Document and folder management
3. **tasks** - Task and todo management
4. **calendar** - Calendar and event scheduling
5. **daily** - Daily standup and activity log
6. **quality-control** - Quality assurance and control
7. **acceptance** - Acceptance criteria and testing
8. **issues** - Issue tracking and management
9. **members** - Team member management
10. **permissions** - Access control and permissions
11. **audit** - Audit log and activity trail
12. **settings** - Workspace settings

## Shared Utilities

### ModuleEventHelper

Provides common event subscription patterns:

```typescript
import { ModuleEventHelper } from './shared/module-event-helper';

// Subscribe to workspace switched
subscriptions.add(
  ModuleEventHelper.onWorkspaceSwitched(eventBus, (event) => {
    console.log('Workspace changed:', event);
  })
);

// Publish module initialized
ModuleEventHelper.publishModuleInitialized(eventBus, 'my-module');
```

### ModuleEventSubscriptions

Manages subscription lifecycle:

```typescript
const subscriptions = ModuleEventHelper.createSubscriptionManager();

// Add subscriptions
subscriptions.add(unsubscribeFn1);
subscriptions.add(unsubscribeFn2);

// Cleanup all
ngOnDestroy(): void {
  subscriptions.unsubscribeAll();
}
```

### BaseModule

Optional base class providing standard patterns:

```typescript
export class MyModule extends BaseModule {
  readonly id = 'my-module';
  readonly name = 'My Module';
  readonly type: ModuleType = 'my-module';
  
  protected setupEventSubscriptions(eventBus: WorkspaceEventBus): void {
    super.setupEventSubscriptions(eventBus);
    // Add custom subscriptions
  }
}
```

## Implementation Checklist

When creating a new module:

- [ ] Extend `Module` interface or `BaseModule` class
- [ ] Receive event bus via `@Input()` or constructor parameter
- [ ] Use `ModuleEventHelper` for subscriptions
- [ ] Implement lifecycle methods: `initialize()`, `activate()`, `deactivate()`, `destroy()`
- [ ] Manage subscriptions with `ModuleEventSubscriptions`
- [ ] Publish `ModuleInitialized` event on initialization
- [ ] Use Angular signals for zone-less state management
- [ ] Use `OnPush` change detection strategy
- [ ] Implement `OnDestroy` to cleanup subscriptions

## Verification

Check for violations:

```bash
# No store injections
grep -r "inject.*WorkspaceContextStore" *.module.ts

# No runtime factory injections  
grep -r "inject.*WorkspaceRuntimeFactory" *.module.ts

# All use @Input for event bus
grep "@Input() eventBus" *.module.ts
```

All checks should show proper event-driven patterns.

## Demo Modules (Moved)

The following demo modules have been moved to `presentation/features/`:
- **demo-dashboard** → `presentation/features/dashboard/demo-dashboard.component.ts`
  - Showcases clean DDD architecture
  - Uses WorkspaceContextStore via Application layer only
  - No domain/infrastructure imports
  - Angular 20 control flow, M3 tokens, zone-less

**Removed modules**:
- `demo-settings.module.ts` - Removed as it was not actively used

## Event Types

Modules use types from `domain/module/module-event.ts`:
- `ModuleInitialized` - Module initialization complete
- `ModuleDataChanged` - Module data update notification
- `ModuleError` - Module error event

Additional workspace events:
- `WorkspaceSwitched` - Active workspace changed
- `ModuleActivated` - Module navigation/activation
- `ModuleDeactivated` - Module deactivation

## Best Practices

1. **Keep modules lightweight** - Modules are presentation components
2. **Business logic in use-cases** - Not in modules
3. **State in signals** - For zone-less operation
4. **Events for coordination** - Not direct method calls
5. **Defensive checks** - Always check if eventBus is available
6. **Cleanup subscriptions** - Prevent memory leaks
7. **Minimal dependencies** - Only event bus and domain types

## Testing Strategy

Modules can be tested by:
1. Mocking `WorkspaceEventBus`
2. Verifying event publications
3. Testing event handler reactions
4. Checking subscription cleanup

No need to mock stores or use-cases since modules don't depend on them.
