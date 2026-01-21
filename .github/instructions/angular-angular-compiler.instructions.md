---
description: 'Angular Compiler: AOT compilation, template syntax, and build optimization for production deployments'
applyTo: '**/*.ts'
---

# @angular/compiler Implementation Instructions

## CRITICAL: AOT Compilation Requirement

**REQUIRED for production:**
- Ahead-of-Time (AOT) compilation MUST be enabled
- NEVER deploy with JIT compilation to production
- `ng build` MUST use `--configuration production`

**FORBIDDEN:**
- JIT compilation in production builds
- Development mode in production
- Disabling AOT optimizations

## Template Syntax Requirements

**REQUIRED:**
- Template expressions MUST be side-effect free
- Template bindings MUST use signals with `()` invocation
- NEVER use complex logic in templates

**FORBIDDEN:**
- Method calls in template bindings (use computed signals)
- Side effects in template expressions
- Template expressions accessing private component members

## Strict Template Type Checking

**REQUIRED in tsconfig.json:**
- `strictTemplates: true` for production code
- `fullTemplateTypeCheck: true` as minimum
- NEVER disable template type checking

**VIOLATION:** Runtime errors, null reference exceptions

## Template Optimization

**REQUIRED:**
- Use `@defer` for lazy component loading
- Use `track` expressions in `@for` loops
- Minimize template expression complexity

**FORBIDDEN:**
- Missing `track` in `@for` loops
- Complex calculations in templates
- Unnecessary template bindings

## Build Configuration

**REQUIRED angular.json settings:**
- `optimization: true` for production
- `buildOptimizer: true` for production
- `outputHashing: all` for cache busting
- `sourceMap: false` for production

**FORBIDDEN:**
- Development settings in production
- Source maps in production builds
- Unoptimized production bundles

## Template Compilation Errors

**REQUIRED resolution:**
- Fix all template type errors before deployment
- NEVER use `any` to suppress template errors
- Use proper typing for template variables

## Zone-less Compatibility

**REQUIRED:**
- Templates MUST NOT rely on automatic change detection
- Signal changes MUST trigger view updates
- NEVER manually call `ChangeDetectorRef.detectChanges()`

## Custom Elements Compilation

**REQUIRED for custom elements:**
- Use `@angular/elements` with AOT compilation
- NEVER create custom elements with JIT

## Template Guards

**REQUIRED for type narrowing:**
- Use type guards in template conditions
- Leverage TypeScript strict null checks
- NEVER use non-null assertions in templates

## Performance Optimization

**REQUIRED:**
- Enable template caching during development
- Use incremental compilation for builds
- Minimize template bundle size

## Testing

**REQUIRED:**
- Verify AOT compilation in CI pipeline
- Test template type checking errors
- Validate production build configuration

## Enforcement Checklist

**REQUIRED:**
- AOT compilation for production
- `strictTemplates: true` in tsconfig
- Side-effect free template expressions
- `track` expressions in all `@for` loops
- Production build optimization enabled

**FORBIDDEN:**
- JIT compilation in production
- Complex template logic
- Missing template type checking
- Template expressions with side effects
- Non-null assertions in templates
