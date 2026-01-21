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
const infrastructureLayerBoundaries = [
  {
    group: [
      '@application/**',
      '@presentation/**',
      '**/application/**',
      '**/presentation/**',
    ],
    message:
      'DDD boundary: Infrastructure must not depend on Application/Presentation. Depend on Domain/Shared only.',
  },
];

// DDD Rule Source: memory-bank/2.jsonl (Presentation Layer Dependency).
// Purpose: Prevent UI layer from directly importing Domain/Infrastructure.
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
    },
  },
  {
    files: ['src/app/domain/**/*.ts'],
    rules: {
      // Domain layer boundary enforcement (DDD: Domain is pure, framework-agnostic).
      'no-restricted-imports': ['error', { patterns: domainLayerBoundaries }],
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
    files: ['src/app/infrastructure/**/*.ts'],
    rules: {
      // Infrastructure layer boundary enforcement (DDD: Infrastructure depends on Domain + Shared only).
      'no-restricted-imports': ['error', { patterns: infrastructureLayerBoundaries }],
    },
  },
  {
    files: ['src/app/presentation/**/*.ts'],
    rules: {
      // Presentation layer boundary enforcement (DDD: UI uses Application facades/stores only).
      'no-restricted-imports': ['error', { patterns: presentationLayerBoundaries }],
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
