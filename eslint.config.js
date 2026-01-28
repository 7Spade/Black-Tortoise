/**
 * ESLint Configuration - Architecture Lock
 * 
 * Source: PR Comment 3796307372
 * Purpose: Enforce event-sourced DDD architecture boundaries and state mutation control
 * 
 * ARCHITECTURE RULES ENFORCED:
 * 
 * 1. PRESENTATION LAYER (src/app/presentation/):
 *    ✓ No imports of EventBus/EventStore/PublishEventUseCase internals
 *    ✓ No direct calls to publish()/append()/publishBatch()/appendBatch() APIs
 *    ✓ No state mutation APIs (patchState/Store.set/Store.update) except in tests
 *    ✓ Use Application facades, stores (read-only), or IModuleEventBus for event communication
 *    ✓ No Domain or Infrastructure imports (use Application layer)
 * 
 * 2. APPLICATION LAYER (src/app/application/):
 *    ✓ Can create domain events but must not mutate presentation stores directly
 *    ✓ Stores (*.store.ts) can define mutation methods using patchState/set/update
 *    ✓ Store mutation methods should ONLY be called from *.event-handlers.ts or *.projection.ts
 *    ✓ Other application files must not call patchState/set/update directly
 *    ✓ No Infrastructure or Presentation imports
 *    ✓ Orchestrates Domain via use cases and facades
 * 
 * 3. DOMAIN LAYER (src/app/domain/):
 *    ✓ No framework imports (Angular/NgRx/RxJS)
 *    ✓ No Application/Infrastructure/Presentation imports
 *    ✓ Pure TypeScript domain logic only
 * 
 * 4. INFRASTRUCTURE LAYER (src/app/infrastructure/):
 *    ✓ No Application or Presentation imports
 *    ✓ Adapters implement Domain interfaces only
 * 
 * 5. DOMAIN EVENT CREATION:
 *    ⚠ DomainEvent must have correlationId and causationId (nullable only for root events)
 *    NOTE: This rule cannot be fully automated with current ESLint capabilities.
 *    TypeScript interface enforcement + manual code review required.
 *    Alternative: Custom AST-based linter or TypeScript compiler plugin.
 * 
 * ERROR LEVEL: All violations are ERRORS (not warnings)
 * DISABLES: Per-file eslint-disable comments are discouraged for architecture rules
 * 
 * These rules are workspace-wide and use existing ESLint capabilities only (no new dependencies).
 */

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

// DDD Rule Source: memory-bank/2.jsonl (Domain Layer Dependency).
// Purpose: Prevent cross-layer dependencies that break domain purity.
const domainLayerBoundaries = [
  {
    group: [
      '@application/**',
      '@infrastructure/**',
      '@presentation/**',
      '**/application/**',
      '**/infrastructure/**',
      '**/presentation/**',
    ],
    message:
      'DDD boundary: Domain must not depend on Application/Infrastructure/Presentation. Use Domain/Shared only.',
  },
  {
    group: ['@angular/**', '@ngrx/**', 'rxjs', 'rxjs/**'],
    message:
      'DDD boundary: Domain must be framework-agnostic (no Angular/NgRx/RxJS). Move framework usage to Infrastructure.',
  },
];

// DDD Rule Source: memory-bank/2.jsonl (Application Layer Dependency).
// Purpose: Ensure Application orchestrates Domain without Infrastructure/Presentation coupling.
const applicationLayerBoundaries = [
  {
    group: [
      '@infrastructure/**',
      '@presentation/**',
      '**/infrastructure/**',
      '**/presentation/**',
    ],
    message:
      'DDD boundary: Application must not depend on Infrastructure/Presentation. Depend on Domain interfaces instead.',
  },
];

// DDD Rule Source: memory-bank/2.jsonl (Infrastructure Layer Dependency).
// Purpose: Keep Infrastructure as adapters that do not import Application/Presentation.
// Architecture Lock: PR Comment 3796307372 - Infrastructure must not import Presentation.
// Exception: Infrastructure can import Application interfaces (for Dependency Inversion)
const infrastructureLayerBoundaries = [
  {
    group: [
      '@presentation/**',
      '**/presentation/**',
    ],
    message:
      'DDD boundary: Infrastructure must not depend on Presentation. Depend on Domain/Application interfaces only.',
  },
  {
    group: [
      '@application/**/use-cases/**',
      '@application/**/facades/**',
      '@application/**/stores/**',
      '**/application/**/use-cases/**',
      '**/application/**/facades/**',
      '**/application/**/stores/**',
    ],
    message:
      'DDD boundary: Infrastructure must not import Application use cases, facades, or stores. Import Application interfaces for dependency inversion only.',
  },
];

