#!/bin/bash
echo "=== Verifying Injection Token Implementation ==="
echo ""

echo "✅ 1. Checking EVENT_BUS and EVENT_STORE tokens exist..."
grep -q "export const EVENT_BUS" src/app/application/events/tokens/event-infrastructure.tokens.ts && \
grep -q "export const EVENT_STORE" src/app/application/events/tokens/event-infrastructure.tokens.ts && \
echo "   ✓ Tokens defined" || echo "   ✗ Tokens missing"

echo ""
echo "✅ 2. Checking tokens are exported from events module..."
grep -q "EVENT_BUS, EVENT_STORE" src/app/application/events/index.ts && \
echo "   ✓ Tokens exported" || echo "   ✗ Tokens not exported"

echo ""
echo "✅ 3. Checking providers configured in app.config.ts..."
grep -q "provide: EVENT_BUS" src/app/app.config.ts && \
grep -q "provide: EVENT_STORE" src/app/app.config.ts && \
echo "   ✓ Providers configured" || echo "   ✗ Providers missing"

echo ""
echo "✅ 4. Checking use-cases use inject(EVENT_BUS) and inject(EVENT_STORE)..."
grep -q "inject(EVENT_BUS)" src/app/application/events/use-cases/publish-event.use-case.ts && \
grep -q "inject(EVENT_STORE)" src/app/application/events/use-cases/query-events.use-case.ts && \
echo "   ✓ Use-cases updated" || echo "   ✗ Use-cases not updated"

echo ""
echo "✅ 5. Checking old DomainEvent definitions removed from domain-event.ts..."
! grep -q "interface WorkspaceCreated" src/app/domain/event/domain-event.ts && \
! grep -q "interface ModuleActivated" src/app/domain/event/domain-event.ts && \
echo "   ✓ Old events removed" || echo "   ✗ Old events still present"

echo ""
echo "✅ 6. Checking new module events created..."
[ -f src/app/domain/events/domain-events/module-activated.event.ts ] && \
[ -f src/app/domain/events/domain-events/module-deactivated.event.ts ] && \
echo "   ✓ New event files created" || echo "   ✗ Event files missing"

echo ""
echo "✅ 7. Checking TaskCreatedEvent uses TaskPriority type..."
grep -q "priority: TaskPriority" src/app/domain/events/domain-events/task-created.event.ts && \
echo "   ✓ TaskPriority type used" || echo "   ✗ Still using string type"

echo ""
echo "✅ 8. Checking @Injectable() added to infrastructure implementations..."
grep -q "@Injectable()" src/app/infrastructure/events/in-memory-event-bus.impl.ts && \
grep -q "@Injectable()" src/app/infrastructure/events/in-memory-event-store.impl.ts && \
echo "   ✓ @Injectable decorators added" || echo "   ✗ Decorators missing"

echo ""
echo "=== Verification Complete ==="
