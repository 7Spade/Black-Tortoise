<!-- markdownlint-disable-file -->

# Task Research Notes: Permissions Module Architecture

## Research Executed

### File Analysis

- `docs/modulars/01-permissions-權限模組.md`
  - Complete specification for permissions module (version 2.0)
  - Defines RBAC architecture, DDD patterns, Angular 20+ requirements
  - Event-driven integration patterns with other modules
- `src/app/application/stores/permissions.store.ts`
  - Existing NgRx SignalStore implementation with role-permission matrix
  - Uses computed signals for permission checks
  - Event integration placeholder (WorkspaceSwitched)
- `src/app/presentation/pages/modules/permissions/permissions.component.ts`
  - Basic UI component using @for/@if control flow
  - Demonstrates modern Angular template syntax
  - Limited functionality (demo roles only)
- `src/app/domain/aggregates/role-definition.aggregate.ts` & `role.entity.ts`
  - Two separate role entities exist (needs consolidation)
  - RoleDefinitionAggregate: workspace-scoped roles with version
  - RoleEntity: generic roles with timestamps
- `src/app/domain/policies/permission-validation.policy.ts`
  - Basic validation logic for role modification and permission format
  - Uses simple regex pattern validation
- `src/app/infrastructure/repositories/permission.repository.impl.ts`
  - Firebase Firestore repository implementation
  - Basic CRUD operations for roles

### Code Search Results

- Permission-related files found:
  - Store: `/src/app/application/stores/permissions.store.ts`
  - Commands: `/src/app/application/commands/update-role-permissions.command.ts`
  - Handlers: `/src/app/application/handlers/update-role-permissions.handler.ts`
  - Events: `/src/app/domain/events/permission-granted.event.ts`, `permission-revoked.event.ts`
  - Repository: Domain interface + Infrastructure implementation
  - UI: `/src/app/presentation/pages/modules/permissions/permissions.component.ts`

### External Research

- #githubRepo:"angular/angular angular signals"
  - Angular 20+ uses signals as primary reactivity primitive
  - Computed signals are memoized and automatically track dependencies
  - Effect API replaces traditional RxJS patterns for side effects
  
- #githubRepo:"ngrx/platform signalStore"
  - signalStore is the modern replacement for component-level state
  - withComputed for derived state, withMethods for actions
  - withHooks for lifecycle management (onInit, onDestroy)

### Project Conventions

- Standards referenced: `.github/instructions/strict-ddd-architecture.instructions.md`
  - Domain → Application → Infrastructure → Presentation
  - No barrel exports, explicit dependencies only
  - Interfaces defined in consuming layer
- Architecture: `docs/workspace-modular-architecture.constitution.md`
  - Workspace-scoped event bus for module communication
  - Pure reactive communication (no direct service calls)
  - Event flow: Append → Publish → React

## Key Discoveries

### Project Structure

Current implementation has **partial architecture** in place:

```
src/app/
├── domain/
│   ├── aggregates/
│   │   ├── role-definition.aggregate.ts    # Workspace-scoped
│   │   └── role.entity.ts                  # Generic entity (DUPLICATE)
│   ├── events/
│   │   ├── permission-granted.event.ts
│   │   └── permission-revoked.event.ts
│   ├── policies/
│   │   └── permission-validation.policy.ts
│   └── repositories/
│       └── permission.repository.ts        # Interface only
├── application/
│   ├── stores/
│   │   └── permissions.store.ts            # SignalStore implemented
│   ├── commands/
│   │   └── update-role-permissions.command.ts
│   ├── handlers/
│   │   └── update-role-permissions.handler.ts
│   └── providers/                          # MISSING: PermissionContextProvider
├── infrastructure/
│   └── repositories/
│       └── permission.repository.impl.ts   # Firestore implementation
└── presentation/
    └── pages/modules/permissions/
        └── permissions.component.ts        # Basic UI only
```

**GAPS IDENTIFIED:**
1. No PermissionContextProvider implementation (required by spec)
2. Duplicate role entities need consolidation
3. No permission matrix UI with sticky headers and checkboxes
4. No custom role creation/editing UI
5. No batch operations for permission assignment
6. No change history tracking
7. No event bus integration (only placeholder)
8. No permission inheritance/override logic

### Implementation Patterns

#### Current Store Pattern (CORRECT)

