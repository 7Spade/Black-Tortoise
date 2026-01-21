---
description: 'Angular CDK enforcement: focus management, overlay positioning, virtual scrolling, ARIA compliance, and resource cleanup constraints'
applyTo: '**/*.ts, **/*.html'
---

# Angular CDK Rules

## CRITICAL: Resource Management & Accessibility

**Focus Trapping (Modals/Dialogs):**
- MUST initialize FocusTrap in ngOnInit: `focusTrapFactory.create()` + `focusInitialElement()`
- MUST destroy in ngOnDestroy: `focusTrap.destroy()`
- VIOLATION: Keyboard navigation breaks, WCAG 2.1 non-compliance

**Overlay Positioning:**
- MUST define ≥2 fallback positions via `flexibleConnectedTo().withPositions([...])`
- MUST configure scrollStrategy and backdrop
- MUST dispose OverlayRef in ngOnDestroy
- VIOLATION: Viewport clipping, memory leaks

**Virtual Scrolling (Lists >100 items):**
- MUST use CdkVirtualScrollViewport with explicit `itemSize`, `minBufferPx`, `maxBufferPx`
- MUST set fixed viewport height (no auto height)
- VIOLATION: Performance degradation, memory exhaustion

**Accessibility:**
- MUST use LiveAnnouncer for dynamic content changes
- MUST implement FocusKeyManager for keyboard navigation in lists
- MUST add ARIA labels to all interactive elements

**Drag-Drop:**
- MUST use cdkDropList container + cdkDrag items + (cdkDropListDropped) handler
- MUST include track expressions in @for loops

**Responsive Design:**
- MUST use BreakpointObserver + toSignal() with initialValue (no manual window.innerWidth)

**ngOnDestroy Cleanup (MANDATORY):**
- focusTrap?.destroy(), overlayRef?.dispose(), focusMonitor?.stopMonitoring(), keyManager?.destroy()
- VIOLATION: Memory leaks, event listener accumulation

**Testing:**
- MUST inject OverlayContainer and cleanup in afterEach
- MUST test focus management and keyboard navigation
