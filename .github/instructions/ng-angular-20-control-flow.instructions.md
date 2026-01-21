---
description: 'Angular 20 control flow enforcement: @if, @for, @switch, @defer syntax requirements, signal integration constraints, and deprecated directive prohibition'
applyTo: '**/*.html, **/*.ts'
---

# Angular 20 Control Flow Rules

## CRITICAL: Syntax & Signal Requirements

ALL control flow MUST use built-in syntax with signals. Structural directives FORBIDDEN.

| Operator | Syntax | Mandatory Features |
|----------|--------|-------------------|
| `@if` | `@if (signal()) {}` with optional `@else` / `@else if` | Signal invocation `()` |
| `@for` | `@for (item of items(); track item.id) {}` | `track` expression + signal |
| `@switch` | `@switch (status()) { @case / @default }` | Signal invocation `()` |
| `@defer` | `@defer (on trigger) {}` with `@placeholder` / `@loading` / `@error` | Trigger strategy |

**FORBIDDEN (compilation failure):** `*ngIf`, `*ngFor`, `*ngSwitch`

## Core Constraints

| Rule | Requirement | Violation Consequence |
|------|-------------|----------------------|
| **Track Expression** | MUST exist in ALL `@for` loops | Compilation error |
| **Track Strategy** | By unique ID (`item.id`) or `$index` for static lists ONLY | Inefficient re-rendering |
| **Track Anti-patterns** | NEVER by object reference or function call | Memory leaks |
| **Signal Integration** | ALL control flow operates on signals, NOT plain properties | No reactivity |
| **Signal Initialization** | Collections: `signal<Item[]>([])` NOT `undefined`/`null` | Type errors |
| **Type Narrowing** | Multiple nullable access → `@if (user(); as currentUser)` | Repeated `!` assertions |
| **@empty Block** | REQUIRED for user-facing `@for` lists | Poor UX |
| **@switch Usage** | Use for >2 branches, NOT nested `@if` | Code smell |
| **Nesting Depth** | Max 3 levels, else refactor with `computed()` | Complexity |
| **@defer Trigger** | Required when >50KB or >100ms render | Performance |
| **@loading Duration** | MUST specify `minimum 500ms` to prevent flicker | UI flash |
| **Context Variables** | Use `$` prefix: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count` | Convention |

## @defer Triggers

| Trigger | Use Case |
|---------|----------|
| `on viewport` | Below-the-fold content |
| `on idle` | Non-critical initialization |
| `on interaction` | User-triggered content |
| `on timer(5s)` | Delayed content |
| `prefetch on idle` | Optimize with prefetching |

## Enforcement Summary

**REQUIRED:** `@if/@for/@switch/@defer` syntax, signals with `()`, `track` expressions, `@empty` blocks, `@loading (minimum 500ms)`

**FORBIDDEN:** `*ng` directives, plain properties, missing `track`, object/function tracking, deep nesting (>3), undefined/null collections