```typescript
export const PermissionsStore = signalStore(
  { providedIn: 'root' },
  withState<PermissionsState>(initialState),
  withComputed((state) => ({
    canPerform: computed(() => (resource: string, action: string) => {
      // Permission check logic
    })
  })),
  withMethods((store) => ({
    grantPermission(roleId: string, permission: Permission): void {
      patchState(store, { /* ... */ });
    }
  }))
);
```

#### Required Event Bus Integration (FROM SPEC)

```typescript
withMethods((store) => {
  const eventBus = inject(WorkspaceEventBus);
  const workspaceContext = inject(WorkspaceContextProvider);
  
  return {
    grantPermission(roleId: string, permission: string): void {
      const workspaceId = workspaceContext.getCurrentWorkspaceId();
      if (!workspaceId) throw new Error('No workspace selected');
      
      // Update state (optimistic)
      patchState(store, { /* ... */ });
      
      // Publish event
      eventBus.emit({
        type: 'PermissionChanged',
        payload: { roleId, permission, action: 'grant' }
      });
    }
  };
}),
withHooks({
  onInit(store) {
    const eventBus = inject(WorkspaceEventBus);
    
    // Subscribe to WorkspaceSwitched
    eventBus.on('WorkspaceSwitched', () => {
      patchState(store, initialState);
    });
  }
})
```

### Complete Examples

**Domain Layer: Role Aggregate with Factory Pattern**

```typescript
// Domain Layer: permissions/domain/aggregates/role.aggregate.ts
export class RoleEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    private _permissions: Set<string>,
    public readonly metadata: RoleMetadata
  ) {}
  
  public static create(
    name: string,
    permissions: string[],
    eventMetadata?: EventMetadata
  ): RoleEntity {
    const id = generateId();
    const role = new RoleEntity(
      id,
      name,
      new Set(permissions),
      { createdAt: Date.now(), updatedAt: Date.now() }
    );
    
    // Generate Domain Event
    role.addDomainEvent(
      new RoleCreatedEvent(id, { name, permissions }, eventMetadata)
    );
    
    return role;
  }
  
  public static reconstruct(props: RoleProps): RoleEntity {
    // Reconstruct from snapshot without emitting events
    return new RoleEntity(
      props.id,
      props.name,
      new Set(props.permissions),
      props.metadata
    );
  }
}

// Domain Layer: permissions/domain/factories/role.factory.ts
export class RoleFactory {
  public static createCustomRole(
    name: string,
    permissions: string[],
    metadata?: EventMetadata
  ): RoleEntity {
    // Enforce naming policy
    RoleNamingPolicy.assertIsValid(name);
    
    // Enforce permission policy
    PermissionPolicy.assertValidPermissions(permissions);
    
    // Create via aggregate
    return RoleEntity.create(name, permissions, metadata);
  }
}

// Domain Layer: permissions/domain/policies/role-naming.policy.ts
export class RoleNamingPolicy {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 30;
  private static readonly RESERVED_NAMES = ['owner', 'admin', 'member', 'viewer'];
  
  public static isSatisfiedBy(name: string): boolean {
    if (!name) return false;
    
    const trimmed = name.trim();
    if (trimmed.length < this.MIN_LENGTH) return false;
    if (trimmed.length > this.MAX_LENGTH) return false;
    
    const lower = trimmed.toLowerCase();
    return !this.RESERVED_NAMES.includes(lower);
  }
  
  public static assertIsValid(name: string): void {
    if (!this.isSatisfiedBy(name)) {
      throw new DomainError(
        `Invalid role name: "${name}". Must be ${this.MIN_LENGTH}-${this.MAX_LENGTH} chars and not reserved.`
      );
    }
  }
}
```

**Application Layer: Context Provider Pattern**

```typescript
// Application Layer: permissions/application/providers/permission-context.provider.ts
export abstract class PermissionContextProvider {
  abstract hasPermission(userId: string, permission: string): boolean;
  abstract getUserRole(userId: string): string | null;
  abstract getRolePermissions(roleId: string): string[];
}

// Application Layer: Implementation
@Injectable({ providedIn: 'root' })
export class PermissionContextProviderImpl implements PermissionContextProvider {
  private store = inject(PermissionsStore);
  
  hasPermission(userId: string, permission: string): boolean {
    // Query from store
    const [resource, action] = permission.split(':');
    return this.store.canPerform()(resource, action as any);
  }
  
  getUserRole(userId: string): string | null {
    return this.store.currentUserRole()?.roleName ?? null;
  }
  
  getRolePermissions(roleId: string): string[] {
    return this.store.getPermissionsForRole()(roleId).map(
      p => `${p.resource}:${p.action}`
    );
  }
}
```

