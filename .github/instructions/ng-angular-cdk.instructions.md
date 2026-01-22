---
description: 'Angular CDK enforcement: focus management, overlay positioning, virtual scrolling, ARIA compliance, and resource cleanup constraints'
applyTo: '**/*.ts, **/*.html'
---

# Angular CDK Rules

## CRITICAL: Resource Management & Accessibility

**Focus Trapping (Modals/Dialogs):**
- Initialize FocusTrap in ngOnInit: `focusTrapFactory.create()` + `focusInitialElement()`
- Destroy in ngOnDestroy: `focusTrap.destroy()`
- VIOLATION: Keyboard navigation breaks, WCAG 2.1 non-compliance

**Overlay Positioning:**
- Define ≥2 fallback positions via `flexibleConnectedTo().withPositions([...])`
- Configure scrollStrategy and backdrop
- Dispose OverlayRef in ngOnDestroy
- VIOLATION: Viewport clipping, memory leaks

**Virtual Scrolling (Lists >100 items):**
- Use CdkVirtualScrollViewport with explicit `itemSize`, `minBufferPx`, `maxBufferPx`
- Set fixed viewport height (no auto height)
- VIOLATION: Performance degradation, memory exhaustion

**Accessibility:**
- Use LiveAnnouncer for dynamic content updates
- Implement FocusKeyManager for keyboard navigation in lists
- Add ARIA labels to all interactive elements

**Drag & Drop:**
- Use `cdkDropList` container + `cdkDrag` items + `(cdkDropListDropped)` handler
- Include track expressions in `@for` loops

**Responsive Design:**
- Use BreakpointObserver + `toSignal()` with `initialValue` (no manual `window.innerWidth`)

**ngOnDestroy Cleanup (MANDATORY):**
- `focusTrap?.destroy()`, `overlayRef?.dispose()`, `focusMonitor?.stopMonitoring()`, `keyManager?.destroy()`
- VIOLATION: Memory leaks, event listener accumulation

**Testing:**
- Inject OverlayContainer and cleanup in `afterEach`
- Test focus management and keyboard navigation
