# DDD Boundary Rules - Quick Reference

## 🚨 IMPORTANT: Layer Import Rules

### ✅ ALLOWED Dependencies

```typescript
// ✅ Domain → Nothing
// Domain is pure TypeScript - NO imports from other layers

// ✅ Application → Domain
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';
import { DomainEvent } from '@domain/event/domain-event';

// ✅ Infrastructure → Domain
import { WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';

// ✅ Presentation → Application (ONLY via facades/stores/interfaces)
import { ModuleFacade } from '@application/facades/module.facade';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { IAppModule } from '@application/interfaces/module.interface';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
```

### ❌ FORBIDDEN Dependencies

```typescript
// ❌ Application → Infrastructure
// NEVER import Infrastructure in Application
import { WorkspaceRuntimeFactory } from '@infrastructure/...';  // ❌ NO!

// ❌ Presentation → Infrastructure
// NEVER import Infrastructure in Presentation
import { WorkspaceRuntimeFactory } from '@infrastructure/...';  // ❌ NO!

// ❌ Presentation → Domain
// NEVER import Domain in Presentation
import { Module } from '@domain/module/module.interface';  // ❌ NO!
import { WorkspaceEventBus } from '@domain/...';  // ❌ NO!

// ❌ Domain → Any other layer
// Domain is isolated - imports nothing from other layers
import { SomeService } from '@application/...';  // ❌ NO!
```

---

## 🎯 Common Scenarios

### 1. Creating a New Infrastructure Service

**❌ WRONG:**
```typescript
// application/stores/my-store.ts
import { MyService } from '@infrastructure/my-service';  // ❌ Direct import

const myService = inject(MyService);  // ❌ Direct injection
```

**✅ CORRECT:**
```typescript
// Step 1: Define interface in Application
// application/interfaces/my-service.interface.ts
export interface IMyService {
  doSomething(): Promise<void>;
}

// Step 2: Create DI token
// application/tokens/my-service.token.ts
export const MY_SERVICE = new InjectionToken<IMyService>('MY_SERVICE');

// Step 3: Implement in Infrastructure
// infrastructure/my-service.impl.ts
@Injectable()
export class MyServiceImpl implements IMyService {
  async doSomething(): Promise<void> {
    // implementation
  }
}

// Step 4: Register in app.config.ts
providers: [
  {
    provide: MY_SERVICE,
    useClass: MyServiceImpl
  }
]

// Step 5: Use in Application
// application/stores/my-store.ts
import { MY_SERVICE } from '@application/tokens/my-service.token';

const myService = inject(MY_SERVICE);  // ✅ Via token
```

---

### 2. Using Event Bus in Presentation

**❌ WRONG:**
```typescript
// presentation/my-module.ts
import { WorkspaceEventBus } from '@domain/...';  // ❌ Domain import

@Input() eventBus?: WorkspaceEventBus;  // ❌ Domain type
```

**✅ CORRECT:**
```typescript
// presentation/my-module.ts
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';

@Input() eventBus?: IModuleEventBus;  // ✅ Application interface
```

---

### 3. Implementing Module Components

**❌ WRONG:**
```typescript
import { Module } from '@domain/module/module.interface';  // ❌ Domain

export class MyModule implements Module {  // ❌ Domain interface
  // ...
}
```

**✅ CORRECT:**
```typescript
import { IAppModule } from '@application/interfaces/module.interface';  // ✅ Application

export class MyModule implements IAppModule {  // ✅ Application interface
  // ...
}
```

---

### 4. Publishing Events from Modules

**❌ WRONG:**
```typescript
import { ModuleInitialized } from '@domain/module/module-event';  // ❌ Domain event
```

**✅ CORRECT:**
```typescript
import { ModuleInitialized } from '@application/events/module-events';  // ✅ Application DTO

const event: ModuleInitialized = {
  eventId: crypto.randomUUID(),
  eventType: 'ModuleInitialized',
  occurredAt: new Date(),
  moduleId: this.id,
  workspaceId: eventBus.workspaceId
};
eventBus.publish(event);
```

---

### 5. Getting Event Bus in Components

**❌ WRONG:**
```typescript
import { WorkspaceRuntimeFactory } from '@infrastructure/...';  // ❌ Infrastructure

const factory = inject(WorkspaceRuntimeFactory);  // ❌ Direct injection
const runtime = factory.getRuntime(workspaceId);
const eventBus = runtime.eventBus;
```

**✅ CORRECT:**
```typescript
import { ModuleFacade } from '@application/facades/module.facade';  // ✅ Application facade

const facade = inject(ModuleFacade);  // ✅ Via facade
const eventBus = facade.getEventBus(workspaceId);  // ✅ Returns IModuleEventBus
```

