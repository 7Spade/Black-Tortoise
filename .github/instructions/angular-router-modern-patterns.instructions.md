---
description: 'Angular 20 Router Modern Patterns - Functional Guards & Resolvers'
applyTo: '**/*.routes.ts,**/guards/*.ts,**/resolvers/*.ts'
---

# Angular 20 Router Modern Patterns

## Core Concepts

The Angular routing system introduced functional API in version 15+, replacing traditional class-based Guards and Resolvers. Angular 20 further enhances Standalone Components integration and Signals support.

## Route Configuration Modernization

### Standalone Routes
- Use `provideRouter()` instead of RouterModule
- Load Standalone Components directly in routes configuration
- Support for lazy loading and code splitting
- Simplify module dependency structure

### File Organization
Recommended structure:
- `app.routes.ts` - Main route configuration
- `feature.routes.ts` - Feature module routes
- `guards/` - Functional guards
- `resolvers/` - Functional resolvers

## Functional Guards

### Replacing Class-based Guards
Traditional class-based Guards (CanActivate, CanDeactivate, etc.) have been replaced with functional alternatives:
- More concise syntax
- Better testability
- Support for `inject()` function
- Easier composition and reuse

### Guard Types
- **CanActivateFn**: Protect route activation
- **CanDeactivateFn**: Protect route deactivation
- **CanMatchFn**: Protect route matching
- **CanLoadFn**: Protect lazy loading (integrated into CanMatch)

### Using inject() for Dependency Injection
- Use `inject()` within Guard functions
- Inject Services, Stores, Router, etc.
- Maintain functional purity

### Combining Guards
- Multiple guards combined as arrays
- Guards execute in sequence
- Any guard returning false blocks navigation
- Supports async guards (returning Observable or Promise)

## Functional Resolvers

### Data Preloading Pattern
- Use `ResolveFn` instead of `Resolve` interface
- Load data before route activation
- Avoid flickering and loading states
- Provide better user experience

### Resolver Design Principles
- Only load critical data
- Consider using `defer` or lazy loading for non-critical data
- Handle error cases (return default value or navigate to error page)
- Keep resolvers lightweight

### Integration with Signals
- Resolver-returned data can be converted to Signal
- Use `toSignal()` to integrate into component
- Maintain reactive data flow

## Route Parameter Handling

### Input Binding
Use `withComponentInputBinding()`:
- Route parameters automatically bind to component Input
- Reduce boilerplate code
- Support query parameters and route data
- Better type safety

### Parameter Change Listening
- Use `input()` Signal function to receive route parameters
- Automatically respond to parameter changes
- Combine with `effect()` or `computed()` for side effects

## Route State Management

### Router State as Signal
- Use `toSignal(router.events)` to track route events
- Use Signal to manage current route state
- Integrate with @ngrx/signals

### Navigation State
- Use `NavigationExtras` to pass state
- Receive in target component using `Router.getCurrentNavigation()`
- Suitable for passing transient data (like confirmation messages)

## Lazy Loading Strategy

### Route-level Lazy Loading
- Use `loadComponent` to load Standalone Component
- Use `loadChildren` to load child routes
- Automatic code splitting
- Reduce initial bundle size

### Preloading Strategy
- `PreloadAllModules`: Preload all lazy routes
- `NoPreloading`: No preloading
- Custom preloading strategy: Implement `PreloadingStrategy`
- Adjust based on network conditions or user behavior

### Data Prefetching
- Use Resolvers to prefetch critical data
- Use `@defer` to lazy load secondary content
- Balance initial load and user experience

## Route Animation

### Transition Animation Configuration
- Use `@angular/animations` to define route transitions
- Set `data: { animation: '...' }` in route configuration
- Use animation trigger on `RouterOutlet`
- Provide smooth page switching experience

### Performance Considerations
- Avoid overly complex animations
- Use CSS transforms and opacity
- Consider user device performance
- Provide animation disable option (accessibility consideration)

## Navigation Handling

### Programmatic Navigation
- Use `Router.navigate()` or `Router.navigateByUrl()`
- Returns Promise<boolean> indicating navigation success
- Handle navigation failure cases
- Use relative or absolute paths

### Navigation Cancellation
- Listen to `NavigationCancel` event
- Handle cases where user cancels or Guard blocks
- Provide appropriate user feedback

### Error Handling
- Listen to `NavigationError` event
- Global error handler
- Navigate to error page
- Log errors for debugging

## Advanced Patterns

### Multi-level Routes (Nested Routes)
- Use `children` to define child routes
- Multiple `<router-outlet>` support
- Shared layout component
- Breadcrumb navigation support

### Named Route Outlets (Named Outlets)
- Use `outlet` property to define named outlet
- Support parallel display of multiple routes
- Suitable for modal, sidebar scenarios
- Independent navigation history

### Route Reuse Strategy
- Implement `RouteReuseStrategy`
- Control whether component is reused
- Optimize performance and user experience
- Maintain form state or scroll position

## Security Considerations

### Authentication Guards
- Check user login status
- Redirect to login page
- Save original URL for return after login
- Handle token expiration

### Authorization Guards
- Check user permissions or roles
- Block unauthorized access
- Display appropriate error messages
- Log unauthorized attempts

### Data Protection
- Avoid passing sensitive data in URL
- Use POST request for large or sensitive data
- Validate route parameter input
- Prevent URL manipulation attacks

## Testing Strategy

### Guards Testing
- Use `TestBed` to set up test environment
- Mock dependent Services
- Test various authorization scenarios
- Verify redirect logic

### Resolvers Testing
- Test data loading logic
- Mock HTTP requests
- Test error handling
- Verify return value type

### Route Navigation Testing
- Use `RouterTestingModule` or `provideRouter()`
- Simulate navigation events
- Verify route state
- Test parameter passing

## Performance Optimization

### Bundle Size Optimization
- Maximize lazy loading usage
- Remove unused routes
- Analyze bundle size
- Use webpack-bundle-analyzer

### Initial Load Optimization
- Load only essential routes for first screen
- Use PreloadingStrategy for intelligent preloading
- Optimize Guards and Resolvers performance
- Reduce initial dependencies

### Memory Management
- Ensure components are properly destroyed
- Unsubscribe (automatic management with `toSignal()`)
- Avoid memory leaks
- Use RouteReuseStrategy carefully

## Accessibility

### Keyboard Navigation
- Ensure all routes are accessible via keyboard
- Appropriate focus management
- Skip content link
- Reasonable tab order

### Screen Reader Support
- Announce page title on route change
- Use `<title>` or ARIA live regions
- Provide navigation landmarks
- Appropriate semantic HTML

## Common Patterns and Anti-patterns

### ✅ Good Patterns
- Use functional Guards and Resolvers
- Maximize lazy loading usage
- Use `withComponentInputBinding()`
- Centralize error handling
- Keep route configuration flat and clear

### ❌ Avoid
- Using outdated class-based Guards
- Overly nested route structure
- Passing sensitive data in URL
- Ignoring navigation errors
- Lack of appropriate loading states

## Migration Guide

### Migrating from Class-based to Functional
1. Identify all class-based Guards and Resolvers
2. Convert to functional implementation
3. Use `inject()` instead of constructor injection
4. Update route configuration
5. Update tests

### Introducing Signals
1. Use `input()` to receive route parameters
2. Use `toSignal()` to convert route events
3. Integrate @ngrx/signals to manage route state
4. Progressive refactoring

## Learning Resources

- Angular official routing documentation
- Functional Guards and Resolvers guide
- Standalone Components best practices
- Route performance optimization recommendations