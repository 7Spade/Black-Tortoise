# Presentation Layer Agent Directives

> **Context**: `src/app/presentation`
> **Role**: Passive View (Pure Signal Consumer)

## ⚡ Strict Zone-less Patterns

### 1. Signal-Only Templates
*   **RULE**: Templates must **ONLY** bind to Signals (`{{ vm().title }}`).
*   **FORBIDDEN**: The `AsyncPipe` (`| async`) is **BANNED**.
*   **Reason**: In Zone-less, `AsyncPipe` relies on `markForCheck` which might be insufficient or inconsistent compared to fine-grained Signal updates.
*   **Solution**: All Observables must be converted to Signals using `toSignal()` in the Facade or Component logic *before* reaching the template.

### 2. Angular 20+ Control Flow
*   **MANDATORY**:
    *   `@if (signal())`
    *   `@for (item of list(); track item.id)`  <-- `track` is required!
    *   `@switch (type())`
    *   `@defer (on viewport)` for heavy components.
*   **BANNED**: `*ngIf`, `*ngFor` imports (CommonModule is mostly unnecessary).

### 3. Component Architecture
*   **Smart Components**: Inject Facades/Stores. Provide input via `input.required()`.
*   **Dumb Components**: Receive Signals/Data via `input()`. Emit events via `output()`.
*   **Change Detection**: `ChangeDetectionStrategy.OnPush` (Default for generated, but conceptually Zone-less relies on Signal graph).

### 4. Styles (Tailwind + M3)
*   **Utility-First**: Use Tailwind classes for layout/spacing.
*   **Material Tokens**: Use CSS variables for colors/typography defined in M3 theme.
*   **No Logic in CSS**: Avoid complex SCSS calculation.

## 🚫 Absolute Prohibitions
1.  **NO Logic in Template**: Call methods in class.
2.  **NO Service Calls in Template**: `{{ service.getData() }}` is forbidden.
3.  **NO Zone Dependency**: Do not use `NgZone`.
