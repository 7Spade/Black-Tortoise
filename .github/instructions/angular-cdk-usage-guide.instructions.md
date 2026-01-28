---
description: 'Angular CDK Usage Guide - Powerful Toolkit Without UI'
applyTo: '**/*.component.ts,**/*.directive.ts,**/*.service.ts'
---

# Angular CDK Usage Guide

## Core Concepts

Angular Component Dev Kit (CDK) is a set of behavioral primitives and tools for building high-quality UI components. CDK provides unstyled, functional implementations that serve as the foundation for custom components.

## CDK Main Modules

### Overlay (Floating Layer)
Provides positioning and management system for floating panels:
- Create popups, dropdowns, dialogs
- Flexible positioning strategies
- Scrolling and resizing handling
- Background mask management
- Keyboard and focus management

### Portal (Entry Point)
Dynamic content projection mechanism:
- ComponentPortal - Dynamically load components
- TemplatePortal - Project template content
- DomPortal - Project DOM elements
- Pass content across component boundaries
- Lazy instantiation

### A11y (Accessibility)
Accessibility toolkit:
- FocusTrap - Focus trap
- FocusMonitor - Monitor focus state
- LiveAnnouncer - Announce dynamic content
- AriaDescriber - ARIA description management
- InteractivityChecker - Interactivity checking

### Layout (Layout)
Responsive layout tools:
- BreakpointObserver - Listen to breakpoints
- MediaMatcher - Media query matching
- Predefined breakpoints (Handset, Tablet, Web)
- Custom breakpoint support

### Scrolling (Scrolling)
Scrolling-related functionality:
- Virtual Scrolling - Virtual scrolling
- Scroll Dispatcher - Scroll event dispatch
- Viewport Ruler - Viewport size tracking
- High-performance large list rendering

### Drag and Drop (Drag and Drop)
Drag and drop functionality:
- CdkDrag - Draggable elements
- CdkDropList - Drop container
- List sorting
- Cross-list movement
- Custom preview and placeholder

## Overlay Deep Usage

### Creating an Overlay
Basic process:
1. Inject the Overlay service
2. Create OverlayConfig
3. Create OverlayRef
4. Attach Portal

### Positioning Strategies
- **GlobalPositionStrategy**: Global positioning (relative to viewport)
- **FlexibleConnectedPositionStrategy**: Flexible connected positioning (relative to element)
- **ConnectionPositionPair**: Define connection point pairs

### Scrolling Strategies
- **NoopScrollStrategy**: No scroll handling
- **CloseScrollStrategy**: Close on scroll
- **BlockScrollStrategy**: Block scrolling
- **RepositionScrollStrategy**: Reposition on scroll

### Background Mask
- Customize background color and opacity
- Click background to close
- Prevent content scrolling
- Z-index management

## Portal Application Scenarios

### Dynamic Component Loading
Applicable scenarios:
- Dialog content
- Dynamic forms
- Lazy-loaded widgets
- Conditional UI blocks

### Template Projection
Applicable scenarios:
- Reuse template content
- Cross-component projection
- Dynamic content switching
- Slot-based design

### Best Practices
- Correctly manage Portal lifecycle
- Detach promptly to avoid memory leaks
- Use ComponentRef to control component instances
- Handle Portal attachment failures

## A11y Tools Application

### FocusTrap
Use cases:
- Modal dialogs
- Sidebars
- Popup menus
- Ensure keyboard users don't lose focus

Implementation points:
- Auto-focus when opening
- Tab cycle limited to region
- Escape key closes
- Focus restoration on close
- 關閉後恢復原始焦點

### FocusMonitor
監控焦點狀態:
- 追蹤元素獲得/失去焦點
- 區分鍵盤和滑鼠焦點
- 添加視覺焦點指示器
- 整合到自訂元件

### LiveAnnouncer
動態內容宣告:
- 通知螢幕閱讀器內容變更
- 表單驗證錯誤
- 載入狀態更新
- 操作結果回饋

## BreakpointObserver 響應式設計

### Listening to Breakpoint Changes
Integration patterns:
- Subscribe to breakpoint Observable
- Use `toSignal()` to convert to Signal
- Adjust layout based on breakpoint
- Dynamically load components or resources

### Custom Breakpoints
Define business-specific breakpoints:
- Define based on design requirements
- Support complex media queries
- Combine multiple conditions
- Keep responsive logic centralized

### Integration with Signals
Reactive state management:
- Breakpoint state as Signal
- Use `computed()` to derive UI state
- Automatically update layout
- Reduce manual subscriptions

## Virtual Scrolling Performance Optimization

### CdkVirtualScrollViewport
Large list rendering:
- Render only visible items
- Dynamically recycle DOM nodes
- Support fixed or dynamic height
- Significantly improve performance

