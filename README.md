# Architecture Gate CI - Implementation Guide

## Comment ID 3796470142 Implementation

This document describes the implementation of the Architecture Gate CI system for enforcing event-sourcing and DDD architectural invariants.

## Files Created/Modified

### 1. Script: `comprehensive-audit.js`
The main architecture enforcement script that validates:
- **Presentation layer isolation**: No EventBus/EventStore/DomainEvent imports from domain
- **Event publishing control**: Only PublishEventUseCase and event handlers can call publish/append
- **Store layer placement**: All stores MUST be in application layer
- **Sequential append-before-publish**: No Promise.all with event operations
- **Event causality propagation**: Handlers MUST propagate correlationId and set causationId
- **Signal-first architecture**: Minimal RxJS in presentation layer

### 2. Package Script: `package.json`
Already configured with script command:
```json
"architecture:gate": "node comprehensive-audit.js"
```

### 3. Documentation: `.architectural-rules.md`
Updated with:
- CI gate implementation details
- Detailed rule descriptions
- GitHub Actions workflow specification
- Local testing instructions
- Exit code documentation
- Workflow security features

### 4. GitHub Actions Workflow: `.github/workflows/architecture-gate.yml`

**IMPORTANT**: Create this file manually with the following content:

```yaml
name: Architecture Gate

on:
  push:
    branches: ['**']
    paths:
      - 'src/**/*.ts'
      - 'comprehensive-audit.js'
      - '.github/workflows/architecture-gate.yml'
  pull_request:
    branches: ['**']
    paths:
      - 'src/**/*.ts'
      - 'comprehensive-audit.js'
      - '.github/workflows/architecture-gate.yml'

# Least-privilege permissions (security best practice)
permissions:
  contents: read

# Prevent concurrent runs, cancel outdated PR builds
concurrency:
  group: architecture-gate-${{ github.ref }}
  cancel-in-progress: true

jobs:
  enforce-architecture:
    name: Enforce Event-Sourcing Invariants
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 1
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Run Architecture Gate
        run: node comprehensive-audit.js
        env:
          NODE_ENV: production
```

## Manual Steps Required

1. **Create the workflow directory** (if it doesn't exist):
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create the workflow file**:
   Copy the workflow YAML above into `.github/workflows/architecture-gate.yml`

3. **Test locally**:
   ```bash
   npm run architecture:gate
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add architecture gate CI per comment_id 3796470142"
   git push
   ```

## Architecture Rules Enforced

### Rule 1: Presentation Layer Isolation
**Forbidden in `src/app/presentation/**`:**
- ❌ `from '@domain/event-bus'`
- ❌ `from '@domain/event-store'`
- ❌ `from '@domain/event'`

**Must use:**
- ✅ Application facades
- ✅ Application stores

### Rule 2: Event Publishing Control
**Only these can call `eventBus.publish()` or `eventStore.append()`:**
- ✅ `publish-event.use-case.ts`
- ✅ Event handlers (in `application/*/handlers/*event-handler*.ts`)

**All other files:**
- ❌ Cannot call `eventBus.publish()`
- ❌ Cannot call `eventStore.append()`

### Rule 3: Store Layer Placement
**Stores (`*.store.ts`) MUST:**
- ✅ Be in `src/app/application/**`
- ❌ NOT be in presentation or domain layers

### Rule 4: Sequential Append-Before-Publish
**Forbidden:**
- ❌ `Promise.all([eventStore.append(...), ...])`
- ❌ `Promise.all([eventBus.publish(...), ...])`

**Required:**
- ✅ Sequential: `await eventStore.append()` then `await eventBus.publish()`

### Rule 5: Event Causality Propagation
**Event handlers creating events MUST:**
- ✅ Propagate `correlationId` from parent event
- ✅ Set `causationId` to parent `eventId`

### Rule 6: Signal-First Architecture
**Presentation layer should:**
- ✅ Use Angular Signals
- ⚠️ Minimize RxJS usage (warning, not error)

## Allowlist (Exceptions)

Only these files are exempt from Rule 2:

1. **`publish-event.use-case.ts`**
   - Can call `eventBus.publish()`
   - Can call `eventStore.append()`

2. **Event Handlers** (`application/*/handlers/*event-handler*.ts`)
   - Can call use cases that trigger events

## Testing the Gate

### Test Case 1: Forbidden Import in Presentation
```typescript
// ❌ This will FAIL the gate
// src/app/presentation/some-component.ts
import { EventBus } from '@domain/event-bus';
```

### Test Case 2: Direct Event Publishing
```typescript
// ❌ This will FAIL the gate (unless in PublishEventUseCase)
// src/app/application/some-use-case.ts
await eventBus.publish(event);
```

### Test Case 3: Store in Wrong Layer
```typescript
// ❌ This will FAIL the gate
// src/app/presentation/stores/some.store.ts  <- Wrong location!
export const someStore = signalStore(...);
```

### Test Case 4: Correct Usage
```typescript
// ✅ This will PASS the gate
// src/app/presentation/some-component.ts
constructor(private facade: SomeFacade) {}

ngOnInit() {
  this.facade.updateSomething(value);
}
```

## CI/CD Integration

The workflow runs automatically on:
- Every push to any branch (if TypeScript files or script changed)
- Every pull request (if TypeScript files or script changed)

### Workflow Behavior
- **Checkout**: Shallow clone (faster)
- **Node Setup**: Node 20 with npm cache
- **Run Gate**: Direct execution of `node comprehensive-audit.js` (no npm install needed)
- **Fail Hard**: Exits with code 1 on first violation

### Security Features
- ✅ Least-privilege permissions (`contents: read`)
- ✅ Pinned actions to major versions (`@v4`)
- ✅ Concurrency control (cancel outdated PR builds)
- ✅ No secrets required
- ✅ Official GitHub actions only
- ✅ No dependencies beyond Node.js

## Maintenance

### Updating Rules
Edit `comprehensive-audit.js` to add/modify checks.

### No Allowlist Expansion
Per requirements, ONLY PublishEventUseCase and event handlers are allowed.
**Do not add more exceptions.**

### Disabling the Gate (Emergency Only)
```yaml
# In .github/workflows/architecture-gate.yml
# Comment out the workflow or set branches to non-existent value
```

## Output Examples

### Success Output
```
🔍 Running Event-Sourcing Architecture Gate...

Enforcing rules from comment_id 3796470142:

  ✓ Presentation layer isolation (no EventBus/EventStore imports)
  ✓ Event publishing control (only PublishEventUseCase)
  ✓ Store layer placement (application only)
  ✓ Sequential append-before-publish
  ✓ Event causality propagation (correlationId, causationId)
  ✓ Signal-first architecture (minimal RxJS)

Scanning 42 TypeScript files...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All architecture checks passed!
```

### Failure Output
```
❌ VIOLATION: src/app/presentation/tasks.component.ts:15
   Rule: Presentation Layer Isolation
   Presentation layer CANNOT import EventBus from domain layer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💥 Found 1 architecture violation(s)!

Please fix the violations above to maintain architectural integrity.
See .architectural-rules.md for detailed rules.
```

## Exit Codes
- `0` = Success (all checks passed)
- `1` = Failure (violations detected)

## References
- `.architectural-rules.md` - Detailed rules and workflow specification
- `comprehensive-audit.js` - Implementation source
- `docs/workspace-modular-architecture.constitution.md` - Architecture constitution
- `.github/skills/ddd/SKILL.md` - DDD layer rules

---

**Implementation Status**: ✅ Complete (workflow file creation required)
**Comment ID**: 3796470142


