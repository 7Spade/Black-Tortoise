# ADR 0003: Module Migration Strategy - From Event-Driven to Direct Store Access

**Status**: Proposed  
**Date**: 2024-01-22  
**Context**: PR #13 Review - P2 Module Migration Planning

## Context

The Black Tortoise application currently has two architectural patterns for workspace modules:

1. **Event-Driven Modules** (11 production modules): Use `@Input() eventBus` for communication, completely decoupled from stores
2. **Direct Store Access** (demo components): Inject `WorkspaceContextStore` directly from application layer

The demo-dashboard was recently migrated from an event-driven module to a direct store access pattern as a standalone feature component. This raises the question of whether all modules should follow this simpler pattern.

## Current Architecture

### Event-Driven Modules (Current Production Pattern)

**Location**: `src/app/presentation/modules/*.module.ts`

**Pattern**:
```typescript
export class OverviewModule implements Module {
  @Input() eventBus?: WorkspaceEventBus;
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  private initialize(bus: WorkspaceEventBus): void {
    ModuleEventHelper.onWorkspaceSwitched(bus, (event) => {
      // React to events
    });
  }
}
```

**Flow**: User Action → Module publishes event → EventBus → handle-domain-event.use-case → Other modules react

### Direct Store Access (Demo Pattern)

**Location**: `src/app/presentation/features/dashboard/demo-dashboard.component.ts`

**Pattern**:
```typescript
export class DemoDashboardComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  
  // Direct signal access
  modules = this.workspaceContext.currentWorkspaceModules();
}
```

**Flow**: Component → Store methods → Use cases → Domain

## Problem Statement

Should we maintain dual patterns, migrate all modules to direct store access, or evolve a third hybrid approach?

## Options Considered

### Option 1: Maintain Dual Patterns (Status Quo)

**Use event-driven for workspace modules, direct access for feature components**

**Pros**:
- Event-driven provides strong decoupling for complex inter-module communication
- Demo features are simpler and don't need event coordination
- Clear separation between "workspace modules" and "feature components"
- No migration cost

**Cons**:
- Inconsistent architecture patterns
- Developers must learn both approaches
- Harder to explain architectural decisions
- Code duplication in documentation

### Option 2: Migrate All Modules to Direct Store Access (Simplification)

**Deprecate event bus, use store injection everywhere**

**Pros**:
- Single, consistent pattern across the application
- Simpler mental model
- Easier onboarding for new developers
- Less boilerplate (no event bus passing)
- Signals provide reactive updates naturally
- Direct access is more Angular-idiomatic

**Cons**:
- Loses event-driven architecture benefits
- Harder to coordinate complex inter-module interactions
- Tight coupling between modules and specific store
- Difficult to swap stores or add multiple contexts
- Breaking change for existing modules

### Option 3: Hybrid - EventBus for Coordination, Store for Read (Recommended)

**Modules inject store for read-only access, use events for writes/coordination**

**Pros**:
- Best of both worlds
- Store signals for reactive UI updates
- Events for cross-module coordination and commands
- Gradual migration path
- Maintains loose coupling

**Cons**:
- Most complex conceptually
- Two communication channels to understand
- Risk of inconsistent usage

### Option 4: CQRS-Inspired - Commands + Query Store

**Commands for writes (via event bus), direct store queries for reads**

**Pros**:
- Clear read/write separation
- Store optimized for queries (signals, computed)
- Commands for coordinated writes
- Aligns with CQRS principles

**Cons**:
- Requires significant refactoring
- Most complex option
- May be over-engineering for current scale

## Decision

**PROPOSED: Option 3 - Hybrid Approach** (Not yet implemented)

### Migration Strategy

**Phase 1: Documentation (Immediate - PR #13)**
- ✅ Create this ADR documenting the analysis
- ✅ Update `presentation/modules/README.md` with ADR link
- ✅ Document both patterns clearly
- ✅ Provide guidance on when to use each pattern

**Phase 2: Gradual Migration (Future)**
1. Allow modules to inject `WorkspaceContextStore` for **read-only** signal access
2. Keep event bus for **write operations** and **inter-module coordination**
3. Update ModuleEventHelper to support hybrid pattern
4. Migrate modules one-by-one (low priority)

**Phase 3: Consolidation (Future)**
1. Evaluate if pure event-driven is still needed
2. Consider deprecating event bus if store access proves sufficient
3. Standardize on single pattern based on lessons learned

### Decision Criteria for Pattern Selection

**Use Direct Store Access When**:
- Module is read-only (no cross-module coordination)
- Simple dashboard/overview components
- Need reactive signal updates
- Module is standalone feature (not workspace module)

**Use Event-Driven Pattern When**:
- Complex cross-module coordination required
- Module publishes data changes affecting others
- Need loose coupling for plugin-like architecture
- Module should work with different store implementations

## Consequences

### Immediate (PR #13)

- ✅ Document both patterns in README
- ✅ Link to this ADR for architectural rationale
- ✅ No code changes required (analysis only)
- ✅ Provide clear examples of each pattern

### Short-term (Next 1-2 Sprints)

- Update module base class to support hybrid pattern
- Create example hybrid module
- Add testing patterns for both approaches

### Long-term (3-6 Months)

- Evaluate which pattern is used more frequently
- Consider deprecating less-used pattern
- Migrate existing modules to chosen pattern
- Update training materials

## Open Questions

1. **Performance**: Does event bus add measurable overhead vs. direct signals?
2. **Testing**: Which pattern is easier to test in practice?
3. **Team Preference**: Which pattern do developers prefer after using both?
4. **Scale**: At what team/module size does event-driven become necessary?

## Review Trigger

Re-evaluate this decision when:

- Module count exceeds 20
- Complex inter-module workflows emerge
- Performance issues arise with either pattern
- Team feedback indicates confusion
- New architectural patterns emerge in Angular ecosystem

## References

- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [@ngrx/signals Documentation](https://ngrx.io/guide/signals)
- `src/app/presentation/modules/README.md`
- `src/app/presentation/features/dashboard/demo-dashboard.component.ts`
- PR #13 Review Comments - P2 Series

## Implementation Notes

**For PR #13**:
- No code changes to modules
- Update README with ADR reference
- Document dual patterns clearly
- Provide migration guidance for future

**Next Steps**:
- Create epic for module migration evaluation
- Set up metrics to track pattern usage
- Schedule team discussion on preferred approach
- Plan pilot migration of 1-2 modules to hybrid pattern
