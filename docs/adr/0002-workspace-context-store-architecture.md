# ADR 0002: WorkspaceContextStore Architecture - Direct Domain Service Exposure

**Status**: Accepted with Recommendations  
**Date**: 2024-01-22  
**Context**: PR #13 Review - P0-01 WorkspaceContextStore Analysis

## Context

During PR #13 review, the WorkspaceContextStore was analyzed for compliance with @ngrx/signals best practices and DDD principles. The store currently directly injects and exposes domain services (CreateWorkspaceUseCase, SwitchWorkspaceUseCase, WorkspaceRuntimeFactory) in its methods.

## Current Implementation Analysis

### Strengths ✅

1. **Correct Signal Usage**: Store uses `signalStore()`, `withState()`, `withComputed()`, `withMethods()`
2. **Proper State Updates**: All state updates use `patchState()` - never direct mutation
3. **Computed Signals**: Derived state correctly uses `computed()`
4. **No rxMethod Issues**: Store doesn't use async operations that would require `rxMethod()`
5. **Zone-less Compatible**: Fully compatible with Angular 20's zone-less architecture
6. **Type Safety**: Strong typing throughout with readonly interfaces

### Architectural Concerns ⚠️

1. **Direct Domain Service Injection**: Store directly injects use cases and infrastructure services
   ```typescript
   withMethods((store) => {
     const createWorkspaceUseCase = inject(CreateWorkspaceUseCase);
     const switchWorkspaceUseCase = inject(SwitchWorkspaceUseCase);
     const runtimeFactory = inject(WorkspaceRuntimeFactory);
   ```

2. **Mixed Responsibilities**: Store acts as both state container and use case orchestrator

## Problem Statement

Should application-layer stores directly inject and orchestrate domain use cases, or should this coordination happen through an intermediate facade/command layer?

## Options Considered

### Option 1: Keep Current Implementation (Selected for Now)

**Pros**:
- Simple and direct - no additional abstraction
- Use cases are already in application layer (not domain layer)
- Store serves as natural orchestration point
- Works well for small-to-medium applications
- Easy to understand and maintain
- Follows @ngrx/signals patterns correctly

**Cons**:
- Store has dual responsibility (state + orchestration)
- Harder to test in isolation
- Difficult to reuse orchestration logic outside the store
- Violates Single Responsibility Principle at a fine-grained level

### Option 2: Introduce Command/Facade Layer

**Pros**:
- Clear separation: Commands orchestrate, Store manages state
- Easier unit testing (commands and store separately)
- Reusable orchestration logic
- Aligns with CQRS patterns
- Store becomes pure state container

**Cons**:
- Additional boilerplate (Command classes, Facade services)
- More files to maintain
- Increased complexity for simple operations
- Potential over-engineering for current app size

### Option 3: Hybrid - Keep Simple Methods, Extract Complex Orchestration

**Pros**:
- Pragmatic balance
- Simple operations stay in store
- Complex workflows moved to commands
- Gradual migration path

**Cons**:
- Inconsistent patterns
- Subjective decision on "complex"
- Can lead to unclear boundaries

## Decision

**We accept Option 1 for the current implementation**, with a strong recommendation to migrate to Option 2 as the application grows.

### Rationale

1. **Application Layer Ownership**: Use cases are in the application layer, not domain. The store coordinating application-layer services is acceptable.

2. **Current Scale**: For the current application size, direct injection is pragmatic and maintainable.

3. **Correctness**: The store correctly uses `patchState()`, signals, and computed values. No reactive violations exist.

4. **Testing**: While not ideal, mocking injected use cases in store tests is feasible.

5. **No Blocker**: This is not a P0 (blocker) issue - the code works correctly and follows @ngrx/signals patterns.

### Recommendation for Future Refactoring

As the application grows, consider migrating to a Command/Facade pattern:

```typescript
// Application layer - Commands
export class CreateWorkspaceCommand {
  private readonly useCase = inject(CreateWorkspaceUseCase);
  private readonly runtimeFactory = inject(WorkspaceRuntimeFactory);
  
  execute(params: CreateWorkspaceParams): WorkspaceEntity {
    const workspace = this.useCase.execute(params);
    this.runtimeFactory.createRuntime(workspace);
    return workspace;
  }
}

// Store - Pure state management
export const WorkspaceContextStore = signalStore(
  withState(initialState),
  withComputed(...),
  withMethods((store) => {
    const createWorkspaceCommand = inject(CreateWorkspaceCommand);
    
    return {
      createWorkspace(name: string): void {
        const workspace = createWorkspaceCommand.execute({...});
        patchState(store, {
          availableWorkspaces: [...store.availableWorkspaces(), workspace]
        });
      }
    };
  })
);
```

### Migration Triggers

Migrate to Command/Facade pattern when:

- Store methods exceed 10-15 lines
- Complex multi-step orchestration emerges
- Need to reuse orchestration logic outside store
- Testing becomes difficult due to deep mocking
- Team grows beyond 3-4 developers

## Current Assessment: No Modifications Required

**Decision**: Do not modify WorkspaceContextStore at this time.

**Justification**:
- ✅ Store uses signals correctly
- ✅ State updates use `patchState()` exclusively
- ✅ Computed signals used for derived state
- ✅ No rxMethod issues (no async state updates)
- ✅ Zone-less compatible
- ⚠️ Direct use case injection is acceptable for current scale
- 📋 Document recommendation for future refactoring

## Consequences

### Positive

- Current implementation remains simple and maintainable
- No refactoring required for PR #13
- Clear guidelines for future growth
- Store continues to work correctly with zone-less architecture

### Negative

- Store retains dual responsibility (state + orchestration)
- Testing requires mocking use cases
- May need refactoring as complexity grows

### Mitigation

- Document command pattern recommendation in code comments
- Monitor store method complexity
- Set up complexity metrics (lines per method)
- Plan command layer migration when thresholds are crossed

## References

- [@ngrx/signals Documentation](https://ngrx.io/guide/signals)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [DDD Application Layer](https://domainlanguage.com/ddd/reference/)
- PR #13 Review - P0-01 Analysis
- `src/app/application/stores/workspace-context.store.ts`
