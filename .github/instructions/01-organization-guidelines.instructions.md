---
description: "Architecture rules for Organization governance over Workspaces."
applyTo: "**"
---

### Organization Complete Definition

The Organization is the upper-level unit in the system carrying user governance and Workspace attribution,
responsible for defining "who is qualified to create and manage Workspaces," and the attribution relationship of Workspaces.

The Organization itself does not carry any business context within the Workspace,
nor does it participate in capability operation, process control, or state management within the Workspace.

A Workspace must be created by a User or an Organization,
and every Workspace must explicitly belong to a single User or a single Organization.
There must be no Workspace in the system that does not belong to a User or an Organization.

The Organization only defines the governance prerequisites for Workspace creation and existence;
once a Workspace is established, its internal behavior is entirely the responsibility of the Workspace context and module capabilities.

---

### Organization Architecture Rules

1. User and Organization are the **only subjects in the system permitted to create a Workspace (logical container for work)**.

2. Any Workspace must belong to and only belong to one User or one Organization; it must not belong to multiple subjects simultaneously.

3. It is strictly prohibited in the system to create a Workspace that does not belong to a User or an Organization.

4. The Organization is only responsible for Workspace governance and attribution relationships and must not participate in any internal business context, capability implementation, or process control of the Workspace.

5. The Organization must not directly read, write, or influence the state or data of any module within the Workspace.

6. After a Workspace is created, its internal lifecycle and behavior must not retroactively rely on the state or processes of the Organization.

7. The relationship between Organization and Workspace is that of "governor" and "governed context unit," and the direction of responsibility must not be reversed.

8. The Organization must not serve as a state aggregation center for multiple Workspaces or a coordinator across Workspaces.

9. A User's operation permissions for a Workspace must be explicitly defined via the Organization or the User-Workspace relationship and must not be implicitly deduced.

10. Before creating a Workspace, any system entry point must first establish its belonging User or Organization identity.

---

### One Unambiguous Concluding Sentence

> User / Organization decides "who can create a Workspace,"
> Workspace decides "how to operate within this Workspace,"
> **Organization governance does not enter the Workspace, and Workspace behavior does not flow back to the Organization.**

