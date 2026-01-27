---
description: "Enforce Single Responsibility Principle across all modules"
applyTo: '**'
---

# Single Responsibility Principle (SRP)

## Core Principle
**A class/module should have ONE and ONLY ONE reason to change.**

Each module should have a single, well-defined responsibility. If you can describe what a module does with "AND", it's doing too much.

## Definition of "Responsibility"
A responsibility is **a reason to change**:
- ✅ "UserStore manages user state" → 1 reason to change (user state requirements change)
- ❌ "UserStore manages user state AND handles authentication AND logs audit events" → 3 reasons to change

## Common SRP Violations

### 1. Store Doing Too Much
#### ❌ Violates SRP
```typescript
export class WorkspaceStore {
  // Responsibility 1: Workspace state
  private currentWorkspace = signal<WorkspaceEntity | null>(null);
  
  // Responsibility 2: Runtime lifecycle management
  private runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
  
  // Responsibility 3: Module coordination
  private tasksStore = inject(TasksStore);
  private documentsStore = inject(DocumentsStore);
  // ... 9 more stores
  
  // Responsibility 4: Organization context
  private organizationStore = inject(OrganizationStore);
  
  switchWorkspace(id: string) {
    // Manages runtime
    this.runtimeFactory.destroyRuntime(this.currentWorkspace()?.id);
    
    // Resets all modules
    this.tasksStore.reset();
    this.documentsStore.reset();
    
    // Updates organization context
    this.organizationStore.setCurrentOrganization(...);
    
    // Updates workspace state
    this.currentWorkspace.set(workspace);
  }
}
```

**Problems:**
- Changes to runtime lifecycle → must change WorkspaceStore
- Changes to module coordination → must change WorkspaceStore  
- Changes to organization context → must change WorkspaceStore
- Changes to workspace state → must change WorkspaceStore

#### ✅ Follows SRP
```typescript
/**
 * WorkspaceStore - ONLY manages workspace state
 * Reason to change: Workspace state requirements change
 */
export class WorkspaceStore {
  private currentWorkspaceId = signal<string | null>(null);
  private availableWorkspaces = signal<WorkspaceEntity[]>([]);
  
  setCurrentWorkspace(id: string): void {
    this.currentWorkspaceId.set(id);
  }
  
  getCurrentWorkspace(): WorkspaceEntity | null {
    const id = this.currentWorkspaceId();
    return this.availableWorkspaces().find(w => w.id === id) ?? null;
  }
}

/**
 * WorkspaceLifecycleService - ONLY manages workspace lifecycle
 * Reason to change: Lifecycle orchestration logic changes
 */
@Injectable({ providedIn: 'root' })
export class WorkspaceLifecycleService {
  private runtimeManager = inject(WorkspaceRuntimeManager);
  private moduleCoordinator = inject(ModuleCoordinator);
  
  switchWorkspace(from: string | null, to: string): void {
    this.runtimeManager.stopRuntime(from);
    this.moduleCoordinator.resetAllModules();
    this.runtimeManager.startRuntime(to);
  }
}

/**
 * ModuleCoordinator - ONLY coordinates module stores
 * Reason to change: Module coordination strategy changes
 */
@Injectable({ providedIn: 'root' })
export class ModuleCoordinator {
  private eventBus = inject(WorkspaceEventBus);
  
  resetAllModules(): void {
    this.eventBus.emit({ type: 'AllModulesReset' });
  }
}
```

### 2. Service Doing Multiple Things
#### ❌ Violates SRP
```typescript
@Injectable()
export class UserService {
  // Responsibility 1: User CRUD
  createUser(data: CreateUserDto): Promise<User> { }
  updateUser(id: string, data: UpdateUserDto): Promise<User> { }
  deleteUser(id: string): Promise<void> { }
  
  // Responsibility 2: Authentication
  login(email: string, password: string): Promise<AuthToken> { }
  logout(): Promise<void> { }
  
  // Responsibility 3: Email notifications
  sendWelcomeEmail(user: User): Promise<void> { }
  sendPasswordResetEmail(email: string): Promise<void> { }
  
  // Responsibility 4: Analytics
  trackUserActivity(userId: string, action: string): void { }
}
```

