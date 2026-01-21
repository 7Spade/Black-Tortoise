---
description: 'Angular 20 control flow enforcement: @if, @for, @switch, @defer syntax requirements, signal integration constraints, and deprecated directive prohibition'
applyTo: '**/*.html, **/*.ts'
---

# Angular 20 Control Flow Rules

## CRITICAL: Syntax Requirements

ALL template control flow MUST use built-in syntax. Structural directives are FORBIDDEN.

**REQUIRED control flow operators:**
- `@if` with optional `@else` / `@else if`
- `@for` with MANDATORY `track` expression
- `@switch` with `@case` and `@default`
- `@defer` with optional `@placeholder`, `@loading`, `@error`

**FORBIDDEN deprecated directives:**
- `*ngIf` → Compilation failure
- `*ngFor` → Compilation failure
- `*ngSwitch` / `*ngSwitchCase` / `*ngSwitchDefault` → Compilation failure

**VIOLATION consequences:**
- Migration errors in Angular 20+
- Performance degradation
- Loss of type safety benefits

## CRITICAL: @for Track Expression

`@for` loops MUST include `track` expression. Missing track causes compilation error.

**REQUIRED:**
```typescript
@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```

**FORBIDDEN:**
```typescript
@for (item of items()) {
  <app-item [item]="item" />
}
```

**VIOLATION consequences:**
- Compilation error
- Build failure
- Template parsing failure

## CRITICAL: Signal Integration

Control flow MUST operate on signals. Non-reactive properties are FORBIDDEN in templates.

**REQUIRED pattern:**
```typescript
export class Component {
  items = signal<Item[]>([]);
  isLoading = signal(false);
  status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
}

// Template
@if (isLoading()) {
  <spinner />
}

@for (item of items(); track item.id) {
  <item-card [item]="item" />
}
```

**FORBIDDEN pattern:**
```typescript
export class Component {
  items: Item[] = [];
  isLoading = false;
}
```

**VIOLATION consequences:**
- No reactivity
- Manual change detection required
- Performance degradation

## Track Expression Constraints

**REQUIRED:** Track by unique identifier or `$index`

**ALLOWED patterns:**
```typescript
// Track by unique ID property
@for (user of users(); track user.id) { }
@for (product of products(); track product.uuid) { }

// Track by $index for static lists ONLY
@for (tab of tabs; track $index) { }
```

**FORBIDDEN patterns:**
```typescript
// Track by object reference
@for (item of items(); track item) { }

// Track by function call
@for (item of items(); track getItemId(item)) { }
```

**VIOLATION consequences:**
- Inefficient re-rendering
- Full list re-creation on change
- Memory leaks

## Type Narrowing Enforcement

When accessing nullable signal values multiple times → MUST use type narrowing with `as` keyword.

**REQUIRED:**
```typescript
@if (user(); as currentUser) {
  <div>{{ currentUser.email }}</div>
  <div>{{ currentUser.displayName }}</div>
  <div>{{ currentUser.avatar }}</div>
}
```

**FORBIDDEN:**
```typescript
@if (user()) {
  <div>{{ user()!.email }}</div>
  <div>{{ user()!.displayName }}</div>
  <div>{{ user()!.avatar }}</div>
}
```

## Empty State Enforcement

`@for` loops rendering user-facing lists MUST include `@empty` block.

**REQUIRED:**
```typescript
@for (product of products(); track product.id) {
  <app-product-card [product]="product" />
} @empty {
  <app-empty-state message="No products available" />
}
```

**FORBIDDEN:**
```typescript
@for (product of products(); track product.id) {
  <app-product-card [product]="product" />
}
```

## @defer Trigger Requirements

When component weight >50KB or initial render >100ms → MUST use `@defer` with appropriate trigger.

**REQUIRED triggers:**
```typescript
// Below-the-fold content
@defer (on viewport) {
  <app-comments-section />
}

// Non-critical initialization
@defer (on idle) {
  <app-analytics-tracker />
}

// User interaction
@defer (on interaction) {
  <app-modal-content />
}

// Timed content
@defer (on timer(5s)) {
  <app-promotional-banner />
}

// Prefetch optimization
@defer (on viewport; prefetch on idle) {
  <app-article-content />
}
```

**REQUIRED loading states:**
```typescript
@defer (on viewport) {
  <app-heavy-component />
} @placeholder {
  <div class="skeleton"></div>
} @loading (minimum 500ms) {
  <mat-spinner></mat-spinner>
} @error {
  <div>Failed to load</div>
}
```

## @switch Requirements

Multiple conditional branches (>2) → MUST use `@switch`, NOT nested `@if`.

**REQUIRED:**
```typescript
@switch (status()) {
  @case ('loading') {
    <app-spinner />
  }
  @case ('error') {
    <app-error />
  }
  @case ('success') {
    <app-content />
  }
  @default {
    <app-empty />
  }
}
```

**FORBIDDEN:**
```typescript
@if (status() === 'loading') {
  <app-spinner />
} @else if (status() === 'error') {
  <app-error />
} @else if (status() === 'success') {
  <app-content />
} @else {
  <app-empty />
}
```

## Nesting Depth Constraints

Control flow nesting depth >3 levels → MUST refactor using `computed()` signals.

**REQUIRED refactoring:**
```typescript
// Component
showContent = computed(() => a() && b() && c() && d());

// Template
@if (showContent()) {
  <div>Content</div>
}
```

**FORBIDDEN deep nesting:**
```typescript
@if (a()) {
  @if (b()) {
    @if (c()) {
      @if (d()) {
        <div>Content</div>
      }
    }
  }
}
```

## Context Variable Access

`@for` context variables MUST use `$` prefix.

**REQUIRED:**
```typescript
@for (item of items(); track item.id; let idx = $index, first = $first, last = $last) {
  <div [class.first]="first" [class.last]="last">
    {{ idx + 1 }}. {{ item.name }}
  </div>
}
```

**AVAILABLE context variables:**
- `$index` - Current iteration index
- `$first` - Boolean for first item
- `$last` - Boolean for last item
- `$even` - Boolean for even index
- `$odd` - Boolean for odd index
- `$count` - Total item count

## Signal Type Constraints

Collection signals MUST initialize as empty array, NOT undefined.

**REQUIRED:**
```typescript
items = signal<Item[]>([]);
users = signal<User[]>([]);
```

**FORBIDDEN:**
```typescript
items = signal<Item[] | undefined>(undefined);
items = signal<Item[] | null>(null);
```

## @defer Performance Requirements

`@loading` blocks MUST specify minimum duration ≥500ms to prevent flicker.

**REQUIRED:**
```typescript
@defer (on viewport) {
  <app-content />
} @loading (minimum 500ms) {
  <spinner />
}
```

**FORBIDDEN:**
```typescript
@defer (on viewport) {
  <app-content />
} @loading {
  <spinner />
}
```

## Enforcement Summary

**REQUIRED in ALL templates:**
- `@if`, `@for`, `@switch`, `@defer` syntax ONLY
- Signal invocation `()` for reactive values
- `track` expression in ALL `@for` loops
- Track by unique ID (not object reference)
- `@empty` block for user-facing lists
- Type narrowing with `as` for repeated access
- `@defer` for heavy components (>50KB)

**FORBIDDEN in ALL templates:**
- `*ngIf`, `*ngFor`, `*ngSwitch` directives
- Non-reactive properties in control flow
- Missing `track` expression
- Track by object reference
- Track by function call
- Deep nesting (>3 levels) without refactoring
- Undefined/null for collection signal initialization
- `@loading` without minimum duration
