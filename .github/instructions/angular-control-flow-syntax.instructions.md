---
description: 'Angular 20+ Control Flow Syntax Standards - Mandatory Use of New Control Flow'
applyTo: '**/*.html,**/*.component.ts'
---

# Angular 20+ Control Flow Syntax Standards

## Core Principles

Angular 20 introduces an entirely new built-in control flow syntax that completely replaces the old structural directives. The new syntax provides better type inference, performance optimization, and development experience.

## Absolutely Forbidden

- Structural directive `*ngIf`
- Structural directive `*ngFor`
- Structural directive `*ngSwitch` and related directives

## Required New Syntax

### Conditional Rendering: @if / @else / @else if
- Replace all `*ngIf` use cases
- Support multiple conditional branches
- Support inline variable declaration (as syntax)
- Better type narrowing

### List Rendering: @for / @empty
- Replace all `*ngFor` use cases
- **Mandatory** track expression to optimize rendering performance
- Provide built-in `@empty` block for handling empty lists
- Can use built-in variables like `$index`, `$first`, `$last`, `$even`, `$odd`

### Conditional Switch: @switch / @case / @default
- Replace `*ngSwitch` series directives
- More concise syntax structure
- Better readability

### Lazy Loading: @defer
- Performance optimization feature new in Angular 20
- Support multiple trigger conditions (viewport, idle, interaction, hover, immediate, timer)
- Provide `@placeholder`, `@loading`, `@error` blocks
- Can significantly reduce initial bundle size

## Track Expression Best Practices

### Must Obey
- Every `@for` must provide a track expression
- Prefer using unique identifiers (such as id)
- Avoid using object references as track values

### Selection Strategy
- **Best**: Use business unique key (item.id, item.uuid)
- **Good**: Use composite key (combination of multiple attributes)
- **Acceptable**: Use index `$index` (only for static, unchanging lists)
- **Avoid**: Using entire object or unstable values

## @defer Usage Timing

### Suitable Scenarios
- Large or heavy computation components
- Non-critical above-the-fold content
- Third-party packages or external dependencies
- Analytics, tracking, and other secondary functions
- Low-priority UI elements

### Trigger Condition Selection
- **viewport**: Load when component enters visible area (most common)
- **idle**: Load when browser is idle
- **interaction**: Load after user interaction
- **hover**: Load on mouse hover
- **immediate**: Load immediately (for preloading)
- **timer**: Load after specified time

## Migration Checklist

### Phase One: Basic Migration
- [ ] Search and replace all `*ngIf` with `@if`
- [ ] Search and replace all `*ngFor` with `@for`
- [ ] Add appropriate track expression to each `@for`
- [ ] Search and replace all `*ngSwitch` with `@switch`

### Phase Two: Optimization
- [ ] Identify list rendering where `@empty` can be used
- [ ] Evaluate opportunities for using `@defer`
- [ ] Review if complex conditions can be simplified to `@else if`
- [ ] Confirm track expression performance

### Phase Three: Verification
- [ ] Execute complete test suite
- [ ] Check rendering performance metrics
- [ ] Verify type inference correctness
- [ ] Confirm no legacy syntax remains

## Common Error Patterns

### Error 1: Missing track expression
Problem: `@for` block lacks track, causing compilation error

### Error 2: Incorrect @empty placement
Problem: `@empty` block not immediately after `@for`

### Error 3: Mixing old and new syntax
Problem: Mixing `*ngIf` and `@if` in same template

### Error 4: Improper track choice
Problem: Using unstable values or object references as track

## Performance Considerations

### Control Flow Optimization
- New syntax has more aggressive compile-time optimization
- Less runtime overhead
- Better tree-shaking effects

### Track Function Impact
- Correct track prevents unnecessary DOM operations
- Wrong track may cause component recreation
- Affects list update performance

### @defer Benefits
- Reduce initial bundle size (up to 30-50%)
- Improve First Contentful Paint (FCP)
- On-demand loading reduces memory usage

## Type Safety Enhancement

New control flow syntax provides better TypeScript integration:
- More precise type narrowing
- Better null/undefined checking
- Inline variable type inference
- Earlier compilation error detection

## Compatibility Notes

- New control flow supported from Angular 17+
- Complete migration recommended in Angular 20
- Old syntax still usable but not recommended for new projects
- Future versions may deprecate old structural directives

## Learning Resources

Refer to official documentation for deeper understanding:
- Angular Official Control Flow Guide
- Performance Optimization Documentation
- Migration Tools and Automation Scripts