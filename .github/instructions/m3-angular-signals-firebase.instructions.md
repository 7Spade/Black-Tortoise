---
description: 'M3 + Angular Signals + Firebase integration enforcement: NgRx Signals for ALL state, Firebase via repositories ONLY, M3 components with signal templates, unidirectional data flow REQUIRED'
applyTo: '**/*.ts, **/*.html, **/*.scss'
---

# M3 + Angular Signals + Firebase Integration Rules

## CRITICAL: Layer Isolation Enforcement

**REQUIRED directory structure:**
- `presentation/` → ONLY UI components, templates, Material components
- `application/` → ONLY stores, facades, use-cases, CQRS handlers
- `domain/` → ONLY entities, value objects, domain services (NO Angular, NO Firebase)
- `infrastructure/` → ONLY Firebase repositories, converters, auth services
- `shared/` → ONLY utilities, constants, reusable types

**FORBIDDEN:**
- Domain layer MUST NOT import from Angular, Firebase, or any framework
- Presentation layer MUST NOT import from infrastructure layer
- Infrastructure layer MUST NOT import from application layer

**VIOLATION consequences:**
- Circular dependencies
- Untestable code
- Broken DDD boundaries

## CRITICAL: Data Flow Constraints

**REQUIRED unidirectional flow ONLY:**
```
User Interaction
  → Presentation (Component)
    → Application (Facade)
      → Application (Use Case)
        → Domain (Entity/Service)
          → Infrastructure (Repository)
            → Firebase
```

**FORBIDDEN reverse flow:**
- Firebase MUST NOT call components directly
- Repositories MUST NOT bypass use-cases
- Domain services MUST NOT access stores

**VIOLATION consequences:**
- Race conditions
- State inconsistencies
- Debugging nightmares

## CRITICAL: NgRx Signals State Management

**REQUIRED for ALL application state:**
```typescript
// REQUIRED pattern
export const FeatureStore = signalStore(
  { providedIn: 'root' },
  withState<StateInterface>(initialState),
  withComputed(({ field }) => ({
    derivedValue: computed(() => /* ... */)
  })),
  withMethods((store) => ({
    updateState: () => patchState(store, { /* ... */ })
  }))
);
```

**REQUIRED:**
- ALL state MUST use `signalStore`
- ALL mutations MUST use `patchState`
- ALL derived state MUST use `computed()`
- ALL async operations MUST use `rxMethod`

**FORBIDDEN:**
- Class-based stores
- Direct property mutation
- Imperative state updates
- RxJS BehaviorSubject/ReplaySubject for state

**VIOLATION consequences:**
- Lost reactivity
- Memory leaks
- Inconsistent state

## CRITICAL: Firebase Integration Constraints

**REQUIRED repository pattern ONLY:**
```typescript
// infrastructure/firebase/repositories/*.repository.ts
export class EntityFirebaseRepository implements IEntityRepository {
  // MUST implement domain interface
}
```

**REQUIRED:**
- Firebase access ONLY through repositories in `infrastructure/`
- Repositories MUST implement domain interfaces
- Converters MUST transform Firebase ↔ Domain entities
- IMMEDIATELY inject repositories into use-cases

**FORBIDDEN in components/facades/stores:**
```typescript
// FORBIDDEN - direct Firebase access
import { Firestore } from '@angular/fire/firestore';
const data = await getDoc(doc(firestore, 'collection/id'));
```

**VIOLATION consequences:**
- Tight coupling to Firebase
- Impossible to test
- Cannot switch persistence layer

## CRITICAL: Material Design 3 Component Usage

**REQUIRED in presentation layer:**
```typescript
// Component MUST use Material components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    @if (data()) {
      <mat-card>
        <button mat-raised-button color="primary">Action</button>
      </mat-card>
    }
  `
})
```

**REQUIRED:**
- ALL UI components MUST use Material Design 3 components
- MUST follow M3 theming system
- MUST use M3 color tokens (`--mat-sys-*`)
- Templates MUST use Angular control flow (`@if`, `@for`, `@defer`)

**FORBIDDEN:**
- Custom UI components that replicate Material functionality
- Hardcoded colors (use M3 tokens)
- Legacy Angular directives (`*ngIf`, `*ngFor`)

**VIOLATION consequences:**
- Inconsistent UX
- Accessibility failures
- Theme breaking changes

## CRITICAL: Signal-Driven Templates

**REQUIRED template pattern:**
```typescript
@Component({
  template: `
    @if (store.loading()) {
      <mat-spinner />
    } @else if (store.error()) {
      <mat-error>{{ store.error() }}</mat-error>
    } @else {
      @for (item of store.items(); track item.id) {
        <app-item-card [item]="item" />
      }
    }
  `
})
export class ListComponent {
  store = inject(FeatureStore);
}
```

**REQUIRED:**
- ALL component state MUST be signals
- ALL templates MUST use signal invocation `()`
- ALL lists MUST use `track` expression
- ALL async data MUST be in stores, NOT component properties

**FORBIDDEN:**
```typescript
// FORBIDDEN - imperative state
items: Item[] = [];
loading = false;

// FORBIDDEN - manual subscriptions in components
this.service.getData().subscribe(data => this.items = data);

