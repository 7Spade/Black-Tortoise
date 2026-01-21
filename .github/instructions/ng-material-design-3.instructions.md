---
description: 'Material Design 3 enforcement: design token usage, color roles, typography constraints, elevation rules, and WCAG accessibility requirements'
applyTo: '**/*.scss, **/*.css, **/theme*.ts'
---

# Material Design 3 Rules

## CRITICAL: Design Token Enforcement

ALL styling MUST use M3 design tokens exclusively. Direct color/shadow/typography values are FORBIDDEN.

**VIOLATION consequences:** Theme switching failures, accessibility violations, design inconsistency, WCAG compliance failures

## Core Token Requirements

| Token Category | Required Tokens | Forbidden Alternatives |
|----------------|-----------------|------------------------|
| **Color** | `--mat-sys-{primary,secondary,tertiary,error,surface,outline}` + on-variants + containers | Hex colors, RGB/RGBA, HSL, named colors |
| **Typography** | `--mat-sys-{display,headline,title,body,label}-{large,medium,small}` | Direct font-size/weight/line-height, pixel values |
| **Elevation** | `--mat-sys-level{0-5}` | Custom box-shadow, drop-shadow filters |
| **Shape** | `--mat-sys-corner-{none,extra-small,small,medium,large,extra-large,full}` | Direct border-radius pixels/percentages |
| **Breakpoints** | `handset: 599px, tablet: 600-959px, desktop: 960px+, large: 1280px+` | Bootstrap/custom breakpoints |

## Theme Configuration

Use `mat.define-theme()` ONLY. M2 APIs (`mat.define-light-theme()`, `mat.define-dark-theme()`) are FORBIDDEN.

## State Layers

Interactive elements MUST use exact opacity values:
- **Hover:** `0.08`
- **Focus:** `0.12`
- **Active:** `0.16`

Apply to `::before` pseudo-element with `var(--mat-sys-on-surface)` background.

## WCAG Accessibility Requirements

| Requirement | Specification | Forbidden |
|-------------|---------------|-----------|
| **Contrast Ratios** | Normal text: 4.5:1 min, Large text: 3:1 min, UI: 3:1 min | Color-only information |
| **Focus Indicators** | 2px solid `var(--mat-sys-primary)`, 2px offset on `:focus-visible` | `outline: none` without replacement |
| **Touch Targets** | 48x48dp minimum | Targets <48x48dp |

## Performance Rules

- Animate `transform` ONLY (not `top`/`left`/`right`/`bottom`)
- Transitions ≤400ms unless justified
- Hardware-accelerated properties only

## Migration from M2

Replace immediately:
- `mat.define-light-theme()` → `mat.define-theme((color: (theme-type: light)))`
- `mat.define-dark-theme()` → `mat.define-theme((color: (theme-type: dark)))`
- All color/typography/elevation references → M3 tokens

## Enforcement Summary

**REQUIRED:** M3 tokens for all styling, WCAG AA contrast, proper state layers, MD breakpoints, focus indicators, 48x48dp touch targets

**FORBIDDEN:** Hardcoded values, M2 APIs, accessibility violations, performance anti-patterns
