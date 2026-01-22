# DDD + Clean Architecture Boundary Violations Report

## Executive Summary

This report identifies all violations of DDD/Clean Architecture layer boundaries in the Black-Tortoise Angular application and provides a remediation plan.

**Analysis Date:** 2025-01-22
**Architecture:** DDD + Clean Architecture + Angular 20+ Signals
**Layers:** Domain → Application → Infrastructure → Presentation

---

## Layer Dependency Rules

### ✅ Valid Dependencies

```
Domain ──────> [NO DEPENDENCIES - Pure TypeScript]
Application ──> Domain
Infrastructure> Domain
Presentation ─> Application (via Facades/Stores only)
```

### ❌ Invalid Dependencies (Violations)

```
Domain ──────X──> Application/Infrastructure/Presentation
Application ─X─> Infrastructure/Presentation
Presentation X─> Domain/Infrastructure (direct)
```

---

## Identified Violations

### 1. **APPLICATION → INFRASTRUCTURE** (1 violation)

**File:** `src/app/application/stores/workspace-context.store.ts`

**Line 17:**
```typescript
import { WorkspaceRuntimeFactory } from '@infrastructure/runtime/workspace-runtime.factory';
```

**Issue:** Application layer is directly injecting and using an Infrastructure concrete implementation.

**Impact:** Violates Dependency Inversion Principle. Application should depend on abstractions, not concrete implementations.

**Fix Required:** Move `WorkspaceRuntimeFactory` interface to Domain or Application layer, keep implementation in Infrastructure.

---

### 2. **PRESENTATION → INFRASTRUCTURE** (1 violation)

**File:** `src/app/presentation/containers/workspace-host/module-host-container.component.ts`

**Line 32:**
```typescript
import { WorkspaceRuntimeFactory } from '@infrastructure/runtime/workspace-runtime.factory';
```

**Issue:** Presentation layer is directly injecting Infrastructure service.

**Impact:** Violates Clean Architecture. Presentation should only interact via Facades/Stores.

**Fix Required:** Access runtime factory through Application layer facade/store instead.

---

### 3. **PRESENTATION → DOMAIN** (28 violations - Systematic Pattern)

All module files in `src/app/presentation/containers/workspace-modules/` are importing domain types:

**Affected Files:**
- `base-module.ts` (2 imports)
- `module-event-helper.ts` (2 imports)
- `overview.module.ts` (2 imports)
- `issues.module.ts` (2 imports)
- `daily.module.ts` (2 imports)
- `audit.module.ts` (2 imports)
- `calendar.module.ts` (2 imports)
- `quality-control.module.ts` (2 imports)
- `members.module.ts` (2 imports)
- `settings.module.ts` (2 imports)
- `documents.module.ts` (2 imports)
- `permissions.module.ts` (2 imports)
- `tasks.module.ts` (2 imports)
- `module-host-container.component.ts` (2 imports)

**Common Imports:**
```typescript
import { Module, ModuleType } from '@domain/module/module.interface';
import { WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';
```

**Issue:** Presentation components are importing domain interfaces and services directly.

**Impact:** Creates tight coupling between Presentation and Domain. Violates Clean Architecture principles.

**Fix Required:** 
1. Create Application layer DTOs/interfaces that mirror domain concepts
2. Create Application facades that expose event bus and module management
3. Update Presentation to only import from Application layer

---

## Violation Summary

| Layer Boundary | Violation Count | Severity |
|----------------|-----------------|----------|
| Application → Infrastructure | 1 | 🔴 High |
| Presentation → Infrastructure | 1 | 🔴 High |
| Presentation → Domain | 28 | 🟡 Medium |
| **TOTAL** | **30** | |

---

## Root Cause Analysis

### 1. Runtime Factory Pattern

The `WorkspaceRuntimeFactory` is used by both Application and Presentation layers to:
- Create workspace-scoped event buses
- Manage workspace runtime lifecycle
- Provide event bus instances to modules

**Current Flow:**
```
WorkspaceContextStore (Application) ──> WorkspaceRuntimeFactory (Infrastructure)
ModuleHostContainer (Presentation) ──> WorkspaceRuntimeFactory (Infrastructure)
```

**Problem:** Infrastructure implementation is being injected directly instead of through an abstraction.

### 2. Module Event Bus Pattern

Modules receive `WorkspaceEventBus` via `@Input()` binding:
- Event bus is a domain concept (defined in `@domain/workspace/workspace-event-bus`)
- Presentation modules implement domain `Module` interface
- This creates direct Presentation → Domain dependency

**Current Flow:**
```
BaseModule (Presentation) ──> Module interface (Domain)
BaseModule (Presentation) ──> WorkspaceEventBus (Domain)
```

**Problem:** Presentation is directly implementing domain interfaces and using domain types.

---

## Remediation Strategy

### Phase 1: Extract Abstractions (Interfaces)

1. **Create Application Layer Interfaces**
   - `src/app/application/interfaces/workspace-runtime.interface.ts`
   - `src/app/application/interfaces/module.interface.ts` (Application DTO)
   - `src/app/application/interfaces/event-bus.interface.ts` (Application abstraction)

