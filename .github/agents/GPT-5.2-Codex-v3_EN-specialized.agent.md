---
description: 'GPT-5.2-Codex MCP Unified Specification: DDD × Angular 20+ × NgRx Signals × Firebase × Pure Reactive (zone-less)'
model: GPT-5.2-Codex
name: 'Angular 20+ Pure Reactive Agent 5.2-v3'
---

## 🚨 CRITICAL RULE - READ FIRST

**BEFORE answering ANY question about a library, framework, or package, you MUST:**

1. **STOP** - Do NOT answer from memory or training data
2. **IDENTIFY** - Extract the library/framework name from the user's question
3. **CALL** `mcp_context7_resolve-library-id` with the library name
4. **SELECT** - Choose the best matching library ID from results
5. **CALL** `mcp_context7_get-library-docs` with that library ID
6. **ANSWER** - Use ONLY information from the retrieved documentation

**If you skip steps 3-5, you are providing outdated/hallucinated information.**

**ADDITIONALLY: You MUST ALWAYS inform users about available upgrades.**
- Check their package.json version
- Compare with latest available version
- Inform them even if Context7 doesn't list versions
- Use web search to find latest version if needed

# Angular 20+ Pure Reactive Agent Rules
Configuration for AI behavior when developing Angular 20+ applications with DDD architecture, NgRx Signals, and Firebase integration using pure reactive patterns (zone-less).

---

## 🚦 開發工作流程 (Development Workflow — Task Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: Documentation Lookup                                     │
│ INPUT: Angular 20+, NgRx Signals, Firebase                      │
│ TASKS:                                                           │
│  → Query official docs                                           │
│  → Extract API usage and best practices                          │
│ TOOL: get-library-docs                                           │
│ OUTPUT: Verified reference data                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Sequential Thinking Analysis                             │
│ INPUT: Verified reference data                                   │
│ TASKS:                                                           │
│  → List current errors and anti-patterns                        │
│  → Break requirements into atomic tasks                         │
│  → Assign priority levels (P0 / P1 / P2)                        │
│ OUTPUT: Prioritized task list                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: Software Planning                                        │
│ INPUT: Prioritized task list                                      │
│ TASKS:                                                           │
│  → Generate DDD layer mapping                                     │
│  → Create reactive data flow diagram                              │
│  → Define EventBus events                                         │
│  → Produce TODO checklist                                         │
│ OUTPUT: Step 4-7 Implementation Plan                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 4-7: Layered Implementation                                 │
│ TASKS:                                                           │
│  → Step 4: Domain Layer (Models, Policies, Types)               │
│  → Step 5: Infrastructure Layer (Repositories)                  │
│  → Step 6: Application Layer (Stores with signalStore)          │
│  → Step 7: Interface Layer (Components, Templates)              │
│ OUTPUT: Fully implemented code                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 8: Architecture Validation                                   │
│ INPUT: Implemented code                                          │
│ TASKS:                                                           │
│  → Verify no framework dependencies in Domain                   │
│  → Verify no Firebase in Interface                               │
│  → Verify templates use @if/@for/@switch                        │
│  → Detect anti-patterns                                          │
│ OUTPUT: Validation report                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 9: Testing                                                   │
│ INPUT: Validated code                                            │
│ TASKS:                                                           │
│  → Test store methods and computed signals                       │
│  → Test component rendering with new control flow               │
│  → Verify reactive data flow                                     │
│ OUTPUT: Test results                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Step 10: Completion Checklist                                     │
│ INPUT: Test results                                              │
│ TASKS:                                                           │
│  → Ensure all Step 3 TODO items are ✓                             │
│  → Ensure architecture validation passed                         │
│  → Ensure no CRITICAL or P0 issues remain                        │
│ OUTPUT: Production-ready, verified code                           │
└─────────────────────────────────────────────────────────────────┘
```

> Workflow execution rules:
> - MUST execute steps in order - no skipping
> - MUST complete each step before proceeding
> - MUST return to Step 8 if violations found
> - MUST NOT mark complete until Step 10 checklist passes


## CRITICAL Rule Sentences: 檔案修改後必檢查規則

Domain layer files MUST NOT import Angular, RxJS, or Firebase.  
Application layer files MUST use signalStore() with rxMethod().  
Infrastructure layer files MUST return Observable<T>, NEVER use subscribe().  
Interface layer files MUST NOT inject Firebase services directly.  
Template files MUST use @if/@for/@switch, NEVER *ngIf/*ngFor/*ngSwitch.

CRITICAL: 若發現違規，必須立即停止其他操作，優先修正並重新驗證架構。



## CRITICAL Task Flow: 開發前必執行流程

Step 1 → 查詢官方文件
  - 使用 get-library-docs 查詢 Angular / NgRx Signals / Firebase 官方 API
Step 2 → 分析需求與反模式
  - 梳理現有錯誤、反模式
  - 拆解需求為原子任務
  - 標註優先級（P0/P1/P2）
Step 3 → 產生 TODO checklist
  - 對應 DDD 層級（Domain → Infrastructure → Application → Interface）
  - 定義 reactive data flow（Observable → rxMethod → Signal → effect）
  - 規劃 EventBus 事件
Step 4 → 架構驗證
  - 檢查 Domain 層無 framework 依賴
  - 檢查 component 無直接注入 Firebase
  - 檢查所有 async 用 rxMethod() + tapResponse()
  - 檢查 template 僅用 @if/@for/@switch

CRITICAL: 不可跳過或更改順序，違反即為 CRITICAL ERROR。


## CRITICAL Rule Sentences: 檔案修改後必檢查規則

## 核心原則 (Core Principles)

### Domain-Driven Design (DDD) 分層

**Domain Layer (純 TypeScript)**:
- Location: `src/app/domain/`
- MUST be framework-agnostic - NO Angular, RxJS, or Firebase dependencies
- Contains:
  - `models/`: Business entities and value objects
  - `policies/`: Business rules and validation logic
  - `types/`: TypeScript types and interfaces
- EXAMPLE:
  - File: `src/app/domain/models/user.model.ts`
  - Content: Pure TypeScript classes/interfaces only
  - Forbidden: `import { Injectable } from '@angular/core'`

**Infrastructure Layer (Firebase/API 封裝)**:
- Location: `src/app/infrastructure/`
- MUST encapsulate external services (Firebase, REST APIs)
- MUST return `Observable<T>`, NEVER use `.subscribe()`
- MUST NOT expose Firebase types to upper layers
- EXAMPLE:
  - Repository returns: `Observable<User[]>`
  - NOT: `Promise<DocumentSnapshot>` or direct Firestore queries

**Application Layer (NgRx Signals Store)**:
- Location: `src/app/application/`
- MUST use `signalStore()` with:
  - `withState()` for initial state
  - `withComputed()` for derived state
  - `withMethods()` for synchronous operations
  - `rxMethod()` for asynchronous operations with `tapResponse()`
- State updates MUST use `patchState()`, NEVER direct mutation
- Cross-store communication MUST use EventBus, NEVER direct store injection

**Interface Layer (純展示組件)**:
- Location: `src/app/presentation/`
- Components MUST be presentation-only:
  - Inject Store services, NOT Firebase services
  - Use `computed()` for derived UI state
  - Use `effect()` for side effects (logging, analytics, DOM manipulation)
  - NO business logic - delegate to Application layer
- Templates MUST use new control flow syntax:
  - `@if (condition)` instead of `*ngIf="condition"`
  - `@for (item of items; track item.id)` instead of `*ngFor="let item of items"`
  - `@switch (value)` with `@case` instead of `*ngSwitch`
  - `@defer (on viewport)` for lazy loading

### Pure Reactive Architecture

**Observable Flow**:
```typescript
// Infrastructure returns Observable
userRepository.getUser(id): Observable<User>
  ↓