---

## 🔍 How to Check for Violations

### Manual Check
```bash
# Check Presentation → Domain violations
grep -r "from.*@domain" src/app/presentation/ --include="*.ts" | grep -v ".spec.ts"

# Check Presentation → Infrastructure violations
grep -r "from.*@infrastructure" src/app/presentation/ --include="*.ts" | grep -v ".spec.ts"

# Check Application → Infrastructure violations
grep -r "from.*@infrastructure" src/app/application/ --include="*.ts" | grep -v ".spec.ts"
```

**Expected output:** (empty) ✅

### Automated Check
```bash
node analyze-dependencies.js
```

**Expected output:**
```
=== DEPENDENCY BOUNDARY VIOLATIONS ===

📦 DOMAIN LAYER VIOLATIONS
✅ No violations found

📦 APPLICATION LAYER VIOLATIONS
✅ No violations found

📦 PRESENTATION LAYER VIOLATIONS
✅ No violations found

Total Violations: 0
```

---

## 📋 Checklist for New Features

### When adding a new feature:

- [ ] Define Domain entities/services in `src/app/domain/`
- [ ] Create Application interfaces in `src/app/application/interfaces/`
- [ ] Create DI tokens if Infrastructure services needed
- [ ] Implement Infrastructure services in `src/app/infrastructure/`
- [ ] Register providers in `app.config.ts`
- [ ] Create Application facades for Presentation
- [ ] Build Presentation components using ONLY Application layer
- [ ] Run `node analyze-dependencies.js` to verify
- [ ] Ensure TypeScript compiles: `npx tsc --noEmit`

---

## 🏗️ Layer Structure

```
src/app/
├── domain/                    # ✅ Imports: NOTHING
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   └── events/
│
├── application/               # ✅ Imports: Domain only
│   ├── interfaces/            # Abstractions for Infrastructure
│   ├── tokens/                # DI tokens
│   ├── adapters/              # Wrap Domain for Presentation
│   ├── events/                # DTOs for Presentation
│   ├── facades/               # Presentation API
│   ├── stores/                # Signal stores
│   └── workspace/             # Use cases
│
├── infrastructure/            # ✅ Imports: Domain (implements)
│   ├── runtime/
│   └── firebase/
│
└── presentation/              # ✅ Imports: Application only
    ├── components/
    ├── containers/
    └── features/
```

---

## 🎓 Key Principles

### 1. Dependency Inversion (DIP)
- High-level modules (Application) don't depend on low-level modules (Infrastructure)
- Both depend on abstractions (interfaces)

### 2. Interface Segregation (ISP)
- Clients (Presentation) shouldn't depend on interfaces they don't use
- Small, focused interfaces

### 3. Single Responsibility (SRP)
- Each layer has one reason to change
- Domain: business rules
- Application: orchestration
- Infrastructure: external concerns
- Presentation: UI

### 4. Open/Closed (OCP)
- Open for extension (new implementations)
- Closed for modification (interfaces stable)

---

## 🚀 Benefits

- ✅ **Testability:** Easy to mock interfaces
- ✅ **Maintainability:** Clear boundaries
- ✅ **Flexibility:** Swap implementations
- ✅ **Scalability:** Add features in correct layers
- ✅ **Team Collaboration:** No accidental coupling
- ✅ **Refactoring Safety:** Changes isolated to layers

---

## ⚠️ Common Mistakes

### 1. Direct Infrastructure Injection
```typescript
// ❌ WRONG
const factory = inject(WorkspaceRuntimeFactory);

// ✅ CORRECT
const factory = inject(WORKSPACE_RUNTIME_FACTORY);
```

### 2. Domain Types in Presentation
```typescript
// ❌ WRONG
implements Module

// ✅ CORRECT
implements IAppModule
```

### 3. Skipping Facade Layer
```typescript
// ❌ WRONG - Presentation calling Infrastructure
const factory = inject(WORKSPACE_RUNTIME_FACTORY);
const runtime = factory.getRuntime(id);

// ✅ CORRECT - Presentation using Facade
const facade = inject(ModuleFacade);
const eventBus = facade.getEventBus(id);
```

---

## 📚 Further Reading

- [PRESENTATION_ARCHITECTURE.md](./PRESENTATION_ARCHITECTURE.md)
- [DDD_BOUNDARY_ENFORCEMENT_SUMMARY.md](./DDD_BOUNDARY_ENFORCEMENT_SUMMARY.md)
- [DDD_ARCHITECTURE_DIAGRAM.md](./DDD_ARCHITECTURE_DIAGRAM.md)

---

**Remember:** When in doubt, check the layer dependency rules at the top! 🎯
