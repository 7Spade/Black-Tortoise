---
description: 'Angular Common: pipes, directives, HTTP client, and common utilities for zone-less Angular applications'
applyTo: '**/*.ts'
---

# @angular/common Implementation Instructions

## CRITICAL: Control Flow Migration

**REQUIRED in Angular 20:**
- Use `@if`, `@for`, `@switch`, `@defer` built-in control flow
- NEVER use `*ngIf`, `*ngFor`, `*ngSwitch` structural directives
- Migration MUST be complete before production deployment

**FORBIDDEN:**
- Structural directives in new code
- Mixing old and new control flow syntax

## Pipes Usage

**REQUIRED built-in pipes:**
- `AsyncPipe` ONLY for observables without `toSignal()` conversion
- `DatePipe` for date formatting
- `CurrencyPipe` for monetary values
- `DecimalPipe` for number formatting
- `JsonPipe` for debugging only

**FORBIDDEN:**
- `AsyncPipe` when signals are available
- Custom pipes with side effects
- Stateful pipes without `pure: false` declaration

## HTTP Client Integration

**REQUIRED pattern:**
- Inject `HttpClient` in services, NEVER in components
- Use `toSignal()` to convert HTTP observables to signals
- NEVER subscribe manually in components
- Error handling MUST use `tapResponse()` in stores

**FORBIDDEN:**
- Direct HTTP calls in components
- Manual subscriptions without cleanup
- Missing error handling
- Storing HTTP state outside signals

## Common Directives

**REQUIRED:**
- `NgClass` with signal binding: `[ngClass]="classSignal()"`
- `NgStyle` with signal binding: `[ngStyle]="styleSignal()"`
- `NgOptimizedImage` for all images (performance)

**FORBIDDEN:**
- `NgClass`/`NgStyle` with object literals (use computed signals)
- Standard `<img>` tags (use `NgOptimizedImage`)
- `NgIf`/`NgFor`/`NgSwitch` (use built-in control flow)

## Location and Navigation

**REQUIRED:**
- Use `Location` service for URL manipulation
- NEVER manipulate `window.location` directly
- Use `Router` for navigation, not `Location.go()`

## Document and Platform

**REQUIRED:**
- Inject `DOCUMENT` token, NEVER access global `document`
- Use `isPlatformBrowser()` for SSR compatibility
- NEVER assume browser environment

## Date and Locale

**REQUIRED:**
- Configure locale in app providers: `provideLocaleId()`
- Use `DatePipe` with locale parameter
- NEVER use `Date.toLocaleString()` directly

## Performance Optimization

**REQUIRED:**
- Pure pipes ONLY unless stateful behavior essential
- Memoize pipe transformations for expensive operations
- Use `OnPush` change detection with pipes

## Testing

**REQUIRED:**
- Mock `HttpClient` with `provideHttpClientTesting()`
- Test pipes in isolation
- Verify SSR compatibility with `isPlatformBrowser()`

## Enforcement Checklist

**REQUIRED:**
- Built-in control flow (`@if`, `@for`, `@switch`)
- `HttpClient` in services with `toSignal()`
- `NgOptimizedImage` for all images
- `DOCUMENT` injection over global access
- Pure pipes as default

**FORBIDDEN:**
- Structural directives
- `AsyncPipe` with available signals
- Direct `document`/`window` access
- Manual HTTP subscriptions in components
- Stateful pipes without declaration
