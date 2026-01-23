# Quick Reference: DDD + Clean Architecture

**Status**: ✅ 100% Compliant  
**Last Verified**: January 23, 2025

---

## Layer Rules (Quick Check)

### ✅ Domain Layer (`src/app/domain`)
```bash
# ALLOWED: Only TypeScript, domain imports
# FORBIDDEN: Angular, RxJS, Firebase, @ngrx

# Quick verify:
grep -r "from '@angular\|from 'rxjs'" src/app/domain --include="*.ts"
# Should return: (empty)
```

### ✅ Application Layer (`src/app/application`)
```bash
# ALLOWED: Domain, @ngrx/signals, DI tokens
# FORBIDDEN: Infrastructure (except DI tokens), Presentation

# Quick verify:
grep -r "async\s" src/app/application/stores --include="*.ts"
# Should return: (empty)
```

### ✅ Infrastructure Layer (`src/app/infrastructure`)
```bash
# ALLOWED: Domain interfaces, RxJS, Firebase, Angular
# FORBIDDEN: Leaking Observable/Firebase types to other layers

# Pattern: Always implement domain interfaces
```

### ✅ Presentation Layer (`src/app/presentation`)
```bash
# ALLOWED: Application (facades/stores), Angular
# FORBIDDEN: Domain, Infrastructure

# Quick verify:
grep -r "from '@domain\|from.*infrastructure'" src/app/presentation --include="*.ts"
# Should return: (empty)

# Control flow verify:
grep -r "\*ngIf\|\*ngFor" src/app/presentation --include="*.html" | grep -v "<!--"
# Should return: (empty)
```

---

## Pattern Cheat Sheet

### signalStore Pattern
```typescript
export const MyStore = signalStore(
  { providedIn: 'root' },
  
  withState({ data: null }),
  
  withComputed((state) => ({
    hasData: computed(() => state.data() !== null)
  })),
  
  withMethods((store) => ({
    setData(data: any): void {
      patchState(store, { data }); // Synchronous only
    }
  }))
);
```

### Component Pattern
```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (data()) {
      <div>{{ data().name }}</div>
    }
  `
})
export class MyComponent {
  private facade = inject(MyFacade);
  readonly data = this.facade.data; // Signal
}
```

### Dependency Inversion
```typescript
// 1. Domain defines interface
export interface Repository {
  save(entity: Entity): Promise<void>;
}

// 2. Application uses abstraction
export const REPO_TOKEN = new InjectionToken<Repository>('...');

// 3. Infrastructure implements
export class FirebaseRepository implements Repository {
  async save(entity: Entity): Promise<void> { }
}

// 4. App config wires it up
{ provide: REPO_TOKEN, useClass: FirebaseRepository }
```

---

## Verification Commands

```bash
# Full compliance check
bash -c '
echo "Domain purity:"
grep -r "from '\''@angular" src/app/domain --include="*.ts" | wc -l

echo "Presentation boundaries:"
grep -r "from '\''@domain" src/app/presentation --include="*.ts" | wc -l

echo "Control flow:"
grep -r "\*ngIf\|\*ngFor" src/app/presentation --include="*.html" | grep -v "<!--" | wc -l

echo "Store async/await:"
grep -r "async\s" src/app/application/stores --include="*.ts" | wc -l
'
# All should return: 0
```

---

## Common Violations (All Fixed ✅)

### ❌ DON'T: Domain importing Angular
```typescript
// WRONG
import { Injectable } from '@angular/core';
export class DomainService { }
```

### ✅ DO: Pure TypeScript
```typescript
// CORRECT
export class DomainService {
  constructor() { }
}
```

### ❌ DON'T: Presentation importing Domain
```typescript
// WRONG
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';
```

### ✅ DO: Use Application layer
```typescript
// CORRECT
import { WorkspaceFacade } from '@application/workspace/workspace.facade';
```

### ❌ DON'T: async/await in stores
```typescript
// WRONG
withMethods((store) => ({
  async loadData() {
    const data = await fetch();
    patchState(store, { data });
  }
}))
```

### ✅ DO: Synchronous patchState
```typescript
// CORRECT
withMethods((store) => ({
  setData(data: any): void {
    patchState(store, { data });
  }
}))
```

### ❌ DON'T: Old control flow
```html
<!-- WRONG -->
<div *ngIf="show">Content</div>
<div *ngFor="let item of items">{{ item }}</div>
```

### ✅ DO: New control flow
```html
<!-- CORRECT -->
@if (show()) {
  <div>Content</div>
}
@for (item of items(); track item.id) {
  <div>{{ item }}</div>
}
```

---

## Dependency Matrix

```
         │ Domain │ App │ Infra │ Pres
─────────┼────────┼─────┼───────┼──────
Domain   │   ✅   │ ❌  │  ❌   │  ❌
App      │   ✅   │ ✅  │  ❌   │  ❌
Infra    │   ✅   │ ✅* │  ✅   │  ❌
Pres     │   ❌   │ ✅  │  ❌   │  ✅

* Via DI tokens only
```

---

## File Structure

```
src/app/
├── domain/               (Pure TS)
│   ├── entities/
│   ├── aggregates/
│   ├── value-objects/
│   ├── repositories/    (interfaces)
│   └── services/
│
├── application/         (@ngrx/signals)
│   ├── stores/         (signalStore)
│   ├── facades/        (Injectable)
│   ├── workspace/      (use cases)
│   └── tokens/         (DI tokens)
│
├── infrastructure/      (RxJS, Firebase)
│   ├── runtime/        (implements EventBus)
│   └── firebase/       (wraps @angular/fire)
│
└── presentation/        (Angular 20)
    ├── containers/     (smart)
    ├── components/     (presentational)
    ├── pages/
    └── shared/
```

---

## Key Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Domain Angular imports | 0 | 0 | ✅ |
| Domain RxJS imports | 0 | 0 | ✅ |
| Pres→Domain imports | 0 | 0 | ✅ |
| Pres→Infra imports | 0 | 0 | ✅ |
| Old control flow | 0 | 0 | ✅ |
| Store async/await | 0 | 0 | ✅ |
| signalStores | 2+ | 2 | ✅ |
| patchState usage | 10+ | 28 | ✅ |

---

## Quick Wins

1. **Always inject facades in components**, never stores directly
2. **Use @if/@for**, never *ngIf/*ngFor
3. **Use patchState synchronously**, never async/await
4. **Define interfaces in domain**, implement in infrastructure
5. **Keep domain pure**, no framework imports

---

## References

- Full report: `DDD_CLEAN_ARCHITECTURE_VERIFICATION.md`
- Summary: `ARCHITECTURE_ENFORCEMENT_SUMMARY.md`
- Changes: `CHANGES.md` (2025-01-23 entry)

---

**Quick check passed?** → You're maintaining clean architecture! ✅  
**Quick check failed?** → Review the full verification report and fix violations.

