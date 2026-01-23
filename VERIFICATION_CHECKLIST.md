# Verification Checklist for Workspace Switcher Fix

## Pre-Deployment Verification

### 1. Install Dependencies
```bash
npm install
```

### 2. TypeScript Compilation Check
```bash
npx tsc --noEmit
```
**Expected:** No compilation errors

### 3. Build Check (AOT)
```bash
npm run build
```
**Expected:** Successful production build

### 4. Linting (if applicable)
```bash
npm run lint
```
**Expected:** No linting errors

---

## Runtime Verification

### Test Scenario 1: Demo Route
1. Start dev server: `npm start`
2. Navigate to `/demo`
3. **Expected:** Workspace controls hidden (by design)

### Test Scenario 2: Workspace Route
1. Navigate to `/workspace`
2. **Expected:** 
   - Workspace switcher button appears in header
   - Button shows "Personal Projects" (default workspace)
   - Material Icons display correctly (folder icon)

### Test Scenario 3: Workspace Menu
1. Click workspace switcher button
2. **Expected:**
   - Dropdown menu opens
   - Shows "Personal Projects" (active)
   - Shows "Team Collaboration"
   - Shows "Create Workspace" option

### Test Scenario 4: Switch Workspace
1. Click "Team Collaboration" in menu
2. **Expected:**
   - Menu closes
   - Button text updates to "Team Collaboration"
   - Navigation stays on `/workspace`

### Test Scenario 5: Browser Console
1. Open browser dev tools
2. Check console
3. **Expected:**
   - No errors
   - `[WorkspaceContextStore]` initialization messages
   - Demo data loaded messages

---

## DDD Compliance Verification

### Layer Dependency Check
```bash
# Domain should have NO Angular imports
grep -r "@angular" src/app/domain/

# Expected: No results (or only in comments/test files)
```

### Import Path Check
```bash
# Verify all imports use path aliases
grep -r "from '\.\./\.\./\.\." src/app/

# Expected: Minimal results (prefer @domain, @application, etc.)
```

### Barrel Export Check
```bash
# Check workspace domain exports
cat src/app/domain/workspace/index.ts
```
**Expected:**
- Clear separation between Entity and Aggregate factories
- No re-exports of implementation details

---

## Code Quality Checks

### 1. No Unused Imports
```bash
# Check for unused imports (manual review)
# Focus on repository implementations
```

### 2. Signal Store Initialization
**Verify:** `workspace-context.store.ts` line 344-347
```typescript
onInit(store) {
  // Always load demo data for demonstration purposes
  // In production, this would be replaced with actual data loading from backend
  store.loadDemoData();
},
```

### 3. Repository Imports
**Verify:** `workspace.repository.impl.ts` line 21
```typescript
import { WorkspaceAggregate, WorkspaceId } from '@domain/workspace';
```
**Must NOT include:** `createWorkspace` or any factory functions

---

## Browser Compatibility

### Test in Multiple Browsers
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### Check Material Icons Loading
1. Open DevTools Network tab
2. Look for Google Fonts requests
3. **Expected:** 
   - `fonts.googleapis.com` requests successful
   - Material Icons font loaded
   - No 404 or CORS errors

---

## Accessibility Check

### Keyboard Navigation
1. Tab through header controls
2. **Expected:**
   - Workspace button is focusable
   - Focus indicator visible
   - Enter key opens menu

### Screen Reader
1. Use screen reader (if available)
2. **Expected:**
   - Button announced as "Switch workspace"
   - Menu items properly labeled

---

## Performance Check

### Initial Load
1. Open DevTools Performance tab
2. Record page load
3. **Expected:**
   - No unnecessary re-renders
   - Store initialization happens once
   - Demo data loads efficiently

### Signal Updates
1. Switch workspaces multiple times
2. **Expected:**
   - Only affected UI updates
   - No console warnings
   - Smooth transitions

---

## Edge Cases

### Test Case 1: No Workspaces
**Manual Test:** Comment out demo data loading
```typescript
// store.loadDemoData();
```
**Expected:** Button doesn't appear (correct behavior)

### Test Case 2: Network Delay (Future)
**Note:** Currently using in-memory storage
**Future:** Test with Firebase integration

### Test Case 3: Long Workspace Names
**Manual Test:** Create workspace with 50+ character name
**Expected:** Text truncates with ellipsis

---

## Regression Testing

### Verify No Breaking Changes
- [ ] Identity switcher still works
- [ ] Navigation still works
- [ ] Other header controls (search, notifications) still work
- [ ] Module routing still works
- [ ] Settings page still accessible

---

## Sign-off Checklist

- [ ] All TypeScript compilation errors resolved
- [ ] Production build succeeds
- [ ] Workspace switcher appears on `/workspace` route
- [ ] Material Icons display correctly
- [ ] No console errors
- [ ] DDD layer boundaries respected
- [ ] No unused imports
- [ ] Documentation updated
- [ ] Changes committed with proper message

---

## Known Limitations

1. **Demo Route Behavior:** Workspace controls intentionally hidden on `/demo` route
2. **In-Memory Storage:** Using placeholder repository (not real Firebase)
3. **Auto-Navigation:** Creating workspace navigates to `/workspace` automatically

---

## Next Steps After Verification

1. If all checks pass: ✅ Ready to merge
2. If any issues found: 🔧 Fix and re-verify
3. If new features needed: 📝 Create new tasks

---

## Contact for Issues

If verification fails, check:
1. `WORKSPACE_SWITCHER_FIX_SUMMARY.md` for detailed fix explanations
2. Console logs for specific errors
3. Network tab for resource loading issues