// DDD Rule Source: memory-bank/2.jsonl (Presentation Layer Dependency).
// Architecture Lock: PR Comment 3796307372 - Presentation layer event architecture boundaries
// Purpose: Prevent UI layer from directly importing Domain/Infrastructure and event internals.
const presentationLayerBoundaries = [
  {
    group: ['@domain/**', '@infrastructure/**', '**/domain/**', '**/infrastructure/**'],
    message:
      'DDD boundary: Presentation must not depend on Domain/Infrastructure. Use Application facades/stores.',
  },
  // Architecture Source: memory-bank/3.jsonl (Signals-only Presentation).
  // Purpose: Enforce signals-first UI state; keep RxJS in Application/Infrastructure and expose Signals to UI.
  {
    group: ['rxjs', 'rxjs/**'],
    message:
      'Signals-only rule: Presentation should rely on Signals/Stores; move RxJS usage to Application/Infrastructure.',
  },
  // Architecture Lock: PR Comment 3796307372 - No EventBus/EventStore internals in Presentation
  {
    group: [
      '@domain/shared/events/event-bus/**',
      '@domain/shared/events/event-store/**',
      '**/domain/shared/events/event-bus/**',
      '**/domain/shared/events/event-store/**',
      '@infrastructure/events/**',
      '**/infrastructure/events/**',
    ],
    message:
      'Architecture Lock: Presentation must not import EventBus/EventStore internals. Use Application facades or IModuleEventBus only.',
  },
  // Architecture Lock: PR Comment 3796307372 - No PublishEventUseCase in Presentation
  {
    group: [
      '@application/events/use-cases/publish-event.use-case',
      '**/application/events/use-cases/publish-event.use-case*',
    ],
    message:
      'Architecture Lock: Presentation must not import PublishEventUseCase. Use Application facades or IModuleEventBus only.',
  },
];

