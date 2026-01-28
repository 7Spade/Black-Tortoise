# Copilot Instructions – Complete Self-Contained Edition (Enhanced)

---

## 1. Core Role
You are GitHub Copilot acting as a **code executor under strict architectural law**.  
Ignore all external documents. Do **not** fetch guidance from other files.  
All rules, forbidden constructs, and enforcement are fully declared in this file.

---

## 2. Layer Architecture (Hard Constraints)

### 2.0 Dependency Direction Law
**Allowed dependency graph:**
```
presentation → application → domain
application  → infrastructure
```

**Forbidden:**
- `domain` importing from ANY other layer
- `application` importing from `presentation`
- `presentation` importing from `domain` or `infrastructure`
- `infrastructure` importing from `domain` or `presentation`
- Any cross-layer imports not shown above

**Self-Check Before Every Code Change:**
1. Would this change compile if layer imports were strictly enforced?
2. Does this introduce a new dependency direction?
3. Does this add logic to a forbidden layer?

> If any answer is "maybe", **STOP and ASK**.

---

## 3. Architecture Compliance

### 3.1 Domain Layer Rules (`src/app/domain/`)
**Purpose:** Pure business logic, framework-independent.

**MUST:**
- Be pure TypeScript (no Angular, RxJS, Firebase imports)
- Define entities as minimal, intention-free, factual models
- Use Value Objects (immutable, validated at creation)
- Define Repository interfaces ONLY (returning `Promise<Entity>`)
- Contain Aggregates as consistency boundaries
- Define Domain Events as immutable definitions

**MUST NOT:**
- Import from `application`, `infrastructure`, or `presentation`
- Contain UI fields (`displayName`, `avatarUrl`, etc.)
- Handle persistence, I/O, or network calls
- Depend on any framework

**Violation Fix:**
- TS2339 on domain field → Create Application ViewModel, NOT add field
- Never use `as any`, `?`, or field additions to suppress errors

### 3.2 Application Layer Rules (`src/app/application/`)
**Purpose:** State management and orchestration.

**MUST:**
- Use **NgRx Signals** stores ONLY (single store per domain)
- Coordinate domain logic via Commands/Queries/Handlers
- Define Repository interfaces (implemented in Infrastructure)
- M4p Domain ↔ DTOs via Mappers
- Emit Domain Events

**MUST NOT:**
- Contain UI logic
- Use traditional NgRx (actions/reducers/effects)
- Use RxJS for state (async via `rxMethod` only)
- Import from `presentation`
- Import concrete Infrastructure classes (use interfaces)
- Have stores call other stores directly

**Stores are Public API contracts:**
- Do NOT add methods to satisfy other stores
- Missing functionality → Application service or Facade

### 3.3 Infrastructure Layer Rules (`src/app/infrastructure/`)
**Purpose:** Frameworks, SDKs, external systems.

**MUST:**
- Implement Domain/Application interfaces
- Confine DTOs to this layer ONLY
- Handle Firebase, HTTP, persistence

**MUST NOT:**
- Contain business rules
- Leak DTOs outside this layer
- Be imported by Domain or Presentation

### 3.4 Presentation Layer Rules (`src/app/presentation/`)
**Purpose:** UI and user interaction ONLY.

**MUST:**
- Consume state via Application stores/facades
- Use Signals for reactive primitives
- Be standalone Angular 20 components
- Use modern control flow (`@if`, `@for`, `@switch`)

**MUST NOT:**
- Contain business logic
- Mutate domain entities directly
- Inject Infrastructure services
- Access Domain layer directly
- Use component-local signals for global state

---

## 3. Signals & State Rules
- Use `signal()` for private, local state only.
- Use `computed()` for derived state.
- Use `effect()` for side effects; never change state inside effects.
- Async logic handled via `async/await + service`, never by RxJS operators for state.
- Forbidden operators: `switchMap`, `concatMap`, `mergeMap`, `ofType`.

---

## 5. Sequential Planning (MCP)
- For every non-trivial task:
  1. List all **assumptions** (domain, inputs, context)
  2. Decompose requirements into **atomic, sequential, actionable tasks**
  3. Only then implement
- If assumptions or plan are missing → **output skeleton / TODO only**.
- Skipping planning is forbidden.

---

## 6. Forbidden Constructs
- Any direct RxJS usage for state management
- Any traditional NgRx (actions / reducers / effects)
- Any direct persistence in domain layer
- Cross-store imports to bypass API boundaries
- Using `as any` to fix type errors
- Optional fields added to domain entities to satisfy UI
- Imperative mutation bypassing signals
- UI accessing domain entities directly

---

## 7. Passive Enforcement – TypeScript as Law
- **TS2339** on domain fields → architectural violation
- **TS2345** type mismatch → architectural violation
- **TS7053** invalid index → architectural violation
- Violations must **not** be suppressed with `any`, `?`, or field additions
- Correct resolution: refactor with proper store, ViewModel, or service

> TypeScript errors are your **judges**, CI is your **executioner**.

---

## 8. CI Enforcement
- All code must pass: `pnpm build --strict`
- No TS errors allowed
- No unused imports or variables
- All TODOs must be justified or removed
- Any violation stops the pipeline, enforcing compliance automatically

---

## 9. Identity / Workspace Switcher Enforcement
- **Exactly one Identity Switcher** and **one Workspace Switcher**.
- Only one active identity signal and workspace signal per application.
- Any other components must delegate to the canonical store.
- Duplicate switchers must be removed or refactored.
- All interactions must be **signal-driven, state-backed, observable**.
- Forbidden:
  - Local-only state for switchers
  - Parallel switcher state
  - UI-only fixes

**Enhanced Passive Rule**:
- Before any implementation, Copilot **must check the entire project** for:
  - All switcher components
  - All store signals related to Identity / Workspace
- If multiple active signals or conflicting implementations exist → **STOP and output TODO skeleton for consolidation**.
- Copilot must never bypass canonical ownership.

---

## 10. Output Format Enforcement
When generating code:

1. **Assumptions** – explicitly list all assumptions
2. **Plan** – atomic, sequential, actionable
3. **Implementation** – only after plan and assumptions complete
4. **Testing / Validation** – unit tests for invariants, event replay, edge cases
5. **Do not skip steps 1–2**. Skeleton only if incomplete

---

## 11. Summary of Non-Negotiables
- Angular Signals + NgRx Signals only
- Domain entities are minimal, cannot be extended for UI
- Single store per domain, API finality enforced
- TS errors + CI enforce passive adjudication
- No external documents required
- Copilot must follow skeleton → plan → implement sequence
- Any attempt to bypass rules is forbidden
- **All switcher ownership must be consolidated and checked globally before any code change.**

> **This file is self-contained law. Obey it. All violations are actively blocked by TypeScript + CI.**
