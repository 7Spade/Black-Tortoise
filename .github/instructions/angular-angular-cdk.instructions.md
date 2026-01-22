---
description: 'Angular CDK: Component Dev Kit usage rules for accessibility, overlays, drag-drop, virtual scrolling, and responsive layout. Presentation-layer only.'
applyTo: '**/*.ts'
---

# @angular/cdk Implementation Instructions (Presentation Layer Only)

==================================================
SCOPE DEFINITION (MANDATORY)
==================================================

Angular CDK usage is a PRESENTATION-ONLY concern.

CDK utilities MUST NOT:
- Trigger domain logic
- Invoke Application Use Cases
- Access repositories or infrastructure
- Control business workflows or decisions

CDK exists ONLY to support UI behavior, accessibility, and layout.

==================================================
CRITICAL: Resource Lifecycle Management
==================================================

ALL CDK resources MUST be explicitly released in ngOnDestroy().

REQUIRED CLEANUP:
- focusTrap?.destroy()
- overlayRef?.dispose()
- focusMonitor?.stopMonitoring()
- keyManager?.destroy()

VIOLATION CONSEQUENCES:
- Memory leaks
- Event listener accumulation
- Detached DOM references

==================================================
Accessibility (a11y)
==================================================

REQUIRED:
- FocusTrap MUST be created in ngOnInit() using focusTrapFactory.create()
- focusTrap.focusInitialElement() MUST be invoked after creation
- LiveAnnouncer MUST be used for dynamic content announcements

FORBIDDEN:
- Creating focus traps without destroy cleanup
- Relying on manual DOM manipulation for screen reader updates
- Accessibility state derived from non-signal mutable flags

==================================================
Overlay Module
==================================================

REQUIRED:
- flexibleConnectedTo() MUST define AT LEAST two fallback positions
- scrollStrategy MUST be explicitly configured
- backdrop configuration MUST be explicit
- overlayRef MUST be disposed in ngOnDestroy()

FORBIDDEN:
- Overlays without fallback positions
- Missing viewport boundary handling
- Overlays without scroll strategy
- Long-lived overlays outside component lifecycle

==================================================
Virtual Scrolling
==================================================

REQUIRED:
- Use CdkVirtualScrollViewport ONLY for lists with more than 100 items
- itemSize MUST be explicitly defined
- minBufferPx and maxBufferPx MUST be configured
- Viewport MUST have a fixed height

FORBIDDEN:
- Auto-height virtual scroll viewports
- Missing itemSize configuration
- Using virtual scrolling for small lists (<100 items)

==================================================
Drag and Drop
==================================================

REQUIRED:
- cdkDropList container with (cdkDropListDropped) handler
- cdkDrag items MUST be children of a drop list
- Track expressions MUST be used in @for loops

FORBIDDEN:
- Drag-and-drop without drop handlers
- Missing track expressions
- Nested drop lists without explicit connectedTo configuration

==================================================
Responsive Layout
==================================================

REQUIRED:
- Use BreakpointObserver with toSignal()
- initialValue MUST be provided when converting to signals
- Breakpoint queries MUST use CDK-provided constants

FORBIDDEN:
- window.innerWidth access
- Manual resize event listeners
- Direct window.matchMedia usage
- Missing cleanup for breakpoint observers

==================================================
Keyboard Navigation
==================================================

REQUIRED:
- Use FocusKeyManager for keyboard-navigable lists
- ARIA labels REQUIRED on all interactive elements
- Tab order MUST reflect visual order

FORBIDDEN:
- Custom keyboard handling without CDK utilities
- Implicit or unmanaged tab order

==================================================
Testing Rules
==================================================

REQUIRED:
- Inject OverlayContainer in tests
- Clean up overlay container in afterEach()
- Verify focus management and keyboard navigation behavior

FORBIDDEN:
- Leaving overlays mounted between tests
- Skipping accessibility-related assertions

==================================================
ENFORCEMENT CHECKLIST
==================================================

REQUIRED:
- Explicit ngOnDestroy() cleanup for all CDK resources
- Virtual scrolling only when justified
- Focus traps with deterministic lifecycle
- Overlay positioning with fallbacks
- BreakpointObserver integrated via signals

FORBIDDEN:
- CDK driving application flow
- CDK triggering domain or use case logic
- Manual DOM or window event management