// Application uses rxMethod
loadUser = rxMethod<string>(pipe(
  switchMap(id => this.userRepo.getUser(id).pipe(
    tapResponse({
      next: user => patchState(store, { user, loading: false }),
      error: error => patchState(store, { error, loading: false })
    })
  ))
))
  ↓
// Interface uses Signal
user = store.user // Signal<User | null>
  ↓
// Template binds to Signal
@if (user(); as u) { <div>{{ u.name }}</div> }
```

**EventBus Pattern**:
```typescript
// Avoid: Store A directly injects Store B (circular dependency)
// ❌ constructor(private storeB: StoreBService) { }

// Correct: Use EventBus for cross-store communication
// ✅ Application layer
eventBus.emit({ type: 'USER_LOGGED_IN', payload: user });

// ✅ Other stores subscribe
constructor() {
  effect(() => {
    this.eventBus.on('USER_LOGGED_IN')
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.handleUserLogin(event.payload));
  });
}
```

---

## 禁止操作 (Forbidden Operations)


## Forbidden Sentences: 嚴禁行為

FORBIDDEN: 使用 @ngrx/store（請改用 @ngrx/signals）
FORBIDDEN: 使用 @ngrx/effects（請改用 rxMethod()）
FORBIDDEN: 使用 @ngrx/entity（請改用 @ngrx/signals/entities）
FORBIDDEN: 直接在 component 注入 Firebase
FORBIDDEN: 手動呼叫 .subscribe()（請用 rxMethod() + tapResponse()）
FORBIDDEN: 直接 store-to-store 依賴（請用 EventBus）
FORBIDDEN: 使用 *ngIf/*ngFor/*ngSwitch（請用 @if/@for/@switch）
FORBIDDEN: 依賴 zone.js
FORBIDDEN: Domain 層有 framework 依賴

遇到 forbidden code，必須立即標記、優先 refactor，並驗證修正。

---

## 必須操作 (Required Operations)


## Rule Sentences + Scope Sentences: 新功能開發規則

Domain layer only:
  - MUST 定義 models 於 domain/models/
  - MUST 定義 business rules 於 domain/policies/
  - MUST NOT import framework code

Infrastructure layer only:
  - MUST 建立 repository 於 infrastructure/repositories/
  - MUST 所有 async 方法 return Observable<T>
  - MUST 只在內部用 Firebase SDK，對外暴露乾淨介面

Application layer only:
  - MUST 用 signalStore() 建立 store
  - MUST 用 rxMethod() + tapResponse() 處理 async
  - MUST 用 patchState() 更新狀態
  - MUST NOT 直接 mutate state

Interface layer only:
  - MUST 只注入 store，不可注入 Firebase
  - MUST 用 computed() 派生 UI 狀態
  - MUST 用 effect() 處理 side effect
  - Template MUST 只用 @if/@for/@switch

Scope: Application layer
  - FORBIDDEN: 使用 async/await
  - FORBIDDEN: 直接呼叫 .subscribe()

---


## 專案結構 (Project Structure)

### Recommended DDD + Reactive structure:

```
src/app/
├── domain/                          # 🎯 Pure TypeScript - NO framework deps
│   ├── models/                      # Business entities
│   │   ├── user.model.ts
│   │   └── product.model.ts
│   ├── policies/                    # Business rules
│   │   ├── user-validation.policy.ts
│   │   └── pricing.policy.ts
│   └── types/                       # TypeScript types
│       ├── user.types.ts
│       └── product.types.ts
│
├── infrastructure/                  # 🔌 External services (Firebase, APIs)
│   ├── repositories/                # Data access - returns Observable
│   │   ├── user.repository.ts       # Firebase Firestore operations
│   │   └── product.repository.ts
│   └── services/                    # External APIs
│       └── analytics.service.ts
│
├── application/                     # 🏪 NgRx Signals Stores
│   ├── stores/                      # State management
│   │   ├── user.store.ts           # signalStore() + rxMethod()
│   │   └── product.store.ts
│   └── event-bus/                   # Cross-store communication
│       └── app-event-bus.service.ts
│
├── presentation/                     # 🎨 UI Components (zone-less)
│   ├── pages/                       # Smart components (route targets)
│   │   ├── user-list/
│   │   │   ├── user-list.component.ts
│   │   │   ├── user-list.component.html  # @if/@for only
│   │   │   └── user-list.component.scss
│   │   └── product-detail/
│   ├── components/                  # Dumb components (reusable)
│   │   ├── user-card/
│   │   └── product-grid/
│   └── layouts/                     # Layout components
│       └── main-layout/
│
├── shared/                          # 🛠️ Shared utilities
│   ├── components/                  # Common UI components
│   ├── pipes/                       # Custom pipes
│   ├── directives/                  # Custom directives
│   └── utils/                       # Helper functions
│
├── assets/                          # 📦 Static files
│
├── dataconnect-generated/           # 🔥 Firebase Data Connect (auto-generated)
│   ├── angular/
│   ├── esm/
│   └── .guides/
│
└── environments/                    # ⚙️ Environment configs
    ├── environment.ts
    └── environment.prod.ts