// FORBIDDEN - AsyncPipe with observables
{{ data$ | async }}
```

**VIOLATION consequences:**
- Manual subscription leaks
- Zone.js overhead
- Inconsistent reactivity

## CRITICAL: Facade Pattern Enforcement

**REQUIRED for component-application boundary:**
```typescript
// application/facades/*.facade.ts
@Injectable({ providedIn: 'root' })
export class FeatureFacade {
  private store = inject(FeatureStore);
  private useCase = inject(CreateUseCase);
  
  // Expose signals
  readonly data = this.store.data;
  readonly loading = this.store.loading;
  
  // Methods delegate to use-cases
  create(dto: CreateDto) {
    return this.useCase.execute(dto);
  }
}
```

**REQUIRED:**
- Components MUST inject facades, NOT stores directly
- Facades MUST delegate to use-cases for write operations
- Facades MUST expose read-only signals

**FORBIDDEN:**
- Components injecting multiple stores
- Components calling use-cases directly
- Facades with business logic

**VIOLATION consequences:**
- Tight coupling
- Difficult to refactor
- Unclear data flow

## CRITICAL: Use Case Pattern Enforcement

**REQUIRED structure:**
```typescript
// application/use-cases/*.use-case.ts
@Injectable()
export class CreateEntityUseCase {
  private repository = inject(IEntityRepository);
  private domainService = inject(EntityDomainService);
  
  execute(dto: CreateDto): Observable<Entity> {
    // 1. Create domain object
    const entity = Entity.create(dto);
    
    // 2. Domain validation
    const validation = this.domainService.validate(entity);
    if (validation.isFailure) throw new Error(validation.error);
    
    // 3. Persist via repository
    return from(this.repository.save(entity));
  }
}
```

**REQUIRED:**
- ALL write operations MUST go through use-cases
- Use-cases MUST inject repositories via domain interfaces
- Use-cases MUST perform domain validation
- Use-cases MUST return Observable or Promise

**FORBIDDEN:**
- Direct repository calls from facades
- Business logic in facades
- Use-cases calling other use-cases

**VIOLATION consequences:**
- Scattered business logic
- Inconsistent validation
- Transaction boundary violations

## CRITICAL: Firebase Real-time Integration

**REQUIRED pattern for real-time updates:**
```typescript
// infrastructure/firebase/repositories/*.repository.ts
findAll(): Observable<Entity[]> {
  const collectionRef = collection(this.firestore, 'entities');
  return collectionData(collectionRef, { idField: 'id' }).pipe(
    map(docs => docs.map(this.converter.fromFirestore))
  );
}

// application/stores/*.store.ts
withHooks({
  onInit(store) {
    store.loadEntities();
  }
}),
withMethods((store, repo = inject(IEntityRepository)) => ({
  loadEntities: rxMethod<void>(
    pipe(
      switchMap(() => repo.findAll()),
      tapResponse({
        next: (entities) => patchState(store, { entities }),
        error: (error) => patchState(store, { error: error.message })
      })
    )
  )
}))
```

**REQUIRED:**
- Repositories MUST return Observables for real-time data
- Stores MUST use `rxMethod` to subscribe to repository streams
- MUST use `tapResponse` for error handling
- Store updates MUST happen ONLY via `patchState`

**FORBIDDEN:**
- Manual subscriptions in stores
- Direct Firestore subscriptions in components
- Mixing Promise and Observable patterns

**VIOLATION consequences:**
- Memory leaks from unmanaged subscriptions
- Missed real-time updates
- Inconsistent error handling

## CRITICAL: Dependency Injection Configuration

**REQUIRED in `app.config.ts`:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // Angular
    provideRouter(routes),
    provideAnimations(),
    
    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    
    // Repository bindings (dependency inversion)
    { provide: IUserRepository, useClass: UserFirebaseRepository },
    { provide: IWorkspaceRepository, useClass: WorkspaceFirebaseRepository },
    
    // Stores
    FeatureStore,
    
    // Use Cases
    CreateEntityUseCase,
    UpdateEntityUseCase,
    
    // Facades
    FeatureFacade
  ]
};
```

**REQUIRED:**
- ALL Firebase providers in infrastructure configuration
- ALL repository interfaces bound to Firebase implementations
- ALL stores, use-cases, facades registered
- MUST use dependency inversion (provide interface, use concrete class)

**FORBIDDEN:**
- Direct repository class injection
- Missing provider configuration
- Circular dependency injection

**VIOLATION consequences:**
- Runtime injection errors
- Impossible to mock for testing
- Tight coupling to implementation

## Forbidden Patterns

**IMMEDIATELY reject and refactor:**

1. **Domain layer importing Angular:**
```typescript
// FORBIDDEN
import { Injectable } from '@angular/core';
export class UserEntity { } // Domain entities MUST be pure TS
```

2. **Components accessing Firebase:**
```typescript
// FORBIDDEN
constructor(private firestore: Firestore) { }
```

3. **Imperative state updates:**
```typescript
// FORBIDDEN
this.items = newItems;
this.loading = false;

// REQUIRED
patchState(store, { items: newItems, loading: false });
```

4. **Direct store access from components:**
```typescript
// FORBIDDEN
constructor(private store: FeatureStore) { }

// REQUIRED
constructor(private facade: FeatureFacade) { }
```

5. **Mixed framework patterns:**
```typescript
// FORBIDDEN - mixing NgRx traditional with Signals
@Effect() loadData$ = ...

// REQUIRED - NgRx Signals only
loadData: rxMethod(...)
```

**VIOLATION consequences for ANY forbidden pattern:**
- Code review rejection
- Mandatory refactoring
- Architecture degradation
