---
description: 'Copilot prompt to automatically convert code into pure reactive implementations'
agent: 'agent'
---

Project Background:
- Angular 20
- Signals as the core reactive state
- Strict DDD architecture (Application / Domain / Infrastructure / Presentation layers)
- TypeScript as the primary language
- Firebase / NgRx Signals may be used in Infrastructure / Application layers

Generation Rules:
1. Automatically detect imperative or side-effect-heavy code and convert it into pure reactive code using Signals or other reactive constructs.
2. Preserve original functionality and business logic.
3. Ensure all reactive code is side-effect-free and declarative.
4. Maintain file and folder structure consistent with DDD layers.
5. Include comments explaining the reactive transformation for clarity.

Tasks:
- Scan existing code or new code snippets
- Convert to pure reactive style
- Keep skeleton/template structure where applicable