// DDD Rule Source: memory-bank/2.jsonl (Shared Layer Dependency).
// Purpose: Preserve cross-layer reusability and prevent circular dependencies (Shared is framework-agnostic only).
// Note: This intentionally forbids Shared -> Domain imports to keep Shared dependency-free per current DDD rules.
const sharedLayerBoundaries = [
  {
    group: [
      '@domain/**',
      '@application/**',
      '@infrastructure/**',
      '@presentation/**',
      '**/domain/**',
      '**/application/**',
      '**/infrastructure/**',
      '**/presentation/**',
    ],
    message:
      'DDD boundary: Shared must not depend on Domain/Application/Infrastructure/Presentation.',
  },
];

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // Complexity & size rules to keep single responsibility and Occam's razor
      'complexity': ['error', { 'max': 10 }],
      'max-lines-per-function': ['error', { 'max': 120, 'skipComments': true }],
      'max-params': ['error', 4],
      'max-statements': ['error', 30],
    },
  },
  {
    files: ['src/app/domain/**/*.ts'],
    rules: {
      // Domain layer boundary enforcement (DDD: Domain is pure, framework-agnostic).
      'no-restricted-imports': ['error', { patterns: domainLayerBoundaries }],
      // Architecture Lock: PR Comment 3796307372 - DomainEvent must have correlationId/causationId
      // NOTE: This rule cannot be fully enforced with current ESLint. Manual code review required.
      // Alternative: Use a custom AST-based linter or TypeScript compiler plugin.
      // For now, we rely on the DomainEvent interface requiring these fields.
    },
  },
  {
    files: ['src/app/application/**/*.ts'],
    rules: {
      // Application layer boundary enforcement (DDD: Application depends on Domain + Shared only).
      'no-restricted-imports': ['error', { patterns: applicationLayerBoundaries }],
    },
  },
  {
    files: ['src/app/application/**/*.ts'],
    ignores: ['**/*.event-handlers.ts', '**/*.projection.ts', '**/*.store.ts', '**/stores/**'],
    rules: {
      // Architecture Lock: PR Comment 3796307372 - No direct store mutation in Application layer
      // Store mutation methods (addTask, updateTask, etc.) should only be called from event handlers/projections
      // NOTE: This rule allows stores to define patchState in their withMethods, but prevents
      // other application files from calling mutation APIs directly.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="patchState"]',
          message:
            'Architecture Lock: patchState() calls are only allowed in *.store.ts, *.event-handlers.ts, or *.projection.ts files. State mutations must be event-driven.',
        },
      ],
    },
  },
  {
    files: ['src/app/infrastructure/**/*.ts'],
    rules: {
      // Infrastructure layer boundary enforcement (DDD: Infrastructure depends on Domain + Shared only).
      'no-restricted-imports': ['error', { patterns: infrastructureLayerBoundaries }],
    },
  },
  {
    files: ['src/app/presentation/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      // Presentation layer boundary enforcement (DDD: UI uses Application facades/stores only).
      'no-restricted-imports': ['error', { patterns: presentationLayerBoundaries }],
      // Architecture Lock: PR Comment 3796307372 - No publish() or append() API calls in Presentation
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name="publish"][callee.object.name=/eventBus|EventBus/i]',
          message:
            'Architecture Lock: Presentation must not call eventBus.publish(). Use Application facades or IModuleEventBus instead.',
        },
        {
          selector: 'CallExpression[callee.property.name="append"][callee.object.name=/eventStore|EventStore/i]',
          message:
            'Architecture Lock: Presentation must not call eventStore.append(). Use Application use cases instead.',
        },
        {
          selector: 'CallExpression[callee.property.name="publishBatch"][callee.object.name=/eventBus|EventBus/i]',
          message:
            'Architecture Lock: Presentation must not call eventBus.publishBatch(). Use Application facades instead.',
        },
        {
          selector: 'CallExpression[callee.property.name="appendBatch"][callee.object.name=/eventStore|EventStore/i]',
          message:
            'Architecture Lock: Presentation must not call eventStore.appendBatch(). Use Application use cases instead.',
        },
      ],
    },
  },
  {
    files: ['src/app/presentation/**/*.spec.ts'],
    rules: {
      // Test files can import RxJS for mocking Material Dialog and other Angular testing utilities
      // But still enforce DDD boundaries (no Domain/Infrastructure imports)
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@domain/**', '@infrastructure/**', '**/domain/**', '**/infrastructure/**'],
            message:
              'DDD boundary: Presentation tests must not depend on Domain/Infrastructure. Use Application facades/stores.',
          },
          {
            group: [
              '@domain/shared/events/event-bus/**',
              '@domain/shared/events/event-store/**',
              '**/domain/shared/events/event-bus/**',
              '**/domain/shared/events/event-store/**',
              '@infrastructure/events/**',
              '**/infrastructure/events/**',
            ],
            message:
              'Architecture Lock: Presentation tests must not import EventBus/EventStore internals. Use Application facades or IModuleEventBus only.',
          },
          {
            group: [
              '@application/events/use-cases/publish-event.use-case',
              '**/application/events/use-cases/publish-event.use-case*',
            ],
            message:
              'Architecture Lock: Presentation tests must not import PublishEventUseCase. Use Application facades or IModuleEventBus only.',
          },
        ]
      }],
    },
  },
  {
    files: ['src/app/presentation/**/*.ts'],
    ignores: ['**/*.spec.ts'],
    rules: {
      // Architecture Lock: PR Comment 3796307372 - No store mutation APIs in Presentation (except tests)
      // Presentation should only READ from stores, not mutate them
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="patchState"]',
          message:
            'Architecture Lock: Presentation must not call patchState(). State mutations are handled by Application event handlers.',
        },
        {
          selector: 'MemberExpression[object.name=/Store$/][property.name="set"]',
          message:
            'Architecture Lock: Presentation must not call Store.set(). State mutations are handled by Application event handlers.',
        },
        {
          selector: 'MemberExpression[object.name=/Store$/][property.name="update"]',
          message:
            'Architecture Lock: Presentation must not call Store.update(). State mutations are handled by Application event handlers.',
        },
      ],
    },
  },
  {
    files: ['src/app/shared/**/*.ts'],
    rules: {
      // Shared layer boundary enforcement (DDD: Shared is framework-agnostic and dependency-free).
      'no-restricted-imports': ['error', { patterns: sharedLayerBoundaries }],
    },
  },
];
