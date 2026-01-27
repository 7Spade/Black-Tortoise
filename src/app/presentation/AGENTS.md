# Presentation Layer Agent Directives

> **Context**: `src/app/presentation`
> **Role**: Passive View (Pure Signal Consumer)
> **Dependency**: Depends on `Application` (Facades/Stores). **Forbidden**: Direct `Infrastructure` or `Domain Entity` manipulation.

## 🪒 Occam's Razor Principle
*   **Logic-Free Templates**: If you need an `@if` with more than 2 conditions (`A && B || !C`), move it to a `computed()` signal in the ViewModel.
*   **CSS over JS**: If CSS can solve layout/animation, don't use Angular Animations or TS.

## ⚡ Strict Zone-less Patterns

### 1. Signal-Only Templates (The "No AsyncPipe" Rule)
*   **RULE**: Templates must **ONLY** bind to Signals (`{{ vm().title }}`).
*   **FORBIDDEN**: `AsyncPipe` (`| async`) is **BANNED**.
    *   *Reason*: `AsyncPipe` relies on `markForCheck`/Zone hooks which are legacy concepts in a pure Signal architecture.
*   **Solution**: Observables (Events, Route params) MUST be converted via `toSignal()` in the component setup/constructor/injection context.

### 2. Angular 20+ Control Flow
*   **MANDATORY Syntax**:
    *   `@if (signal()) { ... } @else { ... }`
    *   `@for (item of list(); track item.id) { ... }`  <-- `track` is non-negotiable!
    *   `@switch (type()) { @case(...) ... }`
    *   `@defer (on viewport)` for optimizing heavy blocks.
*   **BANNED**: `*ngIf`, `*ngFor` imports.

### 3. Component Architecture
*   **Smart Components**:
    *   Inject `Stores` or `Facades`.
    *   Input via `input.required()`.
*   **Dumb Components**:
    *   Purely data-in (`input()`), event-out (`output()`).
    *   No Service injections.
*   **Change Detection**: `ChangeDetectionStrategy.OnPush` is the default, but Signals make the view refresh granularly.

### 4. Styles (Tailwind + M3)
*   **Utility-First**: Use Tailwind classes for structural layout (`flex`, `grid`, `p-4`).
*   **Theming**: Use Material Design Tokens via CSS variables (`var(--sys-primary)`) for consistent coloring.
