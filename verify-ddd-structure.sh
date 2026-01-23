#!/bin/bash

echo "=== DDD Architecture Verification ==="
echo ""

echo "1. Domain Layer Structure:"
tree -L 3 src/app/domain/workspace 2>/dev/null || find src/app/domain/workspace -type f | sort
echo ""

echo "2. Application Layer Structure:"
tree -L 3 src/app/application/workspace 2>/dev/null || find src/app/application/workspace -type f | sort
echo ""

echo "3. Infrastructure Layer Structure:"
tree -L 3 src/app/infrastructure/workspace 2>/dev/null || find src/app/infrastructure/workspace -type f | sort
echo ""

echo "4. Presentation Layer Structure:"
tree -L 3 src/app/presentation/features/workspace 2>/dev/null || find src/app/presentation/features/workspace -type f | sort
echo ""

echo "5. Barrel Exports Check:"
echo "Domain workspace index.ts:"
ls -la src/app/domain/workspace/index.ts 2>/dev/null && echo "✅ Exists" || echo "❌ Missing"
echo "Application workspace index.ts:"
ls -la src/app/application/workspace/index.ts 2>/dev/null && echo "✅ Exists" || echo "❌ Missing"
echo "Infrastructure workspace index.ts:"
ls -la src/app/infrastructure/workspace/index.ts 2>/dev/null && echo "✅ Exists" || echo "❌ Missing"
echo "Presentation workspace index.ts:"
ls -la src/app/presentation/features/workspace/index.ts 2>/dev/null && echo "✅ Exists" || echo "❌ Missing"
echo ""

echo "6. Import Path Verification (checking for old paths):"
echo "Checking for old workspace paths..."
OLD_PATHS=$(grep -r "from '@domain/workspace/workspace.entity'" src/app --include="*.ts" 2>/dev/null | wc -l)
if [ "$OLD_PATHS" -eq 0 ]; then
  echo "✅ No old workspace.entity imports found"
else
  echo "❌ Found $OLD_PATHS old workspace.entity imports"
fi

OLD_STORE=$(grep -r "from '@application/stores/workspace-context'" src/app --include="*.ts" 2>/dev/null | wc -l)
if [ "$OLD_STORE" -eq 0 ]; then
  echo "✅ No old store imports found"
else
  echo "❌ Found $OLD_STORE old store imports"
fi

OLD_RUNTIME=$(grep -r "from '@infrastructure/runtime/workspace-runtime'" src/app --include="*.ts" 2>/dev/null | wc -l)
if [ "$OLD_RUNTIME" -eq 0 ]; then
  echo "✅ No old runtime imports found"
else
  echo "❌ Found $OLD_RUNTIME old runtime imports"
fi

echo ""
echo "7. Layer Dependencies Check:"
echo "Checking domain layer has no Angular imports..."
DOMAIN_ANGULAR=$(grep -r "from '@angular" src/app/domain/workspace --include="*.ts" 2>/dev/null | wc -l)
if [ "$DOMAIN_ANGULAR" -eq 0 ]; then
  echo "✅ Domain layer is framework-agnostic"
else
  echo "❌ Found $DOMAIN_ANGULAR Angular imports in domain layer"
fi

echo ""
echo "=== Verification Complete ==="
