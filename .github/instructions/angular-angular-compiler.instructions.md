---
description: 'Angular Compiler: AOT compilation, template syntax, and build optimization for zone-less Angular applications'
applyTo: '**/*.ts'
---

# @angular/compiler Implementation Instructions (Presentation Layer Only)

==================================================
SCOPE DEFINITION (MANDATORY)
==================================================

Angular Compiler usage is PRESENTATION-ONLY.

Compiler settings and template logic MUST NOT:
- Trigger domain logic
- Invoke Application Use Cases
- Access repositories or infrastructure

Templates exist ONLY for UI rendering, signal consumption, and view updates.

==================================================
AOT Compilation Requirement
==================================================

REQUIRED:
- Ahead-of-Time (AOT) compilation MUST be enabled
- NEVER deploy with JIT compilation to production
- `ng build --configuration production` MUST be used

FORBIDDEN:
- JIT compilation in production
- Development mode in production
- Disabling AOT optimizations

==================================================
Template Syntax Requirements
==================================================

REQUIRED:
- Template expressions MUST be side-effect free
- Template bindings MUST use signals with `()` invocation
- Complex logic MUST reside in computed signals

FORBIDDEN:
- Method calls in templates
- Side effects in template expressions
- Accessing private component members in templates

==================================================
Strict Template Type Checking
==================================================

REQUIRED:
- `strictTemplates: true` in tsconfig.json
- `fullTemplateTypeCheck: true` as minimum
- NEVER disable template type checking

FORBIDDEN:
- Suppressing template errors with `any`
- Ignoring type errors leading to runtime exceptions

==================================================
Template Optimization
==================================================

REQUIRED:
- Use `@defer` for lazy component loading
- Use `track` expressions in all `@for` loops
- Minimize template expression complexity

FORBIDDEN:
- Missing `track` in loops
- Complex calculations in templates
- Unnecessary template bindings

==================================================
Build Configuration
==================================================

REQUIRED (angular.json):
- `optimization: true` for production
- `buildOptimizer: true` for production
- `outputHashing: all` for cache busting
- `sourceMap: false` for production

FORBIDDEN:
- Development settings in production
- Source maps in production builds
- Unoptimized production bundles

==================================================
Zone-less Compatibility
==================================================

REQUIRED:
- Templates MUST NOT rely on automatic change detection
- Signal changes MUST trigger view updates
- NEVER call `ChangeDetectorRef.detectChanges()` manually

==================================================
Custom Elements Compilation
==================================================

REQUIRED:
- Use `@angular/elements` with AOT compilation
- NEVER create custom elements with JIT

==================================================
Template Guards
==================================================

REQUIRED:
- Use type guards for template conditions
- Leverage TypeScript strict null checks
- NEVER use non-null assertions in templates

==================================================
Performance Optimization
==================================================

REQUIRED:
- Enable template caching during development
- Use incremental compilation for builds
- Minimize template bundle size

==================================================
Testing
==================================================

REQUIRED:
- Verify AOT compilation in CI pipeline
- Test template type checking errors
- Validate production build configuration

==================================================
Enforcement Checklist
==================================================

REQUIRED:
- AOT compilation for production
- `strictTemplates: true` in tsconfig
- Side-effect free template expressions
- `track` expressions in all `@for` loops
- Production build optimization enabled

FORBIDDEN:
- JIT compilation in production
- Complex template logic in templates
- Missing template type checking
- Template expressions with side effects
- Non-null assertions in templates
