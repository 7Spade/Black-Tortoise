---
description: 'Angular Material enforcement: modular imports, animation requirements, form field wrappers, accessibility constraints'
applyTo: '**/*.ts, **/*.html'
---

# Angular Material Rules

## CRITICAL: Core Requirements

**Animation Provider (app.config.ts):**
- MUST include `provideAnimations()` or `provideNoopAnimations()` (test only)
- FORBIDDEN: Applications without animation provider
- VIOLATION: Runtime errors, no animations

**Modular Imports:**
- MUST use specific imports: `import { MatButtonModule } from '@angular/material/button'`
- FORBIDDEN: `import * as Material from '@angular/material'`
- VIOLATION: Increased bundle size, poor tree-shaking

**Theme Configuration (styles.scss):**
- MUST include: `@use '@angular/material' as mat; @include mat.core(); @include mat.all-component-themes($theme);`

**mat-form-field Wrapper:**
- ALL `matInput`, `mat-select`, datepicker inputs MUST be wrapped in `<mat-form-field>`
- MUST include `<mat-label>` element
- MUST import `MatFormFieldModule` + `MatInputModule`
- VIOLATION: Styling failures, accessibility violations

**Accessibility (WCAG 2.1):**
- ALL `mat-icon-button` MUST have `aria-label` attribute
- ALL form fields MUST have `<mat-label>` element
- MUST support keyboard navigation (Tab, Enter/Space, Arrow keys, Escape)
- Custom focus MUST use `FocusMonitor` from `@angular/cdk/a11y` with cleanup in `ngOnDestroy()`
- VIOLATION: Screen reader failures, WCAG compliance failure

## Component Rules

**Buttons:**
- Variants: `mat-button`, `mat-raised-button`, `mat-flat-button`, `mat-stroked-button`, `mat-icon-button`, `mat-fab`, `mat-mini-fab`
- Icon buttons: `<button mat-icon-button aria-label="Action"><mat-icon>icon</mat-icon></button>`

**Tables:**
- MUST define: `matColumnDef`, `mat-header-cell`, `mat-cell`, `mat-header-row`, `mat-row`
- MUST reference `displayedColumns` in row definitions
- Sorting: `matSort` on table, `mat-sort-header` on columns, handle `(matSortChange)`
- Pagination: `mat-paginator` with `[length]`, `[pageSize]`, `[pageSizeOptions]`, handle `(page)`
- Import: `MatTableModule`, `MatSortModule`, `MatPaginatorModule`

**Dialogs:**
- MUST use: `<h2 mat-dialog-title>`, `<mat-dialog-content>`, `<mat-dialog-actions>`
- MUST use `[mat-dialog-close]` on buttons
- Configuration: `width`, `data`, subscribe to `afterClosed()`
- Import: `MatDialogModule`, inject `MatDialog`, `MAT_DIALOG_DATA`

**Sidenav:**
- Structure: `mat-sidenav-container` (with height) > `mat-sidenav` (with mode) + `mat-sidenav-content`
- Navigation: `mat-nav-list` with `@for` (MUST include `track`), `routerLinkActive`
- Import: `MatSidenavModule`, `MatListModule`

**Date Picker:**
- MUST provide `provideNativeDateAdapter()` in `app.config.ts`
- MUST use `mat-form-field` wrapper, `matDatepicker` directive, `mat-datepicker-toggle`

**Snackbar:**
- Import: `MatSnackBarModule`, inject `MatSnackBar`
- MUST configure: `duration`, `horizontalPosition`, `verticalPosition`

**Cards:**
- Sections: `mat-card`, `mat-card-header`, `mat-card-content`, `mat-card-actions`

## Performance

- Lists >100 items MUST use `<cdk-virtual-scroll-viewport itemSize="50">` from `ScrollingModule`
- Heavy components MUST be lazy loaded
- SHOULD use `OnPush` change detection with signals

## Testing

**REQUIRED test configuration:**
```typescript
TestBed.configureTestingModule({
  imports: [MyComponent],
  providers: [provideAnimations()] // REQUIRED
});
```
- VIOLATION: Test failures, animation timing issues
