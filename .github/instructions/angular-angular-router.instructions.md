---
description: 'Angular Router: navigation, route guards, lazy loading, parameters, and functional guards for routing configuration'
applyTo: '**/*.ts'
---

# @angular/router Implementation Instructions

## Functional Guards

REQUIRED:

* Use functional guards with inject()
* Return boolean | UrlTree for navigation decisions
* NEVER use class-based guards

FORBIDDEN:

* CanActivate, CanLoad class interfaces
* Guards without inject() for dependencies
* Missing navigation redirects (return boolean only)

## Route Configuration

REQUIRED:

* Lazy loading with loadChildren or loadComponent
* Specific routes before general routes
* Wildcard route (**) at end for 404 handling
* pathMatch: 'full' for empty path redirects

FORBIDDEN:

* Eager loading of feature routes
* Wildcard before specific routes
* Missing 404 route handling

## Lazy Loading

REQUIRED:
{
path: 'feature',
loadComponent: () => import('./feature/feature.component')
}

FORBIDDEN:

* Direct component imports in routes
* Module-based lazy loading in new code
* Missing lazy loading for large features

## Guard Types and Usage

REQUIRED:

* canActivate for route access control
* canActivateChild for child route protection
* canDeactivate for preventing navigation with unsaved changes
* canMatch for conditional route loading

FORBIDDEN:

* Guards with side effects
* Async guards without proper typing
* Missing error handling in guards

## Route Parameters

REQUIRED:

* Use toSignal(route.params, { initialValue }) for parameter access
* Use toSignal(route.queryParams, { initialValue }) for query params
* NEVER manual subscriptions to route observables

FORBIDDEN:

* Direct route.params.subscribe()
* Missing initialValue in toSignal()
* Parameter subscriptions without cleanup

## Navigation Methods

REQUIRED:

* Programmatic: router.navigate(['/path'])
* Template: [routerLink]="['/path']"
* Guard redirect: router.createUrlTree(['/login'])

FORBIDDEN:

* Direct URL manipulation
* window.location for navigation
* Hardcoded navigation paths

## Route Ordering

REQUIRED:

1. Static routes (exact paths)
2. Dynamic routes (with parameters)
3. Wildcard routes (**)

FORBIDDEN:

* Wildcard before specific routes
* Unordered route configuration
* Overlapping route paths

## Route Guards Implementation

REQUIRED:
export const authGuard: CanActivateFn = (route, state) => {
const authStore = inject(AuthStore);
if (authStore.isAuthenticated()) {
return true;
}
const router = inject(Router);
return router.createUrlTree(['/login']);
};

FORBIDDEN:

* Class-based guards
* Guards returning only boolean
* Missing redirect logic

## Router State Management

REQUIRED:

* Current route in NgRx Signals store
* Route data accessed via toSignal()
* Navigation state for loading indicators

FORBIDDEN:

* Route state outside signals
* Manual route state tracking
* Unmanaged navigation state

## Preloading Strategy

REQUIRED:

* Configure preloading in provideRouter()
* Use PreloadAllModules or custom strategy
* Optimize for user experience

FORBIDDEN:

* Missing preloading configuration
* Preloading all routes without strategy
* Unoptimized route loading

## Route Resolvers

REQUIRED:

* Use functional resolvers with inject()
* Return data or redirect
* Handle errors appropriately

FORBIDDEN:

* Class-based resolvers
* Resolvers without error handling
* Synchronous resolvers for async data

## Child Routes

REQUIRED:

* Use children array for nested routes
* <router-outlet> in parent component
* Proper guard inheritance

FORBIDDEN:

* Flat route structure for nested UIs
* Missing router outlet
* Duplicate route definitions

## Route Data and Metadata

REQUIRED:

* Use data property for static metadata
* Access via route.data signal
* Include breadcrumb and title data

FORBIDDEN:

* Dynamic data in data property
* Missing route metadata
* Untyped route data

## Error Handling

REQUIRED:

* 404 route for unknown paths
* Error page for navigation failures
* User-friendly error messages

FORBIDDEN:

* Navigation errors without handling
* Generic error pages
* Silent navigation failures

## Router Events

REQUIRED:

* Use toSignal(router.events) for event monitoring
* Filter events with RxJS operators before conversion
* NEVER manual event subscriptions

FORBIDDEN:

* Direct router.events.subscribe()
* Missing event cleanup
* Unfiltered router events

## Testing

REQUIRED:

* Mock Router and ActivatedRoute
* Test guard logic independently
* Verify navigation flows
* Test route parameter handling

FORBIDDEN:

* Skipping navigation tests
* Missing guard tests
* Untested route configurations

## Performance Optimization

REQUIRED:

* Lazy load feature routes
* Preload critical routes
* Minimize route configuration size

FORBIDDEN:

* Eager loading all routes
* Large upfront route bundles
* Unoptimized route structure

## Enforcement Checklist

REQUIRED:

* Functional guards with inject()
* Lazy loading with loadComponent/loadChildren
* toSignal() for route params with initialValue
* Wildcard route (**) at end
* pathMatch: 'full' for redirects
* createUrlTree() for guard redirects
* Proper route ordering
* 404 error route

FORBIDDEN:

* Class-based guards
* Eager loading of features
* Manual route subscriptions
* Wildcard before specific routes
* Missing initialValue in signals
* Boolean-only guard returns
* Navigation without error handling
