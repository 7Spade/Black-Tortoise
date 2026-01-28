---
name: DDD Standard Architecture Rules
description: Comprehensive rules for DDD-based application architecture, including layer boundaries, dependency directions, state ownership, and strict separation of concerns between Domain, Application, Infrastructure, and Presentation layers.
license: MIT
---

# DDD Standard Architecture Rules

## 1. Overall Architecture and Layer Definition

1. The system must be clearly divided into **Domain, Application, Infrastructure, and Presentation** four layers.  
2. Each file can only belong to one layer and must not assume multiple layer responsibilities simultaneously.  
3. The purpose of layering is to isolate "business intent" from "technical details", and layers must not be merged for convenience.  
4. Architecture design must be guided by long-term evolution and minimization of replacement costs.  

## 2. Dependency Direction (Must Not Violate)

5. Only the following unidirectional dependencies are allowed:  
   **Domain → Application → Infrastructure → Presentation**  
6. Any reverse dependency is considered an architecture error.  
7. Reverse dependencies must not be formed indirectly through types, utility functions, barrel exports, or side-effects.  
8. The direction of dependencies must be statically analyzable at the TypeScript `import` level.  

## 3. Domain Layer Rules (Business Core)

9. The Domain layer must be pure TypeScript.  
10. The Domain layer must not depend on Angular, RxJS, Signals, HTTP, Storage, or any framework.  
11. The Domain layer must not have `async / await`, `Promise`, or I/O behavior.  
12. The Domain layer only describes "what the business is", not "how to do it".  
13. The Domain layer can only contain:  
    - Entity  
    - Value Object  
    - Domain Service  
    - Domain Interface  
14. Entities must have explicit identity.  
15. Value Objects must be immutable.  
16. Domain Services can only express business rules that cannot naturally belong to a single Entity.  
17. Domain Interfaces only describe capabilities, not implementation.  
18. The Domain layer must not know where data comes from, how it is stored, or how it is displayed.  

## 4. Application Layer Rules (Business Process and State Coordination)

19. The Application layer is responsible for "Use Cases" and business process orchestration.  
20. The Application layer is the single source of truth for all business state in the system.  
21. The Application layer can depend on Domain, but must not reversely depend on Presentation or Infrastructure implementations.  
22. The Application layer can only depend on Infrastructure **interface definitions**, not concrete classes.  
23. The Application layer is responsible for transaction boundaries and process sequencing.  
24. The Application layer must not contain UI, DOM, Component, or Template-related concepts.  
25. The Application layer must not contain data access details.  
26. The Application layer must not leak framework types to other layers.  
27. **Application Facade** is the only entry point that Presentation is allowed to access.  

## 5. Infrastructure Layer Rules (Technical Implementation)

28. The Infrastructure layer is only responsible for implementing interfaces defined by Domain or Application.  
29. The Infrastructure layer can depend on frameworks and third-party libraries.  
30. The Infrastructure layer must not contain business rules or decision logic.  
31. The Infrastructure layer must not independently become the source of truth for state.  
32. The Infrastructure layer must not require upper layers (Application / Domain) to adjust their design to accommodate technical details.  
33. The Infrastructure layer must not expose framework-specific types externally.  
34. The Infrastructure layer can be replaced without affecting Domain and Application.  

## 6. Presentation Layer Rules (UI and Interaction)

35. The Presentation layer is only responsible for display and user interaction.  
36. The Presentation layer must not contain business rules.  
37. The Presentation layer must not independently define business state truth.  
38. The Presentation layer can only depend on Application Facade.  
39. The Presentation layer must not directly call Infrastructure.  
40. The Presentation layer must not bypass Application to directly manipulate Domain.  
41. Presentation layer state can only be short-lived UI state.  

## 7. State and Responsibility Boundaries

42. The Domain layer does not hold application state.  
43. The Application layer centrally manages all business state.  
44. The Infrastructure layer must not hold long-lived business state.  
45. The Presentation layer must not hold business state across pages or flows.  
46. Any state can only have a single source of truth.  

## 8. Interface and Abstraction Rules

47. The interface definition location must belong to the consumer, not the implementer.  
48. Interfaces required by Application must be defined in Application or Domain.  
49. Infrastructure can only implement interfaces, must not reverse-define requirements.  
50. Interfaces must not leak technical details.  

## 9. Shared and Common Module Rules

51. `shared` must not become the business core.  
52. `shared` must not contain business state or decisions.  
53. If `shared` is viewed as a business dependency by multiple features, its level must be moved up to Application or Domain.  
54. `shared` is only allowed to contain:  
    - Pure utilities  
    - Pure UI  
    - Pure stateless components  

## 10. Structure and Naming Consistency

55. Folder structure must reflect layering and responsibility.  
56. File names and folder names must directly suggest which layer they belong to.  
57. Naming must not appear semantically inconsistent with actual responsibility.  
58. Barrel exports must not obscure layer boundaries.  

## 11. Validation and Evolution Rules

59. Domain must be compilable and testable independently of any framework.  
60. Application must be runnable and testable without a UI.  
61. Infrastructure must be mockable or replaceable.  
62. Replacement of Presentation must not affect business logic.  
63. Architecture rules must be verifiable through linting, testing, or CI.  
