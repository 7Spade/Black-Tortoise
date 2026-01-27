# Template Architecture Guide: Angular 20 Strict DDD + Signals

This document explains the architecture of the Template feature, demonstrating how strict DDD, NgRx Signals, and Firebase interact in a Zone-less Angular 20 application.

## 1. Architectural Layers & Dependency Rule

**Strict Direction:** `Presentation` -> `Application` -> `Domain` <- `Infrastructure`

- **Domain (`core/domain`)**: Pure TypeScript. Contains Business Logic (Entities, Aggregates, Value Objects, Policies). NO dependencies on Angular, Firebase, or other layers.
- **Application (`core/application`)**: Orchestration. orchestrates data flow using `NgRx SignalStores`. Depends ONLY on Domain. Defines Interfaces (Ports) for Infrastructure.
- **Infrastructure (`infrastructure`)**: implementation. Implements Domain/Application interfaces using Firebase/HTTP.
- **Presentation (`presentation`)**: UI. "Passive View". Depends on Application Facades/ViewModels.

## 2. Interaction Flow: "The Reactive Loop"

### Step 1: User Action (Presentation)
Current user interacts with `TemplateListPageComponent`.
- **Component**: Zone-less, `OnPush`.
- **Action**: Calls `TemplateFacade.createTemplate('New Title')`.
- **View**: Consumes `facade.viewModels()` (Computed Signal).

```typescript
// Component interacts ONLY with Facade
<button (click)="facade.createTemplate('Title')">Create</button>
<div *ngFor="let item of facade.viewModels()">{{ item.uiTitle }}</div>
```

### Step 2: Application Orchestration (Facade -> Store -> Handler)
The Facade delegates to `TemplateStore`. The Store manages global state using Signals.

- **Facade**: `template.facade.ts` abstracts the Store.
- **Store**: `template.store.ts` uses `rxMethod` to handle side-effects (async operations).
- **Handler**: `CreateTemplateHandler` implements CQRS Command pattern.

```typescript
// template.store.ts
create: rxMethod<{ title: string }>(
  pipe(
     switchMap(req => createHandler.execute(new CreateTemplateCommand(req.title)))
  )
)
```

### Step 3: Domain Logic (Application Handler -> Domain Factory)
The Handler invokes Domain logic to validly construct the Aggregate.

- **Factory**: `TemplateFactory` ensures invariants (e.g., Title cannot be empty).
- **Aggregate**: `TemplateAggregate` is a rich model with behavior.

```typescript
// create-template.handler.ts
const aggregate = TemplateFactory.createNew(command.title); // Returns Result<Aggregate, Error>
```

### Step 4: Infrastructure Persistence (Handler -> Repository)
The Handler persists the valid Aggregate using the Repository Interface.

- **Interface**: `ITemplateRepository` (defined in Domain).
- **Implementation**: `TemplateFirebaseRepository` (defined in Infrastructure).
- **Dependency Injection**: Wired in `app.config.ts`.

```typescript
// Handler depends on Interface (DIP)
private repository = inject(TEMPLATE_REPOSITORY_TOKEN);
await this.repository.save(aggregate);
```

### Step 5: State Update (Infrastructure -> Store -> Presentation)
1. Repository saves to Firestore.
2. Handler returns `Result.ok(id)`.
3. **Store** updates its signal state (optimistically or re-fetches).
4. **Signals** verify change.
5. **Presentation** (UI) automatically updates fine-grained DOM due to Signal tracking.

## 3. Key Patterns

### NgRx Signals for State
We use `@ngrx/signals` instead of `BehaviorSubject`.
- `withState`: Holds the raw `TemplateDTO[]`.
- `withComputed`: Derives `count`, `filteredList`.
- `patchState`: The ONLY way to mutate state.

### Result Pattern
We use `Result<T, E>` types instead of throwing Exceptions for control flow.
- Forces consumers to handle failure cases.

### View Models
Presentation layer never sees Domain Entities directly (Rule of Strict Separation).
- Mappers convert `Entity` -> `DTO` (Application).
- Computed Signals convert `DTO` -> `ViewModel` (Presentation).

### @angular/fire Integration
Infrastructure repositories use modular SDK (`doc`, `setDoc`, `collection`).
- Wrapped in `try/catch` -> converts to `Result<T, E>`.
- Mappers convert `FirestoreDTO` <-> `DomainEntity`.
