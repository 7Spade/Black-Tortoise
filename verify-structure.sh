#!/bin/bash

echo "=== Verifying DomainEvent Structure ==="
echo ""

# Show the new interface
echo "1. New DomainEvent Interface:"
echo "----------------------------"
grep -A 10 "interface DomainEvent<TPayload>" src/app/domain/event/domain-event.ts | head -12
echo ""

# Show a sample event using the new structure
echo "2. Sample Event (TaskCreated):"
echo "-----------------------------"
grep -A 25 "export function createTaskCreatedEvent" src/app/domain/events/domain-events/task-created.event.ts | grep -E "return \{|eventId|type:|aggregateId|correlationId|causationId|timestamp|payload:" | head -10
echo ""

# Show EventBus using generics
echo "3. EventBus Generic Types:"
echo "-------------------------"
grep -A 5 "publish<TPayload>" src/app/domain/event-bus/event-bus.interface.ts | head -6
echo ""

# Show EventStore using generics
echo "4. EventStore Generic Types:"
echo "---------------------------"
grep -A 5 "append<TPayload>" src/app/domain/event-store/event-store.interface.ts | head -6
echo ""

# Count events updated
echo "5. Statistics:"
echo "-------------"
echo "Total event definition files: $(find src/app/domain/events/domain-events -name "*.event.ts" | wc -l)"
echo "Files using .type field: $(grep -r "readonly type:" src/app/domain/events/domain-events --include="*.ts" | wc -l)"
echo "Files using .payload field: $(grep -r "readonly payload:" src/app/domain/events/domain-events --include="*.ts" | wc -l)"
echo "Factory functions using Date.now(): $(grep -r "Date\.now()" src/app/domain/events/domain-events --include="*.ts" | wc -l)"
echo ""

echo "✅ Verification complete!"
