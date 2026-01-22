#!/bin/bash

echo "🔍 FINAL VERIFICATION - DDD/Clean Architecture Compliance"
echo "=========================================================="
echo ""

echo "📊 Step 1: Comprehensive Architecture Audit"
echo "--------------------------------------------"
node comprehensive-audit.js
AUDIT_RESULT=$?
echo ""

echo "🏗️  Step 2: Build Verification"
echo "--------------------------------------------"
npm run build > build-output.log 2>&1
BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
  echo "✅ Build succeeded"
  grep "Application bundle generation complete" build-output.log
  grep "Output location:" build-output.log
else
  echo "❌ Build failed"
  tail -30 build-output.log
fi
echo ""

echo "📈 Step 3: Summary Statistics"
echo "--------------------------------------------"
echo "TypeScript Files Analyzed: $(find src/app -name '*.ts' ! -name '*.spec.ts' | wc -l)"
echo "Domain Files: $(find src/app/domain -name '*.ts' ! -name '*.spec.ts' | wc -l)"
echo "Application Files: $(find src/app/application -name '*.ts' ! -name '*.spec.ts' | wc -l)"
echo "Infrastructure Files: $(find src/app/infrastructure -name '*.ts' ! -name '*.spec.ts' | wc -l)"
echo "Presentation Files: $(find src/app/presentation -name '*.ts' ! -name '*.spec.ts' | wc -l)"
echo ""

echo "📝 Step 4: Files Modified in This Audit"
echo "--------------------------------------------"
echo "1. src/app/presentation/containers/workspace-modules/acceptance.module.ts"
echo "2. src/app/presentation/containers/workspace-modules/daily.module.ts"
echo "3. src/app/presentation/containers/workspace-modules/members.module.ts"
echo "4. src/app/presentation/workspace/components/workspace-create-trigger.component.ts"
echo "5. src/app/presentation/shared/components/header/header.component.ts"
echo ""

echo "✅ Step 5: Final Status"
echo "--------------------------------------------"
if [ $AUDIT_RESULT -eq 0 ] && [ $BUILD_RESULT -eq 0 ]; then
  echo "🎉 SUCCESS: Architecture is 100% compliant and build succeeds!"
  echo "Status: READY FOR PRODUCTION"
  exit 0
else
  echo "❌ FAILURE: Issues found"
  exit 1
fi
