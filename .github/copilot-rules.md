---
Copilot Agent Guardrails — Application Architecture
---

Global Invariants (Non-Negotiable)

The project follows a strict layered architecture:
domain → application → infrastructure → presentation

Dependency direction is one-way only

Any violation of layer boundaries is considered an error

If uncertain, do not generate code



---

Dependency Rules (Hard Constraints)

domain MUST NOT import from any other layer

application MUST NOT import from presentation

presentation MUST NOT import from domain or infrastructure

infrastructure MUST NOT be imported by domain or presentation

Only application MAY coordinate between layers


Allowed dependency graph:

presentation → application → domain
application  → infrastructure

No other dependency paths are allowed.


---

Domain Layer Rules (src/app/domain/)

Purpose: Pure business logic, framework-independent.

Domain code MUST be pure TypeScript

Domain code MUST NOT import Angular, RxJS, Firebase, or any framework

Entities MUST NOT contain UI state, DTOs, or persistence concerns

Value Objects MUST be immutable and validated at creation time

Aggregates MUST be the only consistency boundaries

Domain Events MUST be immutable definitions only

Repositories MUST be interfaces only

Repository interfaces MUST return domain entities or primitives wrapped in Promises

Domain layer MUST NOT depend on application, infrastructure, or presentation


If a concern is not pure business logic, it DOES NOT BELONG in domain.


---

Application Layer Rules (src/app/application/)

Purpose: State management and orchestration.

Application layer MUST coordinate domain logic

Application layer MUST NOT contain UI logic

Stores MUST be the single source of truth for application state

Only Angular Signals are allowed for state

RxJS MUST NOT be used for state

Commands MUST represent write use cases

Queries MUST represent read models

Handlers MUST execute commands or react to events

Facades MUST NOT contain business rules

Facades MAY be omitted if Stores are consumed directly

Mappers MUST handle DTO ↔ Entity transformations


If logic coordinates multiple domain objects, it belongs here.


---

Infrastructure Layer Rules (src/app/infrastructure/)

Purpose: Frameworks, SDKs, and external systems.

Infrastructure code MAY depend on Angular, Firebase, SDKs, or external APIs

Infrastructure code MUST implement interfaces defined in domain or application

Infrastructure MUST NOT contain business rules

Infrastructure MUST NOT leak DTOs outside this layer

DTOs MUST be confined to infrastructure

SDK wrappers MUST NOT expose framework-specific details upward


If code touches IO, network, storage, or SDKs, it belongs here.


---

Presentation Layer Rules (src/app/presentation/)

Purpose: UI and user interaction only.

Presentation MUST NOT contain business logic

Presentation MUST NOT mutate domain entities directly

Presentation MUST consume state via application stores or facades

Only Signals are allowed as reactive primitives

Containers MUST inject stores or facades only

Containers MUST NOT inject infrastructure services

Components MUST be dumb and UI-only

Components MUST communicate via Inputs / Outputs only


If code decides what should happen, it does not belong here.


---

File Placement Enforcement

Entities, Value Objects → domain

Use cases, state coordination → application

Firebase, HTTP, persistence → infrastructure

Components, layouts, styling → presentation


When unsure, do not guess. Ask or stop.


---

Copilot Execution Rules

Never introduce cross-layer imports

Never move code across layers unless explicitly instructed

Never “optimize” architecture

Never infer missing rules

Follow these constraints even if existing code violates them



---

Final Self-Check (Mandatory)

Before generating or modifying code:

Would this change compile if layer imports were strictly enforced?

Does this introduce a new dependency direction?

Does this add logic to a forbidden layer?


If any answer is “maybe”, do not proceed.


---

This document is authoritative.
If instructions conflict, this file wins.


---

