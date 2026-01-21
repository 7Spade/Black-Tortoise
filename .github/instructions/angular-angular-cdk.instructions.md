---
description: 'Angular CDK: Component Dev Kit for accessibility, overlays, drag-drop, virtual scrolling, and responsive layout utilities'
applyTo: '**/*.ts'
---

# @angular/cdk Implementation Instructions

## CRITICAL: Resource Management

**REQUIRED cleanup in ngOnDestroy():**
- `focusTrap?.destroy()` for focus traps
- `overlayRef?.dispose()` for overlays
- `focusMonitor?.stopMonitoring()` for focus monitoring
- `keyManager?.destroy()` for keyboard managers

**VIOLATION:** Memory leaks, event listener accumulation

## Accessibility (a11y) Module

**REQUIRED for focus management:**
- `FocusTrap` MUST be initialized in `ngOnInit()` with `focusTrapFactory.create()`
- `focusTrap.focusInitialElement()` MUST be called after creation
- NEVER create focus traps without destroy cleanup

**REQUIRED for live announcements:**
- Use `LiveAnnouncer` for dynamic content changes
- NEVER rely on DOM manipulation for screen reader updates

## Overlay Module

**REQUIRED positioning:**
- `flexibleConnectedTo()` MUST define ≥2 fallback positions
- Configure `scrollStrategy` and `backdrop` explicitly
- NEVER create overlays without `dispose()` in cleanup

**FORBIDDEN:**
- Creating overlays without fallback positions
- Missing viewport boundary handling
- Overlays without scroll strategy

## Virtual Scrolling

**REQUIRED for lists >100 items:**
- `CdkVirtualScrollViewport` MUST have explicit `itemSize`
- Configure `minBufferPx` and `maxBufferPx` for performance
- Viewport MUST have fixed height (no `auto`)

**FORBIDDEN:**
- Auto-height virtual scroll viewports
- Missing `itemSize` configuration
- Virtual scrolling for <100 items

## Drag and Drop

**REQUIRED structure:**
- `cdkDropList` container with `(cdkDropListDropped)` handler
- `cdkDrag` items within drop list
- Track expressions MUST be included in `@for` loops

**FORBIDDEN:**
- Drag-drop without drop handlers
- Missing track expressions
- Nested drop lists without `connectedTo`

## Responsive Layout

**REQUIRED:**
- Use `BreakpointObserver` with `toSignal()` and `initialValue`
- NEVER use `window.innerWidth` or manual resize listeners
- Breakpoint queries MUST use CDK constants

**FORBIDDEN:**
- Manual window resize event listeners
- Direct `window.matchMedia` usage
- Missing cleanup for breakpoint subscriptions

## Keyboard Navigation

**REQUIRED for lists:**
- `FocusKeyManager` for keyboard list navigation
- ARIA labels on all interactive elements
- Tab order MUST follow visual order

## Testing

**REQUIRED:**
- Inject `OverlayContainer` in tests
- Clean up overlay container in `afterEach()`
- Test focus management and keyboard navigation

## Enforcement Checklist

**REQUIRED:**
- All CDK resources destroyed in `ngOnDestroy()`
- Virtual scrolling for lists >100 items
- Focus traps with cleanup
- Overlay positioning with fallbacks
- `BreakpointObserver` with signals

**FORBIDDEN:**
- Missing `ngOnDestroy()` cleanup
- Auto-height virtual scrolling
- Manual window event listeners
- Overlays without fallback positions