### API and Schema Documentation

**Permission Matrix Requirements:**
- Structure: `Map<RoleId, Set<PermissionId>>`
- Granular permissions: `resource:action` format (e.g., `tasks:create`, `qc:approve`)
- Resource-level permissions with inheritance
- 2D matrix view: rows = roles, columns = resources/operations
- Sticky headers for navigation
- mat-checkbox for cells with batch operations

**Custom Roles Requirements:**
- Fields: name, description, permissions set, color marker
- Naming rules: 3-30 characters, no duplicate, no reserved names
- System default roles: Owner > Admin > Member > Viewer (hierarchical)
- Owner cannot be deleted, workspace must have at least one Owner
- Custom roles support priority for conflict resolution
- Multiple roles per member with union of permissions
- Changes take effect immediately (no re-login required)

### Configuration Examples

**Event Integration Configuration:**

```typescript
// Published Events
- PermissionChanged: When role permissions modified
- RoleCreated: When new role created
- RoleUpdated: When role information updated
- RoleDeleted: When role deleted

// Subscribed Events
- MemberRoleChanged: Update permission cache when member role changes
- WorkspaceSwitched: Reset permission state on workspace switch

// Event Requirements
- All events must include correlationId
- Events must follow Append → Publish → React order
- Event payloads must be pure data DTOs
- No Service/Function/UI references in events
```

**UI/UX Specifications:**

```typescript
// Design System
- Angular Material M3 components
- Tailwind CSS utility-first styling
- Consistent card, button, dialog layouts

// Accessibility (A11y)
- Keyboard navigation support
- Semantic HTML
- LiveAnnouncer for important state changes

// Performance Targets
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

// Optimization Strategies
- Zone-less change detection
- ChangeDetectionStrategy.OnPush
- @defer (on viewport) for heavy views
- @defer (on interaction) for secondary interactions
```

### Technical Requirements

**Angular 20+ Modern Practices:**
- ✅ Use signalStore for state management
- ✅ Use computed signals for permission checks (no function calls)
- ✅ Use @if/@else instead of *ngIf
- ✅ Use @for with track expression instead of *ngFor
- ✅ Use @switch/@case instead of *ngSwitch
- ✅ Use @defer for lazy loading
- ❌ NO BehaviorSubject or manual subscriptions
- ❌ NO RxJS in new code (signals only)
- ❌ NO zone-based change detection

**DDD Architecture Requirements:**
- ✅ Aggregate Root: RoleEntity with domain events
- ✅ Factory Pattern: Enforce policies during creation
- ✅ Policy Pattern: Encapsulate business rules
- ✅ Repository Pattern: Interface in Application, implementation in Infrastructure
- ✅ Mapper Pattern: Domain ↔ DTO ↔ Firestore conversions
- ❌ NO cross-module store injection
- ❌ NO shared entity classes between modules
- ✅ Use ID references + Context Provider for cross-module data

**Forbidden Practices:**
- ❌ Mixing identity logic ("who am I") into permissions module
- ❌ Direct component manipulation of permission data (must go through store)
- ❌ Sharing permission data across workspaces
- ❌ Direct injection of other module stores (tight coupling)
- ❌ Sharing Entity classes between modules
- ✅ Use ID references + Context Provider queries instead

## Recommended Approach

### Phased Implementation Strategy

**Phase 1: Core Architecture (Foundation)**
1. Consolidate duplicate role entities into single DDD aggregate
2. Implement RoleFactory with RoleNamingPolicy enforcement
3. Implement PermissionContextProvider (abstract + concrete)
4. Create mapper classes (RoleToDtoMapper, RoleFirestoreMapper)
5. Enhance repository with proper domain entity handling
6. Add dependency injection tokens for loose coupling

**Phase 2: State Management Enhancement**
1. Enhance PermissionsStore with event bus integration
2. Add withHooks for WorkspaceSwitched event subscription
3. Implement optimistic updates for grant/revoke operations
4. Add proper error handling and loading states
5. Create computed selectors for permission queries
6. Implement role priority logic for multi-role users

**Phase 3: UI Implementation - Permission Matrix**
1. Build 2D matrix component with sticky headers
2. Implement mat-checkbox for permission cells
3. Add batch selection/operation support
4. Implement optimistic UI with rollback on error
5. Add keyboard navigation and accessibility features
6. Create responsive layout for mobile/tablet