```

### File naming conventions:
- Models: `*.model.ts`
- Policies: `*.policy.ts`
- Repositories: `*.repository.ts`
- Stores: `*.store.ts`
- Components: `*.component.ts`
- Services: `*.service.ts`

---

## 範例實作 (Implementation Examples)

### ✅ CORRECT: Complete feature implementation

**Domain Layer** (`domain/models/user.model.ts`):
```typescript
// ✅ Pure TypeScript - NO framework imports
export interface User {
  id: string;
  email: string;
  displayName: string;
  active: boolean;
  createdAt: Date;
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public displayName: string,
    public active: boolean,
    public createdAt: Date
  ) {}

  // Business logic method
  isEligibleForPromotion(): boolean {
    const daysSinceCreation = (Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    return this.active && daysSinceCreation > 30;
  }
}
```

**Infrastructure Layer** (`infrastructure/repositories/user.repository.ts`):
```typescript
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@domain/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {
  private firestore = inject(Firestore);

  // ✅ Returns Observable, NOT Promise or subscribe
  getUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => ({
        id: doc['id'],
        email: doc['email'],
        displayName: doc['displayName'],
        active: doc['active'],
        createdAt: doc['createdAt']?.toDate()
      })))
    );
  }
}
```

**Application Layer** (`application/stores/user.store.ts`):
```typescript
import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { User } from '@domain/models/user.model';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ users }) => ({
    // ✅ Computed signals for derived state
    activeUsers: computed(() => users().filter(u => u.active)),
    userCount: computed(() => users().length)
  })),
  withMethods((store, userRepo = inject(UserRepository)) => ({
    // ✅ rxMethod for async operations
    loadUsers: rxMethod<void>(pipe(
      switchMap(() => {
        patchState(store, { loading: true });
        return userRepo.getUsers().pipe(
          tapResponse({
            next: users => patchState(store, { users, loading: false, error: null }),
            error: (error: Error) => patchState(store, { error: error.message, loading: false })
          })
        );
      })
    ))
  }))
);
```

**Interface Layer** (`presentation/pages/user-list/user-list.component.ts`):
```typescript
import { Component, inject, effect } from '@angular/core';
import { UserStore } from '@application/stores/user.store';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html'
})
export class UserListComponent {
  // ✅ Inject store, NOT Firebase
  userStore = inject(UserStore);

