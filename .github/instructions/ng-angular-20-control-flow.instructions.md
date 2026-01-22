---
description: 'Angular 20 control flow enforcement: @if, @for, @switch, @defer syntax requirements, signal integration, forbidden directives'
applyTo: '**/*.html, **/*.ts'
---

# Angular 20 Control Flow Rules

## CRITICAL: Syntax & Signal Requirements

All control flow must use Angular 20 built-in syntax integrated with signals. Legacy structural directives are forbidden.

| Operator | Syntax | Mandatory Features |
|----------|--------|-------------------|
| `@if` | `@if (signal()) {}` with optional `@else` / `@else if` | Signal invocation `()` |
| `@for` | `@for (item of items(); track item.id) {}` | `track` expression + signal |
| `@switch` | `@switch (status()) { @case / @default }` | Signal invocation `()` |
| `@defer` | `@defer (trigger) {}` with `@placeholder` / `@loading` / `@error` | Trigger strategy |

**FORBIDDEN (compilation failure):** `*ngIf`, `*ngFor`, `*ngSwitch`

## Core Constraints

| Rule | Requirement | Violation Consequence |
|------|-------------|----------------------|
| Track Expression | MUST exist in all `@for` loops | Compilation error |
| Track Strategy | Unique ID (`item.id`) or `$index` for static lists | Inefficient re-rendering |
| Track Anti-patterns | Never track by object reference or function call | Memory leaks |
| Signal Integration | Control flow must operate on signals, not plain properties | Loss of reactivity |
| Signal Initialization | Collections: `signal<Item[]>([])`, not `undefined`/`null` | Type errors |
| Type Narrowing | Use `@if (user(); as currentUser)` for nullable access | Excessive non-null assertions |
| @empty Block | Required for user-facing `@for` lists | Poor UX |
| @switch Usage | For >2 branches only; avoid nested `@if` | Code smell |
| Nesting Depth | Max 3 levels; otherwise refactor with `computed()` | Complexity |
| @defer Trigger | Required when rendering >50KB or >100ms | Performance issues |
| @loading Duration | Minimum 500ms to prevent flicker | UI flash |
| Context Variables | Use `$` prefix: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count` | Naming convention |

## @defer Triggers

| Trigger | Use Case |
|---------|----------|
| `on viewport` | Below-the-fold content |
| `on idle` | Non-critical initialization |
| `on interaction` | User-triggered content |
| `on timer(5s)` | Delayed content |
| `prefetch on idle` | Optimize with prefetching |

## Enforcement Summary

**REQUIRED:** `@if`, `@for`, `@switch`, `@defer` syntax; signals with `()`; `track` expressions; `@empty` blocks; `@loading` minimum 500ms.

**FORBIDDEN:** `*ng` directives; plain properties; missing `track`; object/function tracking; deep nesting (>3); undefined/null collections.
