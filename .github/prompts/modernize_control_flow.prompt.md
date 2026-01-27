---
description: 'Copilot prompt to automatically modernize legacy code into modern control flow'
agent: 'agent'
---

Project Background:
- Angular 20
- Signals as the core reactive state
- Strict DDD architecture (Application / Domain / Infrastructure / Presentation layers)
- TypeScript as the primary language
- Firebase / NgRx Signals may be used in Infrastructure / Application layers

Generation Rules:
1. Automatically detect legacy or imperative code patterns and convert them into modern control flow using Signals, async/await, or other clean, idiomatic patterns.
2. Preserve original functionality and business logic.
3. Avoid unnecessary complexity or over-abstraction.
4. Keep the file and folder structure consistent with DDD layers.
5. Include comments explaining the modernization approach where helpful.

Tasks:
- Scan existing code or new code snippets
- Refactor into modern control flow
- Maintain readability and maintainability
