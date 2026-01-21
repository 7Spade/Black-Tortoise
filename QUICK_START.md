# Quick Start Guide: Demo Context Page

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Access Demo Page
Open browser and navigate to:
```
http://localhost:4200/demo-context
```

## 🎯 Using the Demo

### Step 1: Load Demo Data
Click the **"Load Demo Data"** button to populate the store with sample data:
- Creates a demo user identity
- Loads 3 sample workspaces
- Selects the first workspace
- Activates the Overview module

### Step 2: Explore State
Observe the real-time state display in the info cards:
- **Current Identity**: User details
- **Current Workspace**: Selected workspace info
- **Current Module**: Active module details
- **Computed Signals**: Derived state values

### Step 3: Switch Workspaces
Click any workspace card to change the active workspace:
- "Personal Workspace" (User-owned, 4 modules)
- "Team Projects" (Organization-owned, 5 modules)
- "Client Collaboration" (Organization-owned, 2 modules)

### Step 4: Activate Modules
Click module buttons to change the active module:
- 📊 Overview
- 📄 Documents
- ✓ Tasks
- 📅 Calendar (only in some workspaces)
- ⚙️ Settings

**Note**: Disabled modules are grayed out (not enabled in current workspace)

### Step 5: Reset
Click **"Reset Store"** to clear all state back to initial values

## 📁 File Structure

```
src/app/
├── application/stores/
│   ├── application-context.state.ts    # State models
│   └── application-context.store.ts    # @ngrx/signals store
│
├── presentation/
│   ├── app.component.ts                # Root component
│   └── demo-context-page/
│       ├── demo-context-page.component.ts    # Component logic
│       ├── demo-context-page.component.html  # Template
│       └── demo-context-page.component.scss  # Styles
│
├── app.routes.ts    # Route configuration
└── app.config.ts    # App configuration
```

## 🔧 Key Concepts

### Signals
All state is accessed via signals (no subscriptions needed):
```typescript
appContext.currentIdentity()    // Signal value
appContext.isAuthenticated()    // Computed signal
```

### Template Syntax
Modern control flow:
```html
@if (appContext.currentIdentity(); as identity) {
  <div>{{ identity.displayName }}</div>
}

@for (workspace of appContext.availableWorkspaces(); track workspace.id) {
  <div>{{ workspace.name }}</div>
}
```

### State Updates
Type-safe methods:
```typescript
appContext.selectWorkspace(workspace);
appContext.selectModule('documents');
appContext.setError('Error message');
```

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Real-time Updates**: State changes immediately reflected
- **Visual Feedback**: Active items highlighted
- **Error Handling**: Error banner for failures
- **Loading State**: Loading indicator during operations

## 🛠️ Development Commands

```bash
# Start dev server
npm start

# Build for production
npm run build

# Format code
npm run format

# Lint code
npm run lint
```

## 📊 Bundle Size

- **Initial Bundle**: ~197 KB gzipped
- **Demo Page (Lazy)**: ~5.5 KB gzipped
- **Zone.js Savings**: ~40 KB (not included)

## 🔍 Debugging

### View Store State
Open browser console and inspect:
```javascript
// Store is available globally (for debugging)
ng.probe($0)?.componentInstance?.appContext
```

### Console Logs
Store logs initialization:
```
[ApplicationContextStore] Initialized (zone-less mode)
[ApplicationContextStore] Ready for signal-based state management
```

## 📝 Code Examples

### Inject Store in Component
```typescript
import { inject } from '@angular/core';
import { ApplicationContextStore } from '@application/stores/application-context.store';

export class MyComponent {
  readonly appContext = inject(ApplicationContextStore);
}
```

### Use in Template
```html
<!-- Conditional rendering -->
@if (appContext.isAuthenticated()) {
  <div>User is logged in</div>
}

<!-- Loop through items -->
@for (workspace of appContext.availableWorkspaces(); track workspace.id) {
  <div>{{ workspace.name }}</div>
}

<!-- Display computed value -->
<p>Workspaces: {{ appContext.workspaceCount() }}</p>
```

### Update State
```typescript
// Set identity
appContext.setIdentity({
  id: 'user-123',
  type: 'user',
  displayName: 'Jane Doe',
  email: 'jane@example.com',
  avatarUrl: null
});

// Select workspace
const workspace = appContext.availableWorkspaces()[0];
if (workspace) {
  appContext.selectWorkspace(workspace);
}

// Select module
appContext.selectModule('documents');

// Handle errors
try {
  // operation
} catch (error) {
  appContext.setError(error.message);
}
```

## 🎓 Learning Path

1. **Understand Signals**: Read Angular signals documentation
2. **Explore Store**: Review `application-context.store.ts`
3. **Study Component**: Review `demo-context-page.component.ts`
4. **Examine Template**: Review `demo-context-page.component.html`
5. **Check Routing**: Review `app.routes.ts`

## 📚 Documentation

- **IMPLEMENTATION.md**: Comprehensive technical documentation
- **DECISION_RECORD.md**: Architecture decisions
- **IMPLEMENTATION_SUMMARY.md**: Executive summary
- **integrated-system-spec.md**: System specification

## ✅ Verification Checklist

After starting the app, verify:
- [ ] Page loads at /demo-context
- [ ] "Load Demo Data" button works
- [ ] State displays in info cards
- [ ] Workspace selection works
- [ ] Module selection works
- [ ] Disabled modules are grayed out
- [ ] Active items are highlighted
- [ ] "Reset Store" button works
- [ ] No console errors
- [ ] UI is responsive

## 🆘 Troubleshooting

### Build Fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Page Not Found
- Check route: Should be `/demo-context`
- Check build output: Demo page should be in lazy chunks

### State Not Updating
- Check browser console for errors
- Verify OnPush strategy (signals should trigger updates)
- Check signal syntax in template (use `()` for signal calls)

## 🎉 Success Criteria

You've successfully set up the demo when:
1. ✅ App builds without errors
2. ✅ Demo page loads at /demo-context
3. ✅ Demo data loads successfully
4. ✅ State updates are visible in real-time
5. ✅ UI is responsive and interactive

---

**Ready to explore?** Load the demo data and start clicking around!
