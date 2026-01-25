#!/bin/bash

echo "=== Verifying DomainEvent Refactoring ==="
echo ""

# Check for old field names that should be removed
echo "Checking for old field references..."
echo ""

OLD_FIELDS=("\.eventType" "\.occurredAt" "\.metadata\." "\.causalityId")
HAS_ISSUES=false

for field in "${OLD_FIELDS[@]}"; do
    echo "Searching for: $field"
    results=$(grep -r "$field" src/app --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "eventType:" | grep -v "readonly eventType" | grep -v "// " | grep -v "module-events.ts" || true)
    if [ ! -z "$results" ]; then
        echo "  ⚠️  Found references:"
        echo "$results" | head -5
        HAS_ISSUES=true
    else
        echo "  ✅ No references found"
    fi
    echo ""
done

# Check that new fields are being used
echo "Checking for new field usage..."
echo ""

NEW_FIELDS=("\.type" "\.timestamp" "\.payload\.")
for field in "${NEW_FIELDS[@]}"; do
    echo "Searching for: $field"
    count=$(grep -r "$field" src/app --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)
    if [ "$count" -gt 10 ]; then
        echo "  ✅ Found $count references"
    else
        echo "  ⚠️  Only found $count references (expected more)"
        HAS_ISSUES=true
    fi
done
echo ""

if [ "$HAS_ISSUES" = false ]; then
    echo "=== ✅ Refactoring verification passed! ==="
else
    echo "=== ⚠️  Some issues found - please review ==="
fi
