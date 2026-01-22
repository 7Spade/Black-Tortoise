---
description: 'Angular Material: Material Design UI components, theming, accessibility, and form controls for Angular applications'
applyTo: '**/*.ts'
---

# @angular/material Implementation Instructions

## Animation Provider

**REQUIRED in app.config.ts:**
- `provideAnimations()` MUST be included
- NEVER use `provideNoopAnimations()` in production
- ONLY use `provideNoopAnimations()` in test environments

**FORBIDDEN:** Component styling failures, animations broken

## Module Imports

**REQUIRED:**
- Import specific Material modules: `MatButtonModule`, `MatFormFieldModule`, etc.
- Add modules to component `imports` array
- NEVER import entire Material library

**FORBIDDEN:**
- Wildcard Material imports
- Module-based declarations (use standalone)

## Form Field Wrapper

**REQUIRED:**
- ALL `matInput`, `mat-select`, datepickers MUST be wrapped in `<mat-form-field>`
- `<mat-label>` element REQUIRED in form fields
- Import `MatFormFieldModule` + `MatInputModule`

**FORBIDDEN:**
- `matInput` without `<mat-form-field>` wrapper
- Missing `<mat-label>` elements
- Form fields without proper modules

## Accessibility (WCAG 2.1)

**REQUIRED:**
- `aria-label` on ALL `mat-icon-button` elements
- `<mat-label>` for all form fields
- Keyboard navigation support (Tab, Enter/Space, Arrow keys, Escape)
- Focus indicators visible and compliant

**FORBIDDEN:**
- Icon buttons without `aria-label`
- Missing keyboard navigation
- Invisible focus indicators

## Button Variants

**REQUIRED:**
- `mat-button` for text buttons
- `mat-raised-button` for contained buttons
- `mat-flat-button` for flat colored buttons
- `mat-stroked-button` for outlined buttons
- `mat-icon-button` for icon-only buttons (with `aria-label`)
- `mat-fab` for floating action buttons
- `mat-mini-fab` for small floating action buttons

**FORBIDDEN:**
- Wrong button variant for use case
- Icon buttons without labels

## Table Configuration

**REQUIRED:**
- Define `matColumnDef`, `mat-header-cell`, `mat-cell`
- Reference `displayedColumns` in row definitions
- Import `MatTableModule`
- `matSort` directive on table
- `mat-sort-header` on sortable columns
- Handle `(matSortChange)` event
- Import `MatSortModule`
- `mat-paginator` with `[length]`, `[pageSize]`, `[pageSizeOptions]`
- Handle `(page)` event
- Import `MatPaginatorModule`

**FORBIDDEN:**
- Tables without column definitions
- Missing pagination for large datasets
- Unsorted large tables

## Dialog Pattern

**REQUIRED:**
- `<h2 mat-dialog-title>` for dialog title
- `<mat-dialog-content>` for dialog body
- `<mat-dialog-actions>` for action buttons
- `[mat-dialog-close]` on buttons for auto-close
- Define `width` in dialog config
- Pass `data` for dialog inputs
- Subscribe to `afterClosed()` for result handling
- Import `MatDialogModule`

**FORBIDDEN:**
- Dialogs without proper structure
- Missing dialog data typing
- Unhandled dialog results

## Sidenav Pattern

**REQUIRED:**
- `mat-sidenav-container` (with explicit height)
- `mat-sidenav` (with mode: `over`, `push`, `side`)
- `mat-sidenav-content` for main content
- `mat-nav-list` for navigation items
- `@for` with `track` for list items
- `routerLinkActive` for active states
- Import `MatSidenavModule`, `MatListModule`

**FORBIDDEN:**
- Sidenavs without height on container
- Missing mode configuration
- Lists without track expressions

## Date Picker

**REQUIRED:**
- `provideNativeDateAdapter()` in `app.config.ts`
- `<mat-form-field>` wrapper
- `matDatepicker` directive
- `mat-datepicker-toggle` for picker icon
- Import `MatDatepickerModule`

**FORBIDDEN:**
- Date pickers without adapter
- Missing form field wrapper

## Snackbar

**REQUIRED:**
- Inject `MatSnackBar` service
- Configure `duration`, `horizontalPosition`, `verticalPosition`
- Import `MatSnackBarModule`

**FORBIDDEN:**
- Snackbars without duration
- Missing position configuration

## Card Layout

**REQUIRED:**
- `mat-card` for card container
- `mat-card-header` for card title area
- `mat-card-content` for main content
- `mat-card-actions` for action buttons
- Import `MatCardModule`

## Theming

**REQUIRED:**
- Define Material theme in global styles
- Use Material Design 3 color system
- Configure typography scale
- Set density scale if needed

**FORBIDDEN:**
- Custom colors outside theme
- Hardcoded Material colors

## Performance

**REQUIRED:**
- Virtual scrolling for lists >100 items (use CDK)
- Lazy loading for heavy Material components
- `OnPush` change detection with signals

**FORBIDDEN:**
- Large un-virtualized lists
- Eager loading of all Material modules

## Testing

**REQUIRED:**
- `provideAnimations()` in test configuration
- Import Material modules in test setup
- Test accessibility compliance

**FORBIDDEN:**
- Tests without animation provider
- Missing Material module imports

## Enforcement Checklist

**REQUIRED:**
- `provideAnimations()` in app config
- Specific module imports
- `<mat-form-field>` wrapper for inputs
- `aria-label` on icon buttons
- Keyboard navigation support
- Dialog structure with proper sections
- Date picker adapter configuration
- Proper theming setup

**FORBIDDEN:**
- `provideNoopAnimations()` in production
- Wildcard Material imports
- Inputs without form field wrappers
- Missing accessibility attributes
- Icon buttons without labels
