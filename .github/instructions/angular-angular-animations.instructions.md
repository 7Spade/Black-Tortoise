---
description: 'Angular Animations: trigger-based animations, state transitions, and performance optimization for zone-less architecture. Presentation-layer only.'
applyTo: '**/*.ts'
---

# @angular/animations Implementation Instructions (Presentation Layer Only)

==================================================
SCOPE DEFINITION (MANDATORY)
==================================================

Animations are a PRESENTATION-ONLY concern.

Animations MUST NOT:
- Trigger domain logic
- Invoke Application Use Cases
- Interact with repositories or infrastructure
- Affect business decisions or workflow control

Animations exist ONLY to express UI state.

==================================================
CRITICAL: Animation Provider Requirement
==================================================

REQUIRED in app.config.ts:
- provideAnimations() MUST be included in application providers
- provideNoopAnimations() MUST NOT be used in production
- Test environments ONLY MAY use provideNoopAnimations()

==================================================
Animation Module Usage
==================================================

REQUIRED:
- Use BrowserAnimationsModule OR provideAnimations() for standalone applications
- NEVER mix module-based and standalone animation providers
- Define animations ONLY in component metadata via the `animations` property

FORBIDDEN:
- Inline animation definitions in templates
- JavaScript-based animations where CSS transitions suffice

==================================================
Trigger-Based Animation Pattern
==================================================

REQUIRED STRUCTURE:
- Use trigger() to define animation name and states
- Use state() for discrete animation states
- Use transition() for state changes
- Use style() for CSS properties
- Use animate() for timing and easing

FORBIDDEN:
- Animations without explicit state definitions
- Side effects inside animation callbacks
- Animation-driven state mutation

==================================================
Performance Optimization (MANDATORY)
==================================================

REQUIRED:
- Animations MUST use GPU-accelerated properties only:
  - transform
  - opacity

FORBIDDEN:
- Animating width, height, top, left, margin, padding
- Layout-thrashing or CPU-intensive animation properties

RECOMMENDED:
- Use :enter and :leave aliases for route-based transitions
- Bind @.disabled for accessibility and reduced-motion preferences

==================================================
Zone-less Angular Compatibility
==================================================

REQUIRED:
- Animations MUST function correctly in zone-less Angular
- NEVER manually trigger change detection for animations
- Use @defer with animations for deferred rendering where appropriate

==================================================
State Management Integration (NgRx Signals)
==================================================

REQUIRED:
- Animation state MUST derive from signal values
- Bind animation triggers using:
  [@triggerName]="signal()"

FORBIDDEN:
- Storing animation state outside signals
- Mutating state inside animation callbacks
- Manual synchronization of animation state

==================================================
Testing Rules
==================================================

REQUIRED:
- Use provideNoopAnimations() in test configuration
- Unit tests MUST NOT assert animation timing

ALLOWED:
- Integration tests MAY verify animation presence or trigger binding

==================================================
ENFORCEMENT CHECKLIST
==================================================

REQUIRED:
- provideAnimations() configured in application
- GPU-accelerated properties only
- Signal-derived animation state
- No animation-triggered side effects

FORBIDDEN:
- provideNoopAnimations() in production
- CPU-intensive animation properties
- Manual change detection for animations
- Animation logic influencing application flow
