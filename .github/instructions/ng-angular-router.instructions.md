---
description: 'Angular Router enforcement: lazy loading, route guards, parameter handling, and navigation constraints'
applyTo: '**'
---

# Angular Router Rules

## CRITICAL: Core Requirements

| Rule | Required | Forbidden |
|------|----------|-----------|
| **Lazy Loading** | `loadChildren: () => import(...)` | Eager module imports, direct component imports |
| **Guards** | Functional with `inject()`, return `boolean\|UrlTree` | Class-based guards, missing navigation redirects |
| **Parameters** | `toSignal(route.params, {initialValue})` | Manual subscriptions, missing cleanup |
| **Error Routes** | `{path: '**', component: NotFoundComponent}` at end | Missing wildcard, unhandled errors |
| **Redirects** | `pathMatch: 'full'` for empty paths | Ambiguous patterns, missing pathMatch |
| **Ordering** | Specific → general → wildcard | Wildcard before specific routes |

## Guard Types

- `canActivate` - Route access control
- `canActivateChild` - Child route protection  
- `canDeactivate` - Prevent navigation with unsaved changes
- `canMatch` - Conditional route loading

## Navigation Methods

- Programmatic: `router.navigate(['/path'])`
- Template: `[routerLink]="['/path']"`
- Guard redirect: `router.createUrlTree(['/login'])`

## Testing Checklist

- [ ] Navigation flows tested
- [ ] Guard behavior (allow/deny) covered
- [ ] Parameter handling validated
- [ ] Error scenarios tested
