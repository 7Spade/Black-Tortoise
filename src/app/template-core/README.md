# Template Module: Event Sourcing + Causality Tracking Edition

> **Strict DDD / Angular 20 Signals / Event Sourcing / Firebase**

This module implements a REFERENCE ARCHITECTURE for a **Zone-less Angular 20** application using **Event Sourcing** and **Causality Tracking** with strict DDD boundaries.

It is designed to be a "Live Spec" where every folder has a strict purpose.

## 1. Architectural Layers & Dependency Rule

**Strict Direction:** `Presentation` -> `Application` -> `Domain` <- `Infrastructure`

- **Domain (`template-core/domain`)**: Pure TypeScript. Contains Aggregates, Domain Events, Policies, Factories, Specifications. **NO Framework Dependencies.**
- **Application (`template-core/application`)**: Orchestration & State. Uses DTOs for UI, Mappers for strict separation, and Commands for write operations.
- **Infrastructure (`template-core/infrastructure`)**: Adapters. Implements Persistence and Event Sourcing mechanics.
- **Presentation (`template-core/presentation`)**: UI. Signal-driven "Passive View".

## 2. Event Sourcing Workflow ("The Event Loop")

### Phase 1: Command & Domain Logic
1.  **UI** calls `TemplateStore.addTemplate()`.
2.  **Store** calls `TemplateFactory.createValidTemplate()` (enforcing `TemplateNamingPolicy`).
3.  **Aggregate** (`Template`) generates a `TemplateCreatedEvent` internally.
    *   State is mutated locally via `apply()`.

### Phase 2: Persistence (Infrastructure)
4.  **Repository** (`TemplateFirebaseRepository`) is called with the Aggregate.
5.  **Event Store** (`TemplateFirestoreEventStore`):
    *   Persists the event to `events` collection.
    *   **Metadata**: Includes `correlationId`, `causationId`, `timestamp`, `version`.
6.  **Event Bus** (`TemplateRxJsEventBus`):
    *   Publishes the event to subscribers.
7.  **Projection** (Read Model):
    *   Updates the `templates` collection (Snapshot).

### Phase 3: Presentation (Read)
8.  **Store** loads entities via `Repository.findAll()`.
9.  **Mapper** (`TemplateToDtoMapper`) converts Domain Entities to **DTOs** (`TemplateDto`).
10. **UI** renders primitives from DTOs. **Zero leakage of Domain Objects to the View.**

## 3. Directory Structure Explain

- `domain/policies`: Enforce granular business rules (e.g., `TemplateNamingPolicy`).
- `domain/factories`: Encapsulate complex creation logic.
- `domain/specifications`: Encapsulate business rules into boolean logic classes.
- `application/dtos`: Define the "Read Model" contract for the UI.
- `application/mappers`: Strictly convert Domain -> DTO.
- `application/commands`: Define the "Write Model" intent.

## 4. Key Concepts Implementation

### Strict DDD Hierarchy
- **Aggregate Root**: `Template` (Consistency Boundary).
- **Entities**: `TemplateSection` (Child entity managed by Root).
- **Value Objects**: `TemplateId`, `SectionId` (Immutable identity).

### Causality Tracking (Metadata)
Every `TemplateDomainEvent` inherits from the base class which strictly enforces metadata.
- **Correlation ID**: Tracks a business transaction across multiple steps.
- **Causation ID**: Tracks the direct parent (Command or Event) that triggered this event.

## 5. Usage

Events are automatically generated, persisted, and tracked. 
Check browser console for `[TemplateRxJsEventBus]` logs or Firestore `events` collection for the Audit Log.