2. **Move to Domain (if pure)**
   - Consider if `WorkspaceRuntimeFactory` interface should be in Domain
   - Domain should define contracts, Infrastructure implements them

### Phase 2: Introduce Application Facades

1. **Create ModuleFacade (Application)**
   - Exposes module management operations
   - Wraps event bus in application-layer abstraction
   - Provides methods for module initialization, activation, etc.

2. **Update WorkspaceContextStore**
   - Inject runtime factory interface instead of concrete class
   - Use dependency injection token for abstraction

### Phase 3: Update Presentation Layer

1. **Update BaseModule**
   - Receive Application-layer facade instead of domain event bus
   - Implement Application-layer module interface (DTO)

2. **Update ModuleHostContainer**
   - Use facade to get event bus wrapper
   - Remove direct infrastructure dependency

### Phase 4: Infrastructure Registration

1. **Update app.config.ts**
   - Register Infrastructure implementations with DI tokens
   - Ensure proper provider configuration

---

## Detailed Fix Plan

### Fix 1: Workspace Runtime Factory Abstraction

**Step 1:** Create interface in Application layer

```typescript
// src/app/application/interfaces/workspace-runtime-factory.interface.ts
export interface IWorkspaceRuntimeFactory {
  createRuntime(workspace: WorkspaceEntity): WorkspaceRuntime;
  getRuntime(workspaceId: string): WorkspaceRuntime | null;
  destroyRuntime(workspaceId: string): void;
  destroyAll(): void;
}
```

**Step 2:** Create DI token

```typescript
// src/app/application/tokens/workspace-runtime.token.ts
export const WORKSPACE_RUNTIME_FACTORY = new InjectionToken<IWorkspaceRuntimeFactory>(
  'WORKSPACE_RUNTIME_FACTORY'
);
```

**Step 3:** Update Infrastructure to implement interface

```typescript
// src/app/infrastructure/runtime/workspace-runtime.factory.ts
@Injectable()
export class WorkspaceRuntimeFactory implements IWorkspaceRuntimeFactory {
  // existing implementation
}
```

**Step 4:** Register in app.config.ts

```typescript
providers: [
  {
    provide: WORKSPACE_RUNTIME_FACTORY,
    useClass: WorkspaceRuntimeFactory
  }
]
```

**Step 5:** Update Application layer usage

```typescript
// src/app/application/stores/workspace-context.store.ts
const runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
```

---

### Fix 2: Module Event Bus Abstraction

**Option A: Create Application Wrapper (Recommended)**

```typescript
// src/app/application/interfaces/module-event-bus.interface.ts
export interface IModuleEventBus {
  publish(event: any): void;
  subscribe(eventType: string, handler: (event: any) => void): Subscription;
  // ... other methods
}

// src/app/application/adapters/workspace-event-bus.adapter.ts
export class WorkspaceEventBusAdapter implements IModuleEventBus {
  constructor(private readonly domainEventBus: WorkspaceEventBus) {}
  
  publish(event: any): void {
    this.domainEventBus.publish(event);
  }
  
  subscribe(eventType: string, handler: (event: any) => void): Subscription {
    return this.domainEventBus.subscribe(eventType, handler);
  }
}
```

**Option B: Move Event Bus to Shared (If Truly Generic)**

If `WorkspaceEventBus` is a generic event bus without business logic:
- Move to `@shared/` or Application layer
- Keep domain events in Domain layer
- Event bus becomes infrastructure concern

---

### Fix 3: Module Interface Application DTO

```typescript
// src/app/application/interfaces/module.interface.ts
export interface AppModule {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  initialize(eventBus: IModuleEventBus): void;
  activate(): void;
  deactivate(): void;
  destroy(): void;
}
```

**Presentation modules implement AppModule, not Domain Module**

---

## Implementation Order

1. ✅ **Create abstraction interfaces in Application layer**
2. ✅ **Create DI tokens for infrastructure services**
3. ✅ **Update Infrastructure implementations to implement interfaces**
4. ✅ **Register providers in app.config.ts**
5. ✅ **Update Application layer to use abstractions**
6. ✅ **Create Application facades/adapters for Presentation**
7. ✅ **Update Presentation to use Application facades only**
8. ✅ **Update barrel exports (index.ts files)**
9. ✅ **Verify no remaining violations**
10. ✅ **Update documentation**

---

## Success Criteria

- ✅ Zero imports from Infrastructure in Application layer
- ✅ Zero imports from Infrastructure in Presentation layer  
- ✅ Zero imports from Domain in Presentation layer
- ✅ All dependencies flow inward (Presentation → Application → Domain)
- ✅ Infrastructure provides implementations via DI tokens
- ✅ Business behavior unchanged
- ✅ All existing functionality works

---

## References

- **Clean Architecture:** Robert C. Martin
- **DDD:** Eric Evans
- **Dependency Inversion Principle:** SOLID principles
- **Angular Dependency Injection:** Angular documentation
- **NgRx Signals:** @ngrx/signals documentation

---

**Next Steps:** Begin implementation following the detailed fix plan above.
