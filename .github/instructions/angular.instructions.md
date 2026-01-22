---
description: 'Angular Development Rules - TypeScript, Signals, and Modern Best Practices'
applyTo: '**'
---

# Angular Development Rules

## CRITICAL: Before generating any Angular code
- Always use standalone components unless modules are explicitly required
- Enable strict mode in `tsconfig.json` for type safety
- Use Angular Signals (`signal()`, `computed()`, `effect()`) for state management
- Angular >= 19:
  - Use `input()`, `output()`, `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()`
  - Do NOT use decorators for these
- Angular < 19:
  - Use decorators for inputs, outputs, and view queries
- Follow Angular Style Guide

## Component/Service scaffolding
- Use Angular CLI:
  - Components: `ng generate component`
  - Services: `ng generate service`
  - Pipes: `ng generate pipe`
- Naming conventions:
  - Components: `feature.component.ts`
  - Services: `feature.service.ts`
- Structure:
  - Smart components handle data/state
  - Presentational components use inputs/outputs

## TypeScript standards
- Define clear interfaces/types for all entities
- Use type guards, union types
- Proper error handling (e.g., `catchError`)
- Typed reactive forms (`FormGroup<T>`, `FormControl<T>`)
- Avoid `any` without explicit justification

## State management with Signals
- `signal()` for writable state
- `computed()` for derived state
- `effect()` for side effects
- Manage loading/error states with signals
- Use `AsyncPipe` for observables
- Do NOT manually subscribe in components

## Data fetching
- Use `HttpClient` with typed responses
- Use `inject()` in standalone components
- Implement caching (`shareReplay`)
- Store API data in signals
- Handle errors via interceptors
- Pipeline:
  - Service: typed interfaces → HttpClient → convert to signals
  - Component: consume signals

## Security requirements
- Sanitize user inputs
- Implement route guards
- Use `HttpInterceptor` for CSRF and auth headers
- Validate reactive forms
- Do NOT manipulate DOM directly

## Styling
- Component-level encapsulation (`ViewEncapsulation.Emulated`)
- Prefer SCSS
- Responsive design: CSS Grid, Flexbox, CDK Layout
- Follow Material theming if used
- Maintain accessibility (a11y, ARIA, semantic HTML)

## Performance optimization
- Production builds with `ng build --configuration production`
- Lazy load routes
- OnPush change detection with signals
- Use `trackBy` in loops
- Optional: SSR/SSG with Angular Universal

## Testing
- Unit tests: Jasmine + Karma
- Use `TestBed` with mocks
- Test signal-based updates
- E2E: Cypress or Playwright
- Mock HTTP: `provideHttpClientTesting`
- Ensure high coverage for critical functionality

## General guidelines
- Follow Angular Style Guide
- Use CLI for boilerplate
- Document with JSDoc
- Ensure WCAG 2.1 accessibility
- Use Angular i18n if needed
- Keep code DRY with utilities/shared modules
- Organize by feature modules or domains
- Use DI effectively
