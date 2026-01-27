---
description: 'Copilot prompt to automatically generate simpler or equivalent implementations'
agent: 'agent'
---

Project Background:
- Angular 20
- Signals as the core reactive state
- Strict DDD architecture (Application / Domain / Infrastructure / Presentation layers)
- TypeScript as the primary language
- Firebase / NgRx Signals may be used in Infrastructure / Application layers

Generation Rules:
1. When generating code, if a simpler or equivalent implementation can achieve the same functionality, automatically use it.
2. Maintain the original functionality and logic; do not change program behavior.
3. Prefer Signals, pure functions, and side-effect-free code.
4. Avoid unnecessary abstractions or RxJS/Observable/Promise wrappers unless required.
5. Keep file and folder structure consistent with DDD layers.
6. Optionally include comments explaining the simplification or equivalent approach for readability.

Tasks:
- Generate skeleton code for a specified feature or module
- Automatically optimize to the simplest and most readable implementation
- Generate skeleton/template only, without business logic
