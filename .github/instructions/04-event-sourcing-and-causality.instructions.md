---
description: "Architecture rules and best practices for event-driven modules, event sourcing, and causality tracking."
applyTo: "**"
---

1️⃣ Core Elements and Roles

Event Producer: The source that generates events (business operations, state changes)

Event Type: Event type, used to distinguish different event streams

Event Payload: Business data carried by the event

Event Metadata: Additional information about the event (ID, timestamp, source, Lifecycle status, etc.)

Event Semantics: The meaning or behavior description of the event

Event Lifecycle: Event status (New → Published → Consumed → Completed / Failed)

Event Store (Event Sourcing): Immutable event log for history tracking and replay

Event Bus: Event distribution pipeline supporting multi-subscriber reactive distribution

Event Consumer: Event handler that can generate derived events

Causality Tracking: Derived events retain parent event ID, forming event causal chains



---

2️⃣ Pure Reactive Interaction Flow

sequenceDiagram
    participant Producer
    participant EventBus
    participant EventStore
    participant Consumer

    %% Event Generation
    Producer->>EventBus: emit Event (Type, Payload, Metadata, Semantics)
    
    %% Event Store (Side Recording)
    EventBus-->>EventStore: persist Event (Event Sourcing)
    
    %% Event Bus Pushes to Consumer
    EventBus-->>Consumer: reactive push of Event
    
    %% Consumer Processes and Generates Derived Event
    Consumer-->>EventBus: emit Derived Event (with parent ID for Causality Tracking)
    
    %% Event Store Records Derived Event
    EventBus-->>EventStore: persist Derived Event

    %% Lifecycle Tracking (Illustration)
    Note over EventBus,Consumer: Event Lifecycle: New → Published → Consumed → Completed


---

3️⃣ Element Relationship Concept Diagram

[Event Producer] --emit--> [Event Bus] --push--> [Event Consumer]
                        |
                        |--side effect--> [Event Store]
                        |
                        |--tracks--> [Event Lifecycle, Event Metadata, Event Semantics]
                        
[Event Consumer] --emit derived--> [Event Bus] --push--> [Event Consumer 2...]
                        |
                        |--side effect--> [Event Store]
                        |
                        |--tracks--> [Causality Tracking]


---

4️⃣ Characteristics

1. Pure Reactive

Event flow is passive signal/stream response

Producer does not wait for Consumer, nor blocks

Event Bus automatically pushes to all subscribers



2. Complete Event Tracking

Payload, Metadata, Semantics, Lifecycle accompany the event throughout

Event Store creates immutable snapshots supporting replay

Causality Tracking records parent events, forming DAGs



3. Event Sourcing & Reactive Flow Combined

Each event is source data, capable of triggering real-time logic and supporting history reconstruction

Derived events form chain reactions, maintaining causal transparency





---
### One Clear and Unmistakable Summary Statement (can be placed at section end)

> Event flow design adheres to principles of "pure reactivity, event immutability, and traceable causality,"
> enabling modules to decouple and collaborate through events, maintaining transparent and reproducible system state.