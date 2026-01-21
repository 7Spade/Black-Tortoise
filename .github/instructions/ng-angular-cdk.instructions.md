---
description: 'Angular CDK enforcement: focus management, overlay positioning, virtual scrolling, ARIA compliance, and resource cleanup constraints'
applyTo: '**/*.ts, **/*.html'
---

# Angular CDK Rules

## CRITICAL: Focus Management

ALL modal/dialog components MUST trap focus. No exceptions.

**REQUIRED initialization:**
```typescript
ngOnInit() {
  this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
  this.focusTrap.focusInitialElement();
}
```

**REQUIRED cleanup:**
```typescript
ngOnDestroy() {
  this.focusTrap.destroy();
}
```

**FORBIDDEN:**
- Modal/dialog components without FocusTrap
- Missing focusInitialElement() call
- Missing FocusTrap cleanup in ngOnDestroy

**VIOLATION consequences:**
- Keyboard navigation breaks
- Accessibility failures
- WCAG 2.1 non-compliance

## CRITICAL: Overlay Positioning

ALL overlays MUST define multiple fallback positions.

**REQUIRED configuration:**
```typescript
positionStrategy: this.overlay.position()
  .flexibleConnectedTo(this.elementRef)
  .withPositions([
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }
  ])
```

**REQUIRED:**
- Minimum 2 fallback positions
- ScrollStrategy configuration
- OverlayRef cleanup in ngOnDestroy

**FORBIDDEN:**
- Single position without fallbacks
- Missing scrollStrategy
- OverlayRef memory leaks

**VIOLATION consequences:**
- Overlay clipping at viewport edges
- Poor UX on mobile devices
- Memory leaks

## CRITICAL: Virtual Scrolling

When list size >100 items → MUST use CdkVirtualScrollViewport.

**REQUIRED configuration:**
```typescript
<cdk-virtual-scroll-viewport 
  itemSize="50"
  minBufferPx="400"
  maxBufferPx="800">
```

**REQUIRED:**
- Explicit itemSize
- minBufferPx configuration
- maxBufferPx configuration
- Fixed viewport height

**FORBIDDEN:**
- Rendering >100 items without virtual scrolling
- Missing itemSize attribute
- Auto height viewport (causes render issues)

**VIOLATION consequences:**
- Performance degradation
- Browser memory exhaustion
- Poor scroll performance

## Accessibility (A11y) Module Enforcement

**REQUIRED for screen reader support:**
```typescript
constructor(private liveAnnouncer: LiveAnnouncer) {}

announceMessage(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  this.liveAnnouncer.announce(message, politeness);
}
```

**REQUIRED for keyboard navigation:**
```typescript
ngAfterViewInit() {
  this.keyManager = new FocusKeyManager(this.menuItems)
    .withWrap()
    .withVerticalOrientation()
    .withHomeAndEnd();
}

@HostListener('keydown', ['$event'])
onKeydown(event: KeyboardEvent) {
  this.keyManager.onKeydown(event);
}
```

**REQUIRED:**
- LiveAnnouncer for dynamic content changes
- FocusKeyManager for list navigation
- ARIA labels on all interactive elements
- Keyboard event handlers

**FORBIDDEN:**
- Missing LiveAnnouncer announcements
- Inaccessible list navigation
- Missing ARIA attributes

## Overlay Module Enforcement

**REQUIRED overlay configuration:**
```typescript
const config = new OverlayConfig({
  positionStrategy: this.overlay.position().flexibleConnectedTo(this.elementRef).withPositions([...]),
  hasBackdrop: true,
  backdropClass: 'cdk-overlay-transparent-backdrop',
  scrollStrategy: this.overlay.scrollStrategies.reposition()
});
```

**REQUIRED:**
- flexibleConnectedTo for positioning
- Multiple position fallbacks
- Backdrop click handling
- OverlayRef disposal

**FORBIDDEN:**
- Fixed positioning without fallbacks
- Missing backdrop configuration
- Undisposed OverlayRef instances

## Drag-Drop Module Enforcement

**REQUIRED for sortable lists:**
```typescript
<div cdkDropList (cdkDropListDropped)="drop($event)">
  @for (item of items(); track item.id) {
    <div cdkDrag>
      <div class="drag-handle" cdkDragHandle>⋮⋮</div>
      {{ item.name }}
    </div>
  }
</div>

drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(this.items(), event.previousIndex, event.currentIndex);
}
```

**REQUIRED:**
- cdkDropList directive
- (cdkDropListDropped) event handler
- track expression in @for loops
- cdkDrag directive on draggable items

**FORBIDDEN:**
- Drag-drop without cdkDropList container
- Missing event handlers
- Missing track expressions

## Layout Module Enforcement

**REQUIRED for responsive design:**
```typescript
private breakpointObserver = inject(BreakpointObserver);

isHandset = toSignal(
  this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches)),
  { initialValue: false }
);
```

**REQUIRED:**
- BreakpointObserver for breakpoint detection
- toSignal() conversion for reactive integration
- initialValue for synchronous rendering

**FORBIDDEN:**
- Manual window.innerWidth checks
- Missing initialValue in toSignal()
- Direct DOM queries for layout

## CRITICAL: Resource Cleanup

ALL CDK resources MUST be cleaned up in ngOnDestroy.

**REQUIRED cleanup pattern:**
```typescript
ngOnDestroy() {
  this.focusTrap?.destroy();
  this.overlayRef?.dispose();
  this.focusMonitor?.stopMonitoring(this.element);
  this.keyManager?.destroy();
}
```

**REQUIRED:**
- FocusTrap.destroy()
- OverlayRef.dispose()
- FocusMonitor.stopMonitoring()
- Subscription cleanup

**FORBIDDEN:**
- Missing ngOnDestroy implementation
- Partial cleanup (missing any resource)
- Memory leaks from undisposed resources

**VIOLATION consequences:**
- Memory leaks
- Event listener accumulation
- Performance degradation over time

## Testing Requirements

**REQUIRED for overlay tests:**
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [OverlayModule],
    providers: [Overlay]
  });
  overlayContainer = TestBed.inject(OverlayContainer);
});

afterEach(() => {
  overlayContainer.ngOnDestroy();
});
```

**REQUIRED:**
- OverlayContainer injection
- Cleanup in afterEach
- Test coverage for focus management
- Test coverage for keyboard navigation

**FORBIDDEN:**
- Tests without OverlayContainer cleanup
- Untested accessibility features
- Missing keyboard navigation tests

## Enforcement Summary

**REQUIRED in ALL CDK components:**
- Focus trapping in modals/dialogs
- Multiple overlay position fallbacks
- Virtual scrolling when >100 items
- ARIA labels and announcements
- Resource cleanup in ngOnDestroy

**FORBIDDEN in ALL CDK components:**
- Missing FocusTrap in modals
- Single-position overlays
- Large lists without virtual scrolling
- Missing accessibility attributes
- Undisposed CDK resources
- Missing ngOnDestroy cleanup
