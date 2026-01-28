---
description: "Architecture rules and guidelines for User as the system's identity and permission subject."
applyTo: "**"
---

---

### User Complete Definition

The User is the most basic operating unit and permission subject in the system.
A User can create Workspaces (logical containers for work), join Organizations, and operate module capabilities within a Workspace.

The User itself does not bear the business logic of the Workspace, does not manage the internal module state of the Workspace, and does not directly intervene in the governance of the Organization.
The User's primary responsibility is to provide Identity and Permission authentication, and to decide which Workspaces they create or participate in.

Users and Organizations together constitute the creators and owners of Workspaces in the system.
The lifecycle, module capabilities, and state of a Workspace are managed by the Workspace Context and the modules themselves; the User only participates in operations through roles and permissions.

---

### User Architecture Rules

1. The User is the **only natural person operating unit in the system that can directly create a Workspace**, and the ownership of the Workspace is automatically attributed to that User.

2. A User can join one or more Organizations, but each Workspace must still explicitly belong to a single User or a single Organization.

3. The User only provides identity and operation permissions and must not directly manage the state or flow of internal modules within the Workspace.

4. The User must not arbitrarily alter the Workspace Context; all Workspace context changes must be completed through Workspace or Organization authorization events.

5. The User's operation permissions for a Workspace must strictly correspond to their role and permission settings; implicit assumptions or deductions are prohibited.

6. A User has no right to directly operate Workspaces owned by other Users unless explicitly authorized (e.g., Organization sharing or invitation).

7. The relationship between User and Workspace is that of "operating subject" and "operated context unit," and the direction of responsibility must not be reversed.

8. The User must not interfere with the governance of an Organization or the autonomous behavior of module capabilities within a Workspace.

---

### One Unambiguous Concluding Sentence

> The User is the operating identity and permission subject, deciding "what I can do and in which Workspace I do it,"
> **while the Workspace and modules operate autonomously, with the User only participating in operations through roles and permissions.**

---
