# ADR 0001: Router Usage in Presentation Components

**Status**: Accepted  
**Date**: 2024-01-22  
**Context**: PR #13 Review - Navigation Logic in GlobalHeaderComponent

## Context

The GlobalHeaderComponent currently uses Angular Router directly for navigation after workspace selection/creation. This raises the question: should navigation logic reside in presentation components, or should it be abstracted into the application layer following stricter DDD principles?

## Problem Statement

In DDD architecture, presentation components should ideally contain only view logic. However, Angular's Router is a framework-level concern that doesn't fit neatly into domain or application layers. We need to decide whether:

1. Router usage is acceptable in presentation components as a framework-level UI concern
2. Navigation should be abstracted through commands or application services
3. A hybrid approach is warranted

## Options Considered

### Option 1: Keep Router in Presentation Components (Selected)

**Pros**:
- Router is a presentation-layer framework concern (Angular-specific)
- Simplifies component logic - no additional abstraction layers needed
- Aligns with Angular's component-based architecture
- Router state is inherently UI state (URL, navigation)
- Easier testing with Router mocks
- Standard Angular practice - widely understood

**Cons**:
- Couples presentation to Angular Router API
- Makes components slightly harder to test (requires Router mocking)
- Navigation logic spread across multiple components

### Option 2: Abstract Router via Application Layer Commands

**Pros**:
- Cleaner separation of concerns
- Presentation components don't depend on Router directly
- Centralized navigation logic
- Easier to change routing implementation

**Cons**:
- Over-abstraction for simple navigation scenarios
- Additional boilerplate (NavigationCommand, NavigationService)
- Router is inherently a UI concern, not business logic
- Adds complexity without clear benefit for simple apps
- Still requires Router somewhere in the stack

### Option 3: Hybrid - Application Layer Facade

**Pros**:
- Balances abstraction and pragmatism
- Can add business rules before navigation
- Centralized navigation decisions

**Cons**:
- Still requires Router in the facade
- Additional layer with marginal benefit
- More complex for simple use cases

## Decision

**We accept Option 1**: Router usage is permitted in presentation components.

### Rationale

1. **Framework-Level Concern**: Angular Router is a presentation framework service, not domain logic. It manages URL state and view transitions, which are inherently presentation concerns.

2. **Pragmatic DDD**: DDD's layering primarily aims to isolate business logic from technical concerns. Navigation is a technical UI concern, not business logic.

3. **Testing**: With proper mocking (jasmine.createSpyObj), Router can be easily tested in component specs without complicating the architecture.

4. **Zone-less Compatibility**: Router works seamlessly with Angular 20's zone-less architecture and doesn't violate reactive patterns.

5. **No Domain Coupling**: Using Router doesn't introduce dependencies on domain or infrastructure layers - it's a pure presentation-to-framework dependency.

### Guidelines

When using Router in presentation components:

- ✅ **DO**: Mock Router in unit tests using `jasmine.createSpyObj`
- ✅ **DO**: Handle navigation errors gracefully
- ✅ **DO**: Use Router for UI navigation only (not business logic)
- ✅ **DO**: Keep navigation paths as constants if used in multiple places
- ❌ **DON'T**: Put business logic in navigation handlers
- ❌ **DON'T**: Navigate based on domain events without Store mediation

### Example (GlobalHeaderComponent)

```typescript
export class GlobalHeaderComponent {
  private readonly router = inject(Router);
  readonly workspaceContext = inject(WorkspaceContextStore);
  
  selectWorkspace(workspaceId: string): void {
    // Business logic delegated to Store
    this.workspaceContext.switchWorkspace(workspaceId);
    
    // Navigation is presentation concern
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }
}
```

## Consequences

### Positive

- Simpler architecture without unnecessary abstraction
- Standard Angular patterns - easier onboarding
- Clear separation: business logic in Store, navigation in Component
- Router mocking is standard practice in Angular testing

### Negative

- Components depend on Router API (acceptable framework dependency)
- Navigation logic distributed across components (can be mitigated with shared constants)

### Mitigation

- **For complex navigation logic**: Consider creating a NavigationService in the application layer
- **For route reuse**: Define route constants in a shared location
- **For testing**: Always mock Router in component specs

## Review Trigger

This decision should be reviewed if:

- Navigation logic becomes complex (multi-step, conditional routing with business rules)
- We need to support multiple routing strategies (e.g., hash vs. path-based)
- Router becomes a performance bottleneck
- We migrate away from Angular to another framework

## References

- [Angular Router Documentation](https://angular.dev/guide/routing)
- [DDD Layered Architecture](https://domainlanguage.com/ddd/reference/)
- PR #13 Review Comments
- Integrated System Specification §6.2 (Header Navigation)
