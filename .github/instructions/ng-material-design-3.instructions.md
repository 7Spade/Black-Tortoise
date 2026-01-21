---
description: 'Material Design 3 enforcement: design token usage, color roles, typography constraints, elevation rules, and WCAG accessibility requirements'
applyTo: '**/*.scss, **/*.css, **/theme*.ts'
---

# Material Design 3 Rules

## CRITICAL: Design Token Enforcement

ALL styling MUST use Material Design 3 design tokens exclusively. Direct color values are FORBIDDEN.

**VIOLATION consequences:**
- Theme switching failures
- Accessibility violations
- Design inconsistency
- Failed WCAG compliance

## CRITICAL: Color System Constraints

**REQUIRED color roles ONLY:**
```scss
// Primary colors (REQUIRED for all components)
--mat-sys-primary
--mat-sys-on-primary
--mat-sys-primary-container
--mat-sys-on-primary-container

// Secondary colors (REQUIRED for supporting actions)
--mat-sys-secondary
--mat-sys-on-secondary
--mat-sys-secondary-container
--mat-sys-on-secondary-container

// Tertiary colors (REQUIRED for accents)
--mat-sys-tertiary
--mat-sys-on-tertiary
--mat-sys-tertiary-container
--mat-sys-on-tertiary-container

// Error colors (REQUIRED for error states)
--mat-sys-error
--mat-sys-on-error
--mat-sys-error-container
--mat-sys-on-error-container

// Surface colors (REQUIRED for backgrounds)
--mat-sys-surface
--mat-sys-on-surface
--mat-sys-surface-variant
--mat-sys-on-surface-variant
--mat-sys-surface-container
--mat-sys-surface-container-high
--mat-sys-surface-container-highest

// Outline colors (REQUIRED for borders)
--mat-sys-outline
--mat-sys-outline-variant
```

**FORBIDDEN:**
- Hardcoded hex colors (`#ffffff`, `#000000`)
- RGB/RGBA values outside design tokens
- HSL values
- Named colors (`white`, `black`, `red`)
- Custom color properties not in M3 specification

## CRITICAL: Typography Token Requirements

ALL text MUST use M3 typography scale tokens.

**REQUIRED tokens:**
```scss
// Display (page titles)
--mat-sys-display-large
--mat-sys-display-medium
--mat-sys-display-small

// Headline (section headers)
--mat-sys-headline-large
--mat-sys-headline-medium
--mat-sys-headline-small

// Title (subsection headers)
--mat-sys-title-large
--mat-sys-title-medium
--mat-sys-title-small

// Body (content text)
--mat-sys-body-large
--mat-sys-body-medium
--mat-sys-body-small

// Label (UI labels)
--mat-sys-label-large
--mat-sys-label-medium
--mat-sys-label-small
```

**FORBIDDEN:**
- Direct font-size, font-weight, line-height definitions
- Custom font stacks outside theme configuration
- Pixel-based font sizes
- Unitless line-heights

## CRITICAL: Elevation Token Enforcement

ALL shadows and elevation MUST use M3 elevation tokens.

**REQUIRED elevation levels:**
```scss
--mat-sys-level0  // Flat surfaces
--mat-sys-level1  // Slight elevation
--mat-sys-level2  // Cards, raised surfaces
--mat-sys-level3  // Dialogs, modals
--mat-sys-level4  // Floating action buttons
--mat-sys-level5  // Maximum elevation
```

**FORBIDDEN:**
- Custom box-shadow values
- Drop-shadow filters outside M3 system
- Hardcoded shadow definitions

## CRITICAL: Shape System Constraints

ALL border-radius MUST use M3 corner tokens.

**REQUIRED corner radius tokens:**
```scss
--mat-sys-corner-none       // No rounding
--mat-sys-corner-extra-small
--mat-sys-corner-small
--mat-sys-corner-medium
--mat-sys-corner-large
--mat-sys-corner-extra-large
--mat-sys-corner-full       // Fully rounded (pills)
```

**FORBIDDEN:**
- Direct border-radius pixel values
- Percentage values outside `--mat-sys-corner-full`
- Custom rounding not in specification

## CRITICAL: Theme Configuration Requirements

**REQUIRED theme structure:**
```scss
@use '@angular/material' as mat;

@include mat.core();

$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  ),
  typography: (
    brand-family: 'Roboto',
    plain-family: 'Roboto',
    bold-weight: 700,
    medium-weight: 500,
    regular-weight: 400,
  ),
  density: (
    scale: 0
  )
));

@include mat.all-component-themes($theme);
```

**REQUIRED for dark theme:**
```scss
$dark-theme: mat.define-theme((
  color: (
    theme-type: dark,
    primary: mat.$azure-palette,
    tertiary: mat.$blue-palette,
  )
));

.dark-theme {
  @include mat.all-component-colors($dark-theme);
}
```

**FORBIDDEN:**
- Material Design 2 `mat.define-light-theme()` or `mat.define-dark-theme()`
- Color palettes outside `mat.define-theme()`
- Custom color interpolation
- Theme mixing without proper scoping

