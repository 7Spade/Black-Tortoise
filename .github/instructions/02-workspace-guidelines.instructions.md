---
description: "Architecture rules and guidelines for Workspace context and lifecycle management."
applyTo: "**"
---

### Complete Description of Modules and Context in Workspace Logical Containers

Within the workspace logical container, all twelve modules are capabilities provided by the Workspace.
All modules operate under a single and unique Workspace Context, sharing the contextual facts defined by that Context.
The Workspace Context is used to describe "the workspace context in which the current user is located," encompassing the workspace identity, user role and permission snapshots, and the workspace lifecycle state.

The Workspace Context exists solely as a stable, synchronously accessible contextual boundary. It does not carry any module behavior, process control, or application state.
Each module's capability implementation, application state, and internal processes must be completely encapsulated within the module's own boundaries.
Modules must not share or directly access each other's state; cross-module collaboration can only occur through events to maintain high cohesion and low coupling design principles.

---

### Architecture Rules (Final Rule Statement)

1. Workspace Context is the unique Context at the workspace level; the system must not contain any Context organized by module, functionality, or screen.

2. All twelve modules are defined as Capabilities of the Workspace; modules themselves must not assume Context responsibility, nor extend or derive Context.

3. Workspace Context can only carry cross-module contextual facts with immutability or quasi-immutability; it must not carry any module data, process state, or UI state.

4. It is strictly forbidden to write or elevate any module's application state, business data, or process stages to the Workspace Context.

5. Each module must completely own and manage its own capability implementation, application state, and process control; that state must not be read, written, or shared by other modules.

6. Modules must not directly depend on or call each other's internal implementations, Facades, or state access interfaces.

7. The only allowed way for cross-module interaction is through event passing; events only represent that a fact has occurred and must not be used as state query or state synchronization mechanisms.

8. Workspace Context can only be updated when the context itself changes (e.g., role changes or workspace state updates); it must not change due to module behavior.

9. Router Guard and application initialization logic must only depend on Workspace Context for judgment; they must not depend on any module state or event results.

10. Guards must be pure conditional judgment logic; they must not produce side effects, state changes, or event sending behavior.

---

### One Clear and Unmistakable Summary Statement (can be placed at section end)

> Workspace Context only provides stable workspace context and cross-module prerequisites. Each module autonomously manages its own capabilities and state. Cross-module collaboration occurs only through events, ensuring high cohesion, low coupling, and system consistency.