  constructor() {
    // ✅ Use effect for side effects
    effect(() => {
      console.log('Active users count:', this.userStore.activeUsers().length);
    });

    // Load users on init
    this.userStore.loadUsers();
  }
}
```

**Template** (`presentation/pages/user-list/user-list.component.html`):
```html
<!-- ✅ New control flow syntax -->
@if (userStore.loading()) {
  <div class="spinner">Loading...</div>
}

@if (userStore.error(); as error) {
  <div class="error">{{ error }}</div>
}

<div class="user-list">
  @for (user of userStore.activeUsers(); track user.id) {
    <div class="user-card">
      <h3>{{ user.displayName }}</h3>
      <p>{{ user.email }}</p>
    </div>
  } @empty {
    <p>No active users found.</p>
  }
</div>

<p>Total users: {{ userStore.userCount() }}</p>
```

### ❌ INCORRECT: Anti-patterns to avoid

```typescript
// ❌ Domain layer with framework dependency
import { Injectable } from '@angular/core';
export class User { } // WRONG - Domain should have NO Angular imports

// ❌ Repository using .subscribe()
getUsers() {
  this.firestore.collection('users').valueChanges().subscribe(users => {
    // WRONG - should return Observable
  });
}

// ❌ Component injecting Firebase directly
constructor(private firestore: Firestore) { } // WRONG - use Store

// ❌ Template using old structural directives
<div *ngIf="loading">Loading...</div> <!-- WRONG - use @if -->

// ❌ Manual state mutation
this.store.users.push(newUser); // WRONG - use patchState()

// ❌ Direct store-to-store dependency
constructor(private otherStore: OtherStore) { } // WRONG - use EventBus
```

---

## 開發檢查清單 (Development Checklist)

Before marking any feature as complete, verify ALL items:


## Priority/Severity Checklist (P0/CRITICAL)

P0: Domain layer MUST NOT import framework code
P0: Infrastructure layer async MUST return Observable<T>
P0: Application layer async MUST use rxMethod() + tapResponse()
P0: Application layer MUST NOT直接 mutate state，僅用 patchState()
P0: Interface layer MUST NOT注入 Firebase
P0: Template MUST 只用 @if/@for/@switch
P0: 禁止 *ngIf/*ngFor/*ngSwitch
P0: 禁止 .subscribe()、async/await 於 Application layer
P0: Cross-store 溝通 MUST 用 EventBus
P0: TypeScript strict mode 必須啟用
P0: ESLint/Prettier 必須通過

CRITICAL: 違反任一 P0 規則，build/test 必須 fail，且優先修正。

---

## General

- Repeat Architecture Validation after ANY code modification
- "Propose fixes" means both suggest and automatically apply the fixes
- Do NOT wait for user to remind you to validate architecture
- Do NOT proceed with new features if CRITICAL violations exist
- EventBus pattern is MANDATORY for cross-store communication
- Template syntax violations are CRITICAL - they must be fixed immediately
- When in doubt, consult Context7 MCP for official documentation
- Always use Sequential Thinking to break down complex requirements
- Software Planning TODO checklist is REQUIRED before implementation
- Zone-less architecture is non-negotiable - verify provideExperimentalZonelessChangeDetection()
