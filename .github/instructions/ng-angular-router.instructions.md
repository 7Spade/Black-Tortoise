---
description: 'Angular Router enforcement: lazy loading, route guards, parameter handling, and navigation constraints'
applyTo: '**'
---

# Angular Router Rules

## CRITICAL: Lazy Loading

ALL feature modules MUST use lazy loading. Eager loading is FORBIDDEN.

**REQUIRED pattern:**
```typescript
{
  path: 'feature',
  loadChildren: () => import('./feature/feature.routes')
    .then(m => m.FEATURE_ROUTES)
}
```

**FORBIDDEN:**
- Eager module imports in routing
- Direct component imports in root routes
- Feature modules without lazy loading

**VIOLATION consequences:**
- Increased initial bundle size
- Slower application startup
- Poor performance metrics

## Route Guard Implementation

**REQUIRED functional guard pattern:**
```typescript
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
```

**REQUIRED:**
- Functional guards with `inject()`
- Return boolean or `UrlTree`
- Navigation redirect on failure

**FORBIDDEN:**
- Class-based guards (deprecated)
- Guards without navigation handling
- Synchronous guards for async operations

**Guard types enforcement:**
- `canActivate` → route access control
- `canActivateChild` → child route protection
- `canDeactivate` → prevent navigation with unsaved changes
- `canMatch` → conditional route loading

## Route Parameter Handling

**REQUIRED Signal integration:**
```typescript
userId = toSignal(
  this.route.params.pipe(map(params => params['id'])),
  { initialValue: null }
);

filter = toSignal(
  this.route.queryParams.pipe(map(params => params['filter'])),
  { initialValue: '' }
);
```

**REQUIRED:**
- `toSignal()` for reactive parameter access
- `initialValue` for synchronous rendering
- Observable cleanup via signal conversion

**FORBIDDEN:**
- Manual subscriptions to route params
- Missing cleanup for route observables
- Direct param access without reactivity

## CRITICAL: Error Routes

**REQUIRED fallback configuration:**
```typescript
{ path: '**', component: NotFoundComponent }
```

**REQUIRED:**
- 404 route at end of configuration
- Error handling for navigation failures
- User-friendly error pages

**FORBIDDEN:**
- Missing wildcard route
- Unhandled navigation errors
- Silent navigation failures

## Route Configuration Constraints

**REQUIRED:**
- Default redirect: `{ path: '', redirectTo: '/home', pathMatch: 'full' }`
- `pathMatch: 'full'` for empty path redirects
- Route ordering: specific → general → wildcard

**FORBIDDEN:**
- Ambiguous route patterns
- Missing `pathMatch` for redirects
- Wildcard route before specific routes

## Navigation Constraints

**REQUIRED navigation methods:**
- Programmatic: `router.navigate(['/path'])`
- Template: `[routerLink]="['/path']"`
- Guard-based: `router.createUrlTree(['/path'])`

**FORBIDDEN:**
- Direct location manipulation
- Hard-coded URL strings
- Navigation without route validation

## Testing Requirements

**REQUIRED test coverage:**
- Navigation flows
- Guard behavior (allow/deny)
- Parameter handling
- Error scenarios

**FORBIDDEN:**
- Untested route guards
- Missing navigation tests
- Undocumented routing logic

## Enforcement Summary

**REQUIRED in ALL routes:**
- Lazy loading via `loadChildren()`
- Functional guards with proper return types
- Signal-based parameter handling
- Wildcard error route

**FORBIDDEN in ALL routes:**
- Eager feature module loading
- Class-based guards
- Manual route param subscriptions
- Missing error handling
