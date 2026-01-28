---
description: 'Angular Modern Animations API - Performance and Experience Optimization'
applyTo: '**/*.component.ts,**/*.animations.ts'
---

# Angular Modern Animations API

## Core Concepts
- Web Animations API
- Signals Integration
- Modern Control Flow Integration

## Animation Module Setup
- provideAnimations() / provideNoopAnimations()
- BrowserAnimationsModule (non-standalone)
- Import animation functions on demand
- Enable in production, disable in tests
- User preferences and low-performance detection

## Animation Definition Methods
- @Component animations array
- Separable files
- Named triggers
- trigger / state / transition / style / animate
- Explicit and wildcard states, bidirectional transitions

## Common Animation Patterns
- Enter/Leave animations
- State transition animations
- List animations
- Route animations

## Animation Timing and Easing
- Single value or full format
- ease, ease-in/out, linear, cubic-bezier
- Selection principles: ease-out for enter, ease-in for leave

## Advanced Animation Techniques
- Sequences and parallel (sequence, group, stagger)
- Animation callbacks (@trigger.start / done)
- Parameterization (params)
- Query child elements (query(), animateChild())

## Integration with Signals
- Signal values trigger animations
- computed() calculates animation state
- effect() executes animations
- SignalStore animation state management

## Performance Optimization
- GPU acceleration for transform / opacity
- Avoid layout property animations
- will-change CSS
- Limit concurrent animations
- Simplify animation steps
- Clean up animation listeners / virtual scrolling

## Accessibility Considerations
- prefers-reduced-motion detection
- Screen reader friendly
- Provide text alternatives
- Recommended animation times: simple 100-200ms, complex 200-400ms

## Testing Strategy
- provideNoopAnimations() to disable animations
- Verify trigger logic and completion state
- Mock callbacks
- Chrome DevTools Animation panel

## Common Animation Scenarios
- Notifications / Toast
- Accordion / Collapsible panels
- Loading indicators (spinner / progress)
- Modal dialogs
- Card flip 3D effects

## Animations and Routing
- Route configuration data.animation
- RouterOutlet bind triggers
- Fade, slide, scale
- Keep animations short and performant

## Animation Libraries and Resources
- ng-animate, Material animations
- Custom animation collections
- Design inspiration: Material / iOS / Dribbble

## Common Patterns and Anti-patterns
- ✅ GPU acceleration, short animations, callbacks, reduced-motion
- ❌ width/height/top/left animations, too long, too many elements, ignore accessibility, complex logic

## Animation Debugging
- Not triggered / flickering / stuttering / conflicts
- Chrome DevTools / Angular DevTools / Browser performance analysis / logs

## Future Trends
- Web Animations API improvements
- Better Signals integration
- API simplification and type strengthening
- Visual animation tools

## Learning Resources
- Official documentation, API reference, examples, best practices
- Learning path: Syntax → Common effects → Performance → Advanced techniques → Animation libraries

## Project Integration
- Separate animations.ts file
- Classify by functionality, reusable, naming conventions
- Document animation purpose and parameters
- Provide examples and previews
- Code review focusing on performance
- Establish animation design standards