### Setting Item Size
Two modes:
- **Fixed size**: Set itemSize
- **Dynamic size**: Provide itemSize function

### Integration with Signals
Data flow integration:
- Data source as Signal
- Auto-respond to data changes
- Maintain scroll position
- Optimize change detection

### Applicable Scenarios
- Long lists (thousands of records)
- Chat message history
- Infinite scrolling
- Large tables

## Drag and Drop Implementation

### Basic Drag and Drop
Setup steps:
1. Add `cdkDrag` to draggable element
2. Add `cdkDropList` to container
3. Handle `cdkDropListDropped` event
4. Update data model

### Drag and Drop Constraints
Control behavior:
- Limit drag axis (horizontal/vertical)
- Set drag boundaries
- Disable drag on specific items
- Customize drag handle

### Cross-List Drag and Drop
Advanced features:
- Connect multiple drop lists
- Set `cdkDropListConnectedTo`
- Handle cross-list data transfer
- Validate drop validity

### Custom Preview
Visual feedback:
- Customize preview element during drag
- Set placeholder styles
- Animation effects
- Drag-drop indicators

## Integration Patterns with Signals

### Observable to Signal
Common conversions:
- BreakpointObserver → Signal
- ScrollDispatcher → Signal
- FocusMonitor → Signal
- Overlay state → Signal

### Reactive UI Updates
Integration advantages:
- Automatic change detection
- Reduce manual subscriptions
- Clearer data flow
- Better performance

## Custom Component Building

### Using CDK as Foundation
Design patterns:
- Reuse CDK behavioral logic
- Add custom styles and features
- Maintain accessibility
- Meet business requirements

### Combining Multiple CDK Features
Complex components:
- Overlay + Portal + FocusTrap
- VirtualScroll + DragDrop
- Layout + A11y
- Create powerful custom components

## Performance Considerations

### Overlay Performance
Optimization:
- Reuse OverlayRef rather than creating repeatedly
- Use appropriate scroll strategy
- Destroy overlays promptly when not needed
- Avoid excessive nesting levels

### Virtual Scrolling Tuning
Optimization tips:
- Choose appropriate itemSize
- Use trackBy function
- Avoid complex templates
- Test performance on different devices

### Drag and Drop Optimization
Performance improvement:
- Limit number of draggable items
- Use simple preview elements
- Avoid excessive animations
- Test performance on large lists

## Testing Strategy

### CDK Component Testing
Test focus:
- Use ComponentHarness
- Simulate drag and drop operations
- Verify focus management
- Test responsive behavior

### Overlay Testing
Test items:
- Overlay open and close
- Positioning accuracy
- Background click behavior
- Keyboard interaction

## Common Patterns

### Dropdown Menu
Combined use:
- Overlay provides positioning
- Portal projects content
- FocusTrap manages focus
- Click outside closes

### Dialog
Complete solution:
- Overlay as container
- Portal loads dialog content
- Background mask
- FocusTrap focus management
- Keyboard event handling

### Tooltip
Lightweight implementation:
- Overlay simple positioning
- Delayed show/hide
- No background mask
- Auto close on mouse out

### Sidebar
Full functionality:
- Overlay or fixed positioning
- Slide in/out animation
- Background mask optional
- Responsive behavior

## Common Pitfalls

### ❌ Should Avoid
- Forgetting to detach Portal causing memory leaks
- Overlay z-index management confusion
- Ignoring accessibility
- Virtual Scrolling with itemSize too small
- Not updating data model during drag and drop

### ⚠️ Cautions
- Overlay updates under OnPush strategy
- Portal attachment timing
- Completeness of focus management
- Accuracy of responsive breakpoints

## Advanced Techniques

### Custom Overlay Positioning
Precise control:
- Create custom positioning strategy
- Consider scrolling and window resize
- Handle edge cases
- Smooth transition animation

### Optimizing Virtual Scrolling
Advanced configuration:
- Customize VirtualScrollStrategy
- Dynamically adjust buffer size
- Handle irregular item heights
- Integrate infinite scrolling

### Complex Drag and Drop Logic
Business integration:
- Custom drag and drop validation
- Multi-directional dragging
- Nested drag and drop lists
- Drag and drop animation and transitions

## Documentation and Resources

### Official Documentation
- CDK API Reference
- Component examples
- Guides and tutorials
- Source code comments

### Learning Path
1. Understand basic concepts
2. Implement simple examples
3. Study Material source code
4. Build custom components
5. Optimize and test

## Project Integration

### Introducing CDK
Setup steps:
- Install @angular/cdk
- Import modules as needed
- Configure necessary styles
- Configure theme (if needed)

### Team Collaboration
Best practices:
- Document CDK usage patterns
- Create reusable wrappers
- Unified naming conventions
- Code review points