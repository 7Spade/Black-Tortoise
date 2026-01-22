# Quick Start: DDD + Clean Architecture in Black-Tortoise

## Layer Overview

```
src/app/
├── domain/          ← Pure business logic (no dependencies)
├── application/     ← Use cases, facades, interfaces
├── infrastructure/  ← External services, implementations
└── presentation/    ← UI components, only uses Application
```

## Import Rules

### ✅ ALLOWED
```typescript
// Presentation → Application
import { WorkspaceFacade } from '@application/workspace/workspace.facade';
import { PresentationStore } from '@application/stores/presentation.store';

// Application → Domain
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';
import { WorkspaceEventBus } from '@domain/workspace/workspace-event-bus';

// Infrastructure → Application (interfaces only)
import { IWorkspaceRuntimeFactory } from '@application/interfaces/workspace-runtime-factory.interface';
```

### ❌ FORBIDDEN
```typescript
// ❌ Presentation → Domain (use Application facades instead)
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';

// ❌ Presentation → Infrastructure (use Application layer)
import { WorkspaceRuntimeFactory } from '@infrastructure/runtime/workspace-runtime.factory';

// ❌ Application → Presentation
import { SomeComponent } from '@presentation/components/some.component';

// ❌ Application → Infrastructure (use DI tokens)
import { WorkspaceRuntimeFactory } from '@infrastructure/runtime/workspace-runtime.factory';

// ❌ Domain → ANY outer layer
import { anything } from '@application/...';
```

## Quick Checklist

### Adding a New Feature

1. **Domain Layer** (if needed)
   - [ ] Create entity/value object
   - [ ] Define domain events
   - [ ] Define repository interface
   - [ ] Pure TypeScript only

2. **Application Layer**
   - [ ] Create use case or add to existing facade
   - [ ] Define DTOs/interfaces if needed
   - [ ] Create DI token for infrastructure needs
   - [ ] Update application/index.ts barrel export

3. **Infrastructure Layer** (if needed)
   - [ ] Implement application/domain interfaces
   - [ ] Register in app.config.ts with DI token
   - [ ] Handle external dependencies

4. **Presentation Layer**
   - [ ] Create component with `inject()` DI
   - [ ] Inject facades/stores only
   - [ ] Use `@if/@for` control flow
   - [ ] Use `ChangeDetectionStrategy.OnPush`

## Common Patterns

### Component Pattern
```typescript
import { Component, inject } from '@angular/core';
import { WorkspaceFacade } from '@application/workspace/workspace.facade';

@Component({
  selector: 'app-my-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (facade.currentWorkspace(); as workspace) {
      <h1>{{ workspace.name }}</h1>
    }
  `
})
export class MyComponent {
  protected readonly facade = inject(WorkspaceFacade);
}
```

### Facade Pattern
```typescript
// application/facades/my.facade.ts
import { Injectable, inject } from '@angular/core';
import { MyDomainService } from '@domain/services/my-domain.service';

@Injectable({ providedIn: 'root' })
export class MyFacade {
  private readonly domainService = inject(MyDomainService);
  
  doSomething(): void {
    this.domainService.execute();
  }
}
```

### Infrastructure with DI Token
```typescript
// 1. Define interface in Application
// application/interfaces/my-service.interface.ts
export interface IMyService {
  method(): void;
}

// 2. Create DI token
// application/tokens/my-service.token.ts
export const MY_SERVICE = new InjectionToken<IMyService>('MY_SERVICE');

// 3. Implement in Infrastructure
// infrastructure/my-service.impl.ts
@Injectable()
export class MyServiceImpl implements IMyService {
  method(): void { /* implementation */ }
}

// 4. Register in app.config.ts
providers: [
  { provide: MY_SERVICE, useClass: MyServiceImpl }
]

// 5. Use in Application
export class MyFacade {
  private readonly myService = inject(MY_SERVICE);
}
```

## Verification

Run boundary check:
```bash
# Check for violations
grep -r "from '@domain" src/app/presentation --include="*.ts" | grep -v ".spec.ts"
grep -r "from '@infrastructure" src/app/application --include="*.ts" | grep -v ".spec.ts"
grep -r "from '@presentation" src/app/application --include="*.ts" | grep -v ".spec.ts"
```

Should all return empty (0 violations).

## Need Help?

- See `DDD_ENFORCEMENT_COMPLETE.md` for full details
- See `Black-Tortoise_Architecture.md` for architecture overview
- See `DDD_BOUNDARY_QUICK_REFERENCE.md` for rules reference

## Key Principles

1. **Dependencies flow inward** (Presentation → Application → Domain)
2. **Domain is pure** (no outer dependencies)
3. **Infrastructure implements interfaces** (defined in Application/Domain)
4. **Presentation only uses facades/stores** (never direct domain/infrastructure)
5. **Use modern Angular 20+** (@if/@for, inject(), signals)
