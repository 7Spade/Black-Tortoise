---
description: 'Angular Material Best Practices - Modern Component Usage Guide'
applyTo: '**/*.component.ts,**/*.component.html,**/*.theme.scss'
---

# Angular Material Best Practices

## Core Concepts

Angular Material is the official Material Design component library, providing consistent and high-quality UI components. In Angular 20+, special attention must be paid to integration with Standalone Components and Signals.

## Module Import Strategy

### Standalone Components Era
- Import required Material components directly
- Avoid creating large shared modules
- On-demand imports reduce bundle size
- Use tree-shaking to remove unused components

### Import Best Practices
- Only import components actually used
- Use explicit import statements
- Avoid wildcard imports
- Declare in component imports array

## Theme System

### 自訂主題
- 使用 Material 3 主題系統
- Define custom color palette (primary, accent, warn)
- Support dark mode switching
- Use CSS variables to implement dynamic theming

### Theme Architecture
- Define global theme in styles.scss
- Component-level custom styles use `::ng-deep` (use carefully)
- Use Material typography system
- Maintain alignment with Material Design specifications

### Responsive Theming
- Auto-switch based on system preference
- Provide manual switching option for users
- Use Signal to manage theme state
- Persist user preference

## Common Component Patterns

### Form Components
- MatFormField integration with FormControl
- Proper use of mat-label, mat-hint, mat-error
- Validation error display strategy
- Use Signals to manage form state

### Dialog
- Use `inject(MAT_DIALOG_DATA)` to receive data
- Use MatDialogRef to control closing
- Define clear data interfaces
- Handle close results

### Table
- Use MatTableDataSource to manage data
- Integrate sorting, pagination, filtering
- Responsive column configuration
- Virtual scrolling for large datasets

### Menu and Navigation
- MatMenu for dropdown menus
- MatSidenav for sidebars
- MatToolbar for top navigation
- Maintain consistent navigation experience

## Integration with Signals

### State Management
- Use Signal to control component state (open/close, expand/collapse)
- Convert MatDialog results to Signal
- Use `computed()` for derived UI state
- Avoid unnecessary change detection

### Data Binding
- Use Signal inputs to receive data
- MatTable dataSource can be a Signal
- Dynamically update component properties
- Maintain unidirectional data flow

## Accessibility

### ARIA Labels
- Use built-in ARIA support
- Supplement necessary labels for custom components
- Ensure keyboard navigation is available
- Provide appropriate roles and attributes

### Keyboard Support
- All interactive components support keyboard operation
- Appropriate Tab order
- Enter/Space triggers action
- Escape closes dialogs or menus

### Screen Reader
- Notify on dynamic content changes
- Use LiveAnnouncer service
- Provide real-time form error feedback
- Provide text alternatives

## Performance Optimization

### Virtual Scrolling
- Use `cdk-virtual-scroll-viewport` for large lists
- Set appropriate itemSize
- Optimize rendering performance
- Reduce DOM node count

### Lazy Loading
- Use `@defer` to lazy load heavy components
- Lazy load dialog content
- Load tab content on demand
- Reduce initial load time

### Change Detection
- Use OnPush strategy
- Signals automatically optimize detection
- Avoid unnecessary re-rendering
- Use trackBy function

## Responsive Design

### Breakpoint Observer
- Use BreakpointObserver service
- Adjust layout based on screen size
- Define custom breakpoints
- Convert to Signal for use

### Flex Layout
- Use CSS Flexbox and Grid
- Material no longer provides @angular/flex-layout
- Use modern CSS features
- Maintain cross-browser compatibility

### Mobile First
- Prioritize designing mobile interface
- Progressively enhance desktop experience
- Touch-friendly component sizes
- Consider gesture interactions

## Customization and Extension

### Component Wrapper
- Create custom wrapper components
- Encapsulate common configurations
- Maintain Material component API
- Provide additional features

### Style Customization
- Use mixins provided by Material
- Follow Material Design specifications
- Maintain visual consistency
- Avoid breaking component structure

### Design Tokens
- Use design token system
- Define semantic colors
- Support multi-brand theming
- Facilitate maintenance and updates

## Common Component Usage

### Button
- Use appropriate button types (mat-button, mat-raised-button, mat-fab)
- Provide accessible labels
- Display loading state
- Handle disabled state

### Card
- Structure content organization
- Consistent spacing and shadows
- Interactive card handling
- Responsive layout

### Input
- Integration with FormControl
- Display validation errors
- Prefix and suffix icons
- Autocomplete support

### Select
- Single and multi-select modes
- Option groups
- Search filtering
- Custom trigger

## Testing Strategy

### Component Testing
- Use ComponentHarness to test Material components
- Simulate user interaction
- Verify ARIA attributes
- Test responsive behavior

### Integration Testing
- Test dialog opening and closing
- Verify form submission flow
- Test navigation interaction
- Ensure accessibility

## Common Pitfalls

### ❌ Avoid
- Excessive customization deviating from Material Design
- Ignoring accessibility
- Inappropriate use of `::ng-deep`
- Mixing multiple UI frameworks
- Forgetting to import necessary modules

### ⚠️ Notes
- MatFormField needs to wrap form controls
- Handle return value when Dialog closes
- Table needs displayedColumns definition
- Theme changes may require forcing certain components to update

## Version Upgrade

### Material Version Correspondence
- Ensure Material version matches Angular version
- Consult upgrade guide
- Use `ng update` for automatic upgrade
- Test breaking changes

### Migration to Material 3
- Update theme configuration
- Adjust component styles
- Check API changes
- Update custom components

## CDK Integration

### Using CDK Base Features
- Overlay service creates floating layers
- Portal dynamic content projection
- A11y accessibility tools
- Drag and drop functionality

### Custom Component Foundation
- Use CDK to create custom components
- Reuse Material behavior
- Maintain consistency
- Reduce code duplication

## Internationalization (i18n)

### Multi-language Support
- Use Angular i18n system
- Material components have built-in multi-language
- Translate custom labels
- Format dates and numbers

### RTL Support
- Enable RTL layout
- Test bidirectional text
- Mirror icons and animations
- Maintain readability

## Documentation and Learning

### Official Resources
- Material component documentation
- API reference
- Design guidelines
- Examples and playground

### Community Resources
- GitHub discussions
- Stack Overflow
- Blog articles
- Video tutorials

## Project Structure Recommendations

### Component Organization
- Organize Material components by feature module
- Create reusable component wrappers
- Unified style directory
- Shared theme configuration

### Code Standards
- Consistent naming conventions
- Unified import order
- Document reasons for custom styles
- Document special configurations