#### ✅ Follows SRP
```typescript
// Each service has ONE responsibility

@Injectable()
export class UserManagementService {
  createUser(data: CreateUserDto): Promise<User> { }
  updateUser(id: string, data: UpdateUserDto): Promise<User> { }
  deleteUser(id: string): Promise<void> { }
}

@Injectable()
export class AuthenticationService {
  login(email: string, password: string): Promise<AuthToken> { }
  logout(): Promise<void> { }
}

@Injectable()
export class UserNotificationService {
  sendWelcomeEmail(user: User): Promise<void> { }
  sendPasswordResetEmail(email: string): Promise<void> { }
}

@Injectable()
export class UserAnalyticsService {
  trackUserActivity(userId: string, action: string): void { }
}
```

### 3. Component Doing Business Logic
#### ❌ Violates SRP
```typescript
@Component({
  selector: 'app-workspace-switcher',
  template: `...`
})
export class WorkspaceSwitcherComponent {
  private firestore = inject(Firestore);
  private router = inject(Router);
  
  // Responsibility 1: UI presentation
  // Responsibility 2: Business logic
  // Responsibility 3: Data access
  
  async switchWorkspace(id: string) {
    // Business logic in component!
    const workspace = await getDoc(doc(this.firestore, 'workspaces', id));
    
    if (!workspace.exists()) {
      throw new Error('Workspace not found');
    }
    
    const modules = workspace.data().modules;
    
    // More business logic...
    if (modules.includes('admin') && !this.isAdmin()) {
      throw new Error('Unauthorized');
    }
    
    // Navigation
    this.router.navigate(['/workspace', id]);
  }
}
```

#### ✅ Follows SRP
```typescript
@Component({
  selector: 'app-workspace-switcher',
  template: `...`
})
export class WorkspaceSwitcherComponent {
  private workspaceService = inject(WorkspaceService);
  
  // ONLY responsible for UI presentation and user interaction
  
  onWorkspaceSelect(id: string): void {
    this.workspaceService.switchWorkspace(id);
  }
}

// Business logic belongs in service
@Injectable()
export class WorkspaceService {
  private repository = inject(WORKSPACE_REPOSITORY);
  private authService = inject(AuthorizationService);
  private router = inject(Router);
  
  async switchWorkspace(id: string): Promise<void> {
    const workspace = await this.repository.findById(id);
    
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    
    if (!this.authService.canAccessWorkspace(workspace)) {
      throw new Error('Unauthorized');
    }
    
    this.router.navigate(['/workspace', id]);
  }
}
```

## SRP in Different Layers

### Domain Layer
```typescript
// ✅ WorkspaceEntity - ONLY represents workspace domain model
export class WorkspaceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization',
    public readonly moduleIds: string[]
  ) {}
  
  // Domain behavior ONLY
  hasModule(moduleId: string): boolean {
    return this.moduleIds.includes(moduleId);
  }
  
  // ❌ NO persistence logic
  // ❌ NO UI logic
  // ❌ NO infrastructure concerns
}
```

### Application Layer
```typescript
// ✅ CreateWorkspaceHandler - ONLY handles workspace creation use case
export class CreateWorkspaceHandler {
  execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    // Use case orchestration ONLY
  }
}

// ✅ WorkspaceStore - ONLY manages workspace state
export class WorkspaceStore {
  // State management ONLY
}

// ✅ WorkspaceLifecycleService - ONLY manages lifecycle
export class WorkspaceLifecycleService {
  // Lifecycle orchestration ONLY
}
```