**Phase 4: UI Implementation - Role Management**
1. Create custom role creation/editing dialog
2. Implement role templates (PM, Developer, Tester, Guest)
3. Add color picker for role markers
4. Implement role deletion with safety checks (prevent Owner deletion)
5. Show role priority configuration UI
6. Display change history/audit log for permissions

**Phase 5: Advanced Features**
1. Implement permission inheritance system
2. Add permission override capability
3. Create bulk import/export for roles
4. Add role comparison view
5. Implement permission simulation ("what if" analysis)
6. Add permission conflict detection and resolution

**Phase 6: Integration & Testing**
1. Implement full event bus integration (publish/subscribe)
2. Create integration tests for event flow
3. Write E2E tests for critical user journeys
4. Performance optimization (lazy loading, virtual scroll)
5. Accessibility audit and fixes
6. Documentation and migration guide

### Architecture Decisions

**Single Source of Truth:**
- All permission state managed by PermissionsStore
- Components never directly mutate permission data
- All checks via computed signals (automatic memoization)

**Event-Driven Integration:**
- WorkspaceEventBus for cross-module communication
- Append → Publish → React pattern enforced
- Context Providers for synchronous data queries

**DDD Compliance:**
- Domain layer pure business logic (no Angular dependencies)
- Application layer orchestrates domain + infrastructure
- Infrastructure implements external concerns (Firestore)
- Presentation uses signals/computed for reactive UI

**Performance First:**
- Zone-less change detection
- OnPush strategy for all components
- @defer for heavy matrix views
- Virtual scrolling for large role lists

## Implementation Guidance

### Objectives
1. **Establish DDD Foundation**: Consolidate aggregates, implement factories/policies
2. **Enable Event-Driven Communication**: Full event bus integration with proper correlation IDs
3. **Build Permission Matrix UI**: Sticky headers, checkboxes, batch operations
4. **Support Custom Roles**: Create/edit/delete with validation and templates
5. **Ensure Performance**: Zone-less, OnPush, lazy loading, optimistic updates
6. **Maintain Type Safety**: No any/unknown, explicit mappers, proper dependency injection

### Key Tasks
- [ ] Consolidate RoleDefinitionAggregate and RoleEntity into single aggregate
- [ ] Implement RoleFactory with policy enforcement (naming, permissions)
- [ ] Create PermissionContextProvider (abstract + implementation)
- [ ] Enhance PermissionsStore with event bus integration (inject, subscribe, publish)
- [ ] Build permission matrix component with Material table + sticky headers
- [ ] Implement custom role creation/editing dialog with validation
- [ ] Add batch permission grant/revoke operations
- [ ] Implement change history tracking with audit events
- [ ] Create role templates (PM, Developer, Tester, Guest)
- [ ] Add permission inheritance and override logic
- [ ] Write integration tests for event flow (Given-When-Then)
- [ ] Implement E2E tests for critical flows (create role, grant permission, workspace switch)
- [ ] Performance optimization (zone-less, OnPush, @defer, virtual scroll)
- [ ] Accessibility improvements (keyboard nav, ARIA labels, LiveAnnouncer)

### Dependencies
- **Internal:**
  - WorkspaceEventBus (for event publish/subscribe)
  - WorkspaceContextProvider (for getCurrentWorkspaceId)
  - MemberContextProvider (optional, for member queries)
- **External:**
  - @angular/material (M3 components: table, checkbox, dialog, buttons)
  - @angular/cdk (ScrollingModule for virtual scroll, A11yModule)
  - @ngrx/signals (signalStore, computed, effect)
  - @angular/fire (Firestore for persistence)
  - Tailwind CSS (utility classes for styling)

### Success Criteria
- ✅ All permission checks use computed signals (zero function calls)
- ✅ Permission matrix renders with sticky headers and responsive layout
- ✅ Custom roles can be created/edited with proper validation
- ✅ Batch operations work with optimistic UI and rollback
- ✅ Event bus integration complete (publish PermissionChanged, subscribe WorkspaceSwitched)
- ✅ Change history displays who/when/what for all permission modifications
- ✅ Permission inheritance works correctly with override capability
- ✅ Multi-role users get union of all role permissions
- ✅ Workspace switch clears all permission state
- ✅ No direct store injection between modules
- ✅ All tests pass (unit, integration, E2E)
- ✅ Performance targets met (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- ✅ Accessibility audit passes (keyboard nav, screen reader support)
- ✅ Type safety enforced (no any/unknown in new code)
