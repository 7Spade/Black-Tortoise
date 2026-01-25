# Architecture Gate CI - Implementation Guide

## PR Comment 3796303220 Implementation

This document describes the implementation of the Architecture Gate CI system.

## Files Created/Modified

### 1. Script: `comprehensive-audit.js`
The main architecture enforcement script that validates:
- Presentation layer isolation (no EventBus/EventStore imports)
- Event publishing control (only PublishEventUseCase)
- State mutation control (no direct store mutations in presentation)
- DomainEvent structure validation
- EventStore immutability
- Store layer placement

### 2. Package Script: `package.json`
Added script command:
```json
"architecture:gate": "node comprehensive-audit.js"
```

### 3. Documentation: `README.md`
Updated with Architecture Gate documentation including:
- Rules enforced
- Usage instructions
- Exit codes
- Violation format
- Allowlist exceptions

### 4. GitHub Actions Workflow: `.github/workflows/architecture-gate.yml`

**IMPORTANT**: Create this file manually with the following content:

```yaml
name: Architecture Gate

# Security-first GitHub Actions workflow
# Enforces architectural boundaries on every push and PR

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

# Prevent concurrent runs on same branch
concurrency:
  group: architecture-gate-${{ github.ref }}
  cancel-in-progress: true

jobs:
  architecture-gate:
    name: Enforce Architecture Boundaries
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          # Shallow clone for faster checkout
          fetch-depth: 1
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          # Use package-lock.json for caching
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Architecture Gate
        run: npm run architecture:gate
        env:
          # Fail fast on first violation
          NODE_ENV: production
      
      - name: Report Status
        if: always()
        run: |
          if [ $? -eq 0 ]; then
            echo "✅ Architecture Gate: PASSED"
          else
            echo "❌ Architecture Gate: FAILED"
            echo "Review violations above and fix before merging."
            exit 1
          fi
```

## Manual Steps Required

1. **Create the workflow directory** (if it doesn't exist):
   ```bash
   mkdir -p .github/workflows
   ```

2. **Create the workflow file**:
   ```bash
   cat > .github/workflows/architecture-gate.yml << 'EOF'
   # Paste the workflow YAML content from above
   EOF
   ```

3. **Test locally**:
   ```bash
   npm run architecture:gate
   ```

4. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add architecture gate CI per PR comment 3796303220"
   git push
   ```

## Architecture Rules Enforced

### Rule 1: Presentation Layer Isolation
**Forbidden in `src/app/presentation/**`:**
- ❌ `from '@domain/event-bus/event-bus.interface'`
- ❌ `from '@domain/event-store/event-store.interface'`
- ❌ `from '@domain/event/domain-event'`

**Allowed:**
- ✅ `from '@application/interfaces/module-event-bus.interface'`
- ✅ `from '@application/*/facades/*'`

### Rule 2: Event Publishing Control
**Only `publish-event.use-case.ts` can:**
- ✅ Call `eventBus.publish(event)`
- ✅ Call `eventStore.append(event)`

**All other files:**
- ❌ Cannot call `eventBus.publish()`
- ❌ Cannot call `eventStore.append()` or `eventStore.appendBatch()`

### Rule 3: State Mutation Control
**Presentation layer (`src/app/presentation/**`) CANNOT:**
- ❌ Call `.set()` on stores
- ❌ Call `.update()` on stores
- ❌ Call `.patch()` on stores
- ❌ Call `.mutate()` on stores

**Must use:**
- ✅ Facades
- ✅ Use Cases

### Rule 4: DomainEvent Structure
**DomainEvent interface MUST have:**
- ✅ `readonly eventId: string`
- ✅ `readonly correlationId: string`
- ✅ `readonly causationId: string | null`
- ✅ `readonly timestamp: Date`
- ✅ `readonly payload: TPayload`

### Rule 5: EventStore Immutability
**EventStore interface MUST:**
- ✅ Be append-only
- ❌ NOT have `delete()` methods
- ❌ NOT have `update()` methods
- ❌ NOT have `modify()` methods
- ❌ NOT have `edit()` methods

### Rule 6: Store Layer Placement
**Stores (`*.store.ts`) MUST:**
- ✅ Be in `src/app/application/**`
- ❌ NOT be in `src/app/presentation/**`
- ❌ NOT be in `src/app/domain/**`

## Allowlist (Exceptions)

Only these files are exempt from certain rules:

1. **`publish-event.use-case.ts`**
   - Can call `eventBus.publish()`
   - Can call `eventStore.append()`

2. **Event Handlers** (`src/app/application/**/handlers/**/*event-handler*.ts`)
   - Can subscribe to EventBus
   - Can update stores
   - Can call other use cases

## Testing the Gate

### Test Case 1: Forbidden Import in Presentation
```typescript
// ❌ This will FAIL the gate
// src/app/presentation/some-component.ts
import { EventBus } from '@domain/event-bus/event-bus.interface';
```

### Test Case 2: Direct Event Publishing
```typescript
// ❌ This will FAIL the gate (unless in PublishEventUseCase)
// src/app/application/some-use-case.ts
eventBus.publish(event);
```

### Test Case 3: Direct Store Mutation in Presentation
```typescript
// ❌ This will FAIL the gate
// src/app/presentation/some-component.ts
this.store.set({ value: 123 });
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
- Every push to any branch (if TypeScript files changed)
- Every pull request (if TypeScript files changed)

### Workflow Behavior
- **Checkout**: Shallow clone (faster)
- **Node Setup**: Uses Node 20 with npm cache
- **Install**: `npm ci` (clean install)
- **Run Gate**: Executes `comprehensive-audit.js`
- **Fail Hard**: Exits with code 1 on first violation

### Security Features
- ✅ Least-privilege permissions (`contents: read`)
- ✅ Pinned actions to major versions (`@v4`)
- ✅ Concurrency control (cancel outdated runs)
- ✅ No secrets exposed
- ✅ No third-party actions
- ✅ Minimal attack surface

## Maintenance

### Updating Rules
Edit `comprehensive-audit.js` to add/modify rules.

### Updating Allowlist
Modify the `isPublishEventUseCase()` and `isEventHandler()` functions in `comprehensive-audit.js`.

### Disabling the Gate (Emergency)
If you need to temporarily disable:
```yaml
# In .github/workflows/architecture-gate.yml
on:
  push:
    branches: ['NEVER_MATCH']  # This disables the workflow
```

## Exit Codes
- `0` = Success (all checks passed)
- `1` = Failure (violations detected)

## See Also
- `.architectural-rules.md` - Detailed architecture rules
- `comprehensive-audit.js` - Implementation
- `README.md` - Quick reference

