---
description: "Architecture rules and guidelines for Modules as Workspace capabilities, state isolation, and event-driven collaboration."
applyTo: "**"
---

### Complete Description of Workspace

Workspace is the highest-level working unit in the system that carries user collaboration and business behavior,
and is also the contextual boundary and lifecycle boundary for module capability operations.

Workspace is responsible for defining "who is operating in this workspace, what they can do, and whether operations are currently possible,"
but **does not directly participate in any business processes, functional behaviors, or data processing**.

Workspace itself does not implement capabilities, does not store module state, and does not coordinate module processes.
It only provides a stable and consistent working context, enabling all capability modules to operate under the same premises.

Changes to Workspace state are limited to its own contextual level, such as creation, activation, archiving, and permission changes.
All business behaviors are completed independently by modules within the Workspace context.

---

### Workspace Architecture Rules (Final Rule Statement)

1. Workspace is the highest-level working contextual unit in the system; all business capabilities must operate under some Workspace.

2. Workspace itself does not belong to any module, nor can any module depend on it as a functional implementation or process control object.

3. Workspace is only responsible for defining and maintaining the working context; it must not assume any business capability, functional behavior, or data processing responsibility.

4. Workspace must not directly read, write, or coordinate any module's application state or business data.

5. Workspace state only contains contextual-level information, such as Workspace identity, lifecycle state, and member role relationships.

6. Changes to Workspace's lifecycle must not implicitly trigger or cause any module process; it can only announce the fact through events.

7. All modules must operate independently under the context provided by Workspace; they must not assume that Workspace will manage or synchronize their internal state.

8. Workspace must not serve as a coordinator, mediator, or state aggregation center between modules.

9. Any entry point (such as routing, initialization process) must first establish the Workspace context before entering module capability scope.

10. The relationship between Workspace and modules is that of "context provider" and "capability executor"; the direction of responsibility must not be reversed.

---

### One Clear and Unmistakable Summary Statement (can be placed at section end)

> Workspace defines "which workspace this is and whether operations are possible,"
> modules define "what capabilities can be completed in this workspace,"
> **Workspace does not take action; it only defines the prerequisites for action to occur.**