### Infrastructure Layer
```typescript
// ✅ FirebaseWorkspaceRepository - ONLY handles Firestore persistence
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  // Firestore operations ONLY
  
  // ❌ NO business logic
  // ❌ NO state management
}
```

### Presentation Layer
```typescript
// ✅ WorkspaceListComponent - ONLY displays workspace list
@Component({
  selector: 'app-workspace-list',
  template: `...`
})
export class WorkspaceListComponent {
  // UI presentation ONLY
  
  // ❌ NO business logic
  // ❌ NO data access
}
```

## How to Identify SRP Violations

### Test 1: "AND" Test
Can you describe the class/module with "AND"?
- ❌ "This store manages workspace state AND handles runtime lifecycle AND coordinates modules"
- ✅ "This store manages workspace state"

### Test 2: Reasons to Change
List all reasons this module might change:
- ❌ More than 1 reason = SRP violation
- ✅ Exactly 1 reason = follows SRP

### Test 3: Method Cohesion
Do all methods in this class relate to the same responsibility?
- ❌ `createUser()`, `sendEmail()`, `trackAnalytics()` → low cohesion
- ✅ `createUser()`, `updateUser()`, `deleteUser()` → high cohesion

### Test 4: Dependency Count
How many dependencies does this class have?
- ❌ >5 dependencies often indicates multiple responsibilities
- ✅ 1-3 dependencies usually indicates single responsibility

## Refactoring to SRP

### Step 1: Identify Responsibilities
List everything the module does:
```typescript
// WorkspaceStore responsibilities:
// 1. Store workspace state ✅
// 2. Manage runtime lifecycle ❌
// 3. Reset module stores ❌
// 4. Update organization context ❌
```

### Step 2: Extract Each Responsibility
```typescript
// Keep #1 in WorkspaceStore
// Extract #2 → WorkspaceRuntimeManager
// Extract #3 → ModuleCoordinator
// Extract #4 → OrganizationContextService
```

### Step 3: Connect via Abstractions
```typescript
// WorkspaceStore only knows about interfaces
export class WorkspaceStore {
  private lifecycle = inject(WORKSPACE_LIFECYCLE);
  
  switchWorkspace(id: string): void {
    this.lifecycle.switchWorkspace(id); // Delegate, don't do
  }
}
```

## Common Excuses (and Why They're Wrong)

### ❌ "But it's more convenient to put everything in one place"
**Why wrong:** Short-term convenience → long-term maintenance nightmare

### ❌ "But I need to coordinate these things together"
**Why wrong:** Coordination ≠ doing everything yourself. Use services/events to coordinate.

### ❌ "But splitting it creates more files"
**Why wrong:** More files with clear responsibilities > fewer files with mixed responsibilities

### ❌ "But I'm just calling one method on another store"
**Why wrong:** Today it's one method, tomorrow it's five. Dependency creep is real.

## Benefits of SRP

✅ **Easier to understand:** Each module does ONE thing well
✅ **Easier to test:** Fewer dependencies to mock
✅ **Easier to change:** Changes are localized
✅ **Easier to reuse:** Focused modules are more reusable
✅ **Better team collaboration:** Developers don't step on each other's toes
✅ **Reduced coupling:** Each module has minimal dependencies

## SRP Checklist

When creating/reviewing a module, ask:

- [ ] Can I describe this module's purpose in ONE sentence without "AND"?
- [ ] Does this module have exactly ONE reason to change?
- [ ] Are all methods cohesive (related to the same responsibility)?
- [ ] Does this module have ≤3 dependencies?
- [ ] Can I test this module in isolation easily?
- [ ] If requirement X changes, do I only need to change this ONE module?

If you answer "NO" to any question → SRP violation → refactor!

## Summary

**Single Responsibility Principle = Single Reason to Change**

Each module should do ONE thing and do it well. When a module does multiple things, split it into multiple focused modules that each do ONE thing exceptionally well.
