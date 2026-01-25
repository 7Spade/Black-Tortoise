# Architecture Audit & Remediation Plan

## Constitution Requirements
1. Zone-less (✓ Already configured)
2. Angular Signals only (✗ RxJS still used)
3. No RxJS (✗ Present in multiple layers)
4. No manual subscribe (✗ 5 files have .subscribe())
5. Domain must be pure TS (✗ async/await in domain layer)
6. Maintain behavior (✓ Will preserve)
7. AOT/production build ready (? Need to verify)

## Violations Found

### Critical (MUST FIX)
1. **Domain Layer**: `domain/event-bus/workspace-event-bus.ts`
   - Uses async/await (Rule 11 violation)
   - Contains concrete implementation (should be interface only)
   - **Action**: Remove file, keep only interface

2. **Application Layer**: Multiple RxJS usages
   - `application/stores/event.store.ts` - Uses rxMethod with RxJS operators
   - `application/workspace/adapters/workspace-event-bus.adapter.ts` - Has manual subscribe
   - `application/facades/shell.facade.ts` - Imports RxJS operators
   - `application/facades/header.facade.ts` - Uses Observable
   - **Action**: Replace with signal-based patterns

3. **Presentation Layer**: Manual subscriptions
   - `presentation/features/workspace/components/workspace-create-trigger.component.ts` - Uses Subject + subscribe
   - `presentation/containers/workspace-modules/tasks.module.ts` - Multiple event.subscribe() calls
   - `presentation/organization/components/organization-create-trigger/organization-create-trigger.component.ts`
   - **Action**: Use toSignal() or signal-based event handling

### Acceptable (Infrastructure Layer)
- `infrastructure/workspace/factories/in-memory-event-bus.ts` - RxJS Subject OK in Infrastructure
- `infrastructure/workspace/persistence/workspace.repository.impl.ts` - Observable OK for Firebase
- `infrastructure/firebase/angularfire-signal-demo.service.ts` - Uses toSignal() pattern (GOOD)

## Remediation Strategy

### Phase 1: Remove Domain Violations
- Delete deprecated `WorkspaceEventBus` class from domain
- Keep only interfaces in domain/event-bus/

### Phase 2: Refactor Application Layer
- Replace rxMethod with direct signal updates where possible
- Convert Observable-based facades to signal-based
- Remove manual subscriptions in adapters

### Phase 3: Refactor Presentation Layer
- Replace all .subscribe() with toSignal() or effects
- Convert Subject patterns to signal + effect patterns
- Ensure all components are pure signal consumers

### Phase 4: Verification
- Run `tsc --noEmit`
- Run `ng build --configuration production`
- Verify all tests pass
- Check bundle size reduction (zone.js removal)

## Expected Outcomes
- Zero RxJS imports outside Infrastructure
- Zero manual .subscribe() calls
- All async operations handled via signals
- Smaller bundle size
- Better performance