## CRITICAL: State Layer Opacity Constraints

Interactive elements MUST implement M3 state layers with exact opacity values.

**REQUIRED state layer opacities:**
```scss
.interactive-element {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: var(--mat-sys-on-surface);
    opacity: 0;
    transition: opacity 200ms;
  }
  
  &:hover::before {
    opacity: 0.08;  // REQUIRED hover state
  }
  
  &:focus::before {
    opacity: 0.12;  // REQUIRED focus state
  }
  
  &:active::before {
    opacity: 0.16;  // REQUIRED pressed state
  }
}
```

**FORBIDDEN:**
- Custom opacity values outside specification
- Background color changes instead of state layers
- Missing state layer pseudo-elements

## CRITICAL: Accessibility Constraints

**REQUIRED WCAG contrast ratios:**
- Normal text (< 18.5px): MUST maintain 4.5:1 minimum contrast
- Large text (≥ 18.5px or ≥ 24px): MUST maintain 3:1 minimum contrast
- UI components: MUST maintain 3:1 minimum contrast

**REQUIRED focus indicators:**
```scss
.focusable-element {
  outline: none;
  
  &:focus-visible {
    outline: 2px solid var(--mat-sys-primary);
    outline-offset: 2px;
  }
}
```

**REQUIRED touch targets:**
```scss
.touch-target {
  min-width: 48px;   // REQUIRED minimum
  min-height: 48px;  // REQUIRED minimum
}
```

**FORBIDDEN:**
- `outline: none` without `:focus-visible` replacement
- Touch targets smaller than 48x48dp
- Interactive elements without visible focus state
- Color-only information (MUST include icons/text)

**VIOLATION consequences:**
- WCAG AA compliance failures
- Keyboard navigation failures
- Screen reader incompatibility
- Touch input failures on mobile

## CRITICAL: Responsive Breakpoint Requirements

**REQUIRED Material Design breakpoints ONLY:**
```scss
$breakpoints: (
  handset: '(max-width: 599px)',
  tablet: '(min-width: 600px) and (max-width: 959px)',
  desktop: '(min-width: 960px)',
  large-desktop: '(min-width: 1280px)'
);
```

**FORBIDDEN:**
- Custom breakpoint values
- Bootstrap or other framework breakpoints
- Arbitrary pixel values

## Component Pattern Enforcement

**REQUIRED button implementation:**
```scss
.m3-button {
  padding: 10px 24px;
  border-radius: var(--mat-sys-corner-full);
  font: var(--mat-sys-label-large);
  border: none;
  
  &.filled {
    background-color: var(--mat-sys-primary);
    color: var(--mat-sys-on-primary);
  }
  
  &.outlined {
    background-color: transparent;
    border: 1px solid var(--mat-sys-outline);
    color: var(--mat-sys-primary);
  }
  
  &.text {
    background-color: transparent;
    color: var(--mat-sys-primary);
  }
}
```

**REQUIRED card implementation:**
```scss
.m3-card {
  background-color: var(--mat-sys-surface);
  border-radius: var(--mat-sys-corner-large);
  padding: 16px;
  
  &.elevated {
    box-shadow: var(--mat-sys-level2);
  }
  
  &.outlined {
    border: 1px solid var(--mat-sys-outline-variant);
  }
}
```

**FORBIDDEN:**
- Hardcoded padding values without design token reference
- Custom button/card variants outside M3 specification
- Mixing elevated and outlined styles

## Performance Constraints

**REQUIRED for animations:**
```scss
// MUST use transform for position changes
.animated-element {
  transform: translateY(0);
  transition: transform 200ms;
  
  &.moved {
    transform: translateY(100px);
  }
}
```

**FORBIDDEN:**
- Animating `top`, `left`, `right`, `bottom` properties
- Transitions exceeding 400ms without justification
- Non-hardware-accelerated properties in animations

## Migration Requirements

When migrating from Material Design 2:

**IMMEDIATELY replace:**
- `mat.define-light-theme()` → `mat.define-theme((color: (theme-type: light)))`
- `mat.define-dark-theme()` → `mat.define-theme((color: (theme-type: dark)))`
- Color palette references → M3 design tokens
- Typography levels → M3 typography tokens
- Elevation mixins → M3 elevation tokens

**FORBIDDEN in migrated code:**
- Any M2 API usage
- Mixed M2/M3 implementations
- Legacy color palette system

## Enforcement Summary

**REQUIRED in ALL styling:**
- M3 design tokens for colors, typography, elevation, shape
- WCAG AA contrast ratios
- Proper state layers with exact opacities
- Material Design breakpoints
- Focus indicators on interactive elements
- Minimum 48x48dp touch targets

**FORBIDDEN in ALL styling:**
- Hardcoded colors, shadows, typography
- Custom values outside M3 specification
- M2 APIs or patterns
- Accessibility violations
- Performance anti-patterns
