---
description: 'Angular Common: pipes, directives, HTTP client, and common utilities for zone-less Angular. Presentation-layer only.'
applyTo: '**/*.ts'
---

# @angular/common Implementation Instructions (Presentation Layer Only)

==================================================
SCOPE DEFINITION (MANDATORY)
==================================================

Angular Common usage is PRESENTATION-ONLY.

Common utilities MUST NOT:
- Trigger domain logic
- Invoke Application Use Cases
- Access repositories or infrastructure
- Control business workflows

Common utilities exist ONLY for UI logic, formatting, platform compatibility, and signal integration.

==================================================
Control Flow Migration
==================================================

REQUIRED:
- Use built-in zone-less control flow: `@if`, `@for`, `@switch`, `@defer`
- Fully migrate away from `*ngIf`, `*ngFor`, `*ngSwitch` in new code
- Migration MUST complete before production deployment

FORBIDDEN:
- Mixing old and new control flow syntax
- Structural directives in new code

==================================================
Pipes Usage
==================================================

REQUIRED:
- AsyncPipe ONLY for observables that cannot be converted with `toSignal()`
- DatePipe, CurrencyPipe, DecimalPipe for formatting
- JsonPipe ONLY for debugging
- Pipes MUST be pure unless explicitly declared stateful (`pure: false`)

FORBIDDEN:
- AsyncPipe when signal is available
- Custom pipes with side effects
- Stateful pipes without explicit declaration

==================================================
HTTP Client Integration
==================================================

REQUIRED:
- Inject HttpClient in SERVICES only
- Convert HTTP observables to signals using `toSignal()`
- NEVER subscribe manually in components
- Error handling MUST use `tapResponse()` in stores

FORBIDDEN:
- Direct HTTP calls in components
- Manual subscriptions without cleanup
- Storing HTTP state outside signals

==================================================
Common Directives
==================================================

REQUIRED:
- NgClass with signal binding: `[ngClass]="classSignal()"`
- NgStyle with signal binding: `[ngStyle]="styleSignal()"`
- NgOptimizedImage for all images

FORBIDDEN:
- NgClass/NgStyle with object literals
- Standard `<img>` tags (use NgOptimizedImage)
- Structural directives (`NgIf`, `NgFor`, `NgSwitch`)

==================================================
Location and Navigation
==================================================

REQUIRED:
- Use `Location` service for URL manipulation
- Use `Router` for navigation
- NEVER manipulate `window.location` directly

==================================================
Document and Platform
==================================================

REQUIRED:
- Inject `DOCUMENT` token
- Use `isPlatformBrowser()` for SSR compatibility
- NEVER assume browser environment

==================================================
Date and Locale
==================================================

REQUIRED:
- Configure locale via `provideLocaleId()`
- Use DatePipe with locale parameter
- NEVER use `Date.toLocaleString()` directly

==================================================
Performance Optimization
==================================================

REQUIRED:
- Use pure pipes by default
- Memoize expensive pipe transformations
- OnPush change detection MUST be used with pipes

==================================================
Testing
==================================================

REQUIRED:
- Mock HttpClient with `provideHttpClientTesting()`
- Test pipes in isolation
- Verify SSR compatibility with `isPlatformBrowser()`

==================================================
ENFORCEMENT CHECKLIST
==================================================

REQUIRED:
- Built-in control flow (`@if`, `@for`, `@switch`, `@defer`)
- HttpClient in services only, with `toSignal()`
- NgOptimizedImage for all images
- DOCUMENT injection, no global access
- Pipes pure by default

FORBIDDEN:
- Structural directives
- AsyncPipe with available signals
- Direct document/window access
- Manual HTTP subscriptions in components
- Stateful pipes without declaration
