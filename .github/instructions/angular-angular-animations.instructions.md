---
description: 'Angular Animations: trigger-based animations, state transitions, and performance optimization for zone-less architecture'
applyTo: '**/*.ts'
---

# @angular/animations Implementation Instructions

## CRITICAL: Animation Provider Requirement

**REQUIRED in app.config.ts:**
- `provideAnimations()` MUST be included in application providers
- NEVER use `provideNoopAnimations()` in production
- Test environments ONLY MAY use `provideNoopAnimations()`

## Animation Module Usage

**REQUIRED:**
- Import `BrowserAnimationsModule` OR use `provideAnimations()` for standalone
- NEVER mix module-based and standalone animation providers
- Define animations in component metadata using `animations` property

## Trigger-Based Animation Pattern

**REQUIRED structure:**
- Use `trigger()` to define animation name and states
- Use `state()` for discrete animation states
- Use `transition()` to define state changes
- Use `style()` for CSS properties
- Use `animate()` for timing and easing

**FORBIDDEN:**
- Inline animation definitions in templates
- JavaScript-based animations where CSS transitions suffice
- Animations without proper cleanup in `ngOnDestroy()`

## Performance Optimization

**REQUIRED:**
- Animations MUST use GPU-accelerated properties: `transform`, `opacity`
- NEVER animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `:enter` and `:leave` aliases for route transitions
- Implement `@.disabled` binding for accessibility preferences

## Zone-less Compatibility

**REQUIRED for zone-less Angular:**
- Animations work with zone-less architecture without modification
- NEVER manually trigger change detection for animations
- Use `@defer` with animations for deferred rendering

## State Management Integration

**REQUIRED with NgRx Signals:**
- Animation state MUST derive from signal values
- NEVER mutate component state within animation callbacks
- Use `[@triggerName]="signal()"` binding syntax

**FORBIDDEN:**
- Storing animation state outside signals
- Side effects in animation callbacks
- Manual animation state synchronization

## Testing

**REQUIRED:**
- Use `provideNoopAnimations()` in test configuration
- NEVER test animation timing in unit tests
- Integration tests MAY verify animation presence

## Enforcement Checklist

**REQUIRED:**
- `provideAnimations()` in app config
- GPU-accelerated properties only
- Signal-based animation state
- No animation-triggered side effects

**FORBIDDEN:**
- `provideNoopAnimations()` in production
- CPU-intensive animation properties
- Manual change detection for animations
- Animation state outside signals
