---
description: 'Angular Material enforcement: modular imports, animation requirements, form field wrappers, accessibility constraints, and component-specific rules'
applyTo: '**/*.ts, **/*.html'
---

# Angular Material Rules

## CRITICAL: Animation Configuration

ALL standalone applications MUST provide animations. Missing animations provider is FORBIDDEN.

**REQUIRED configuration:**
```typescript
// app.config.ts
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(), // REQUIRED
    // or provideNoopAnimations() for testing only
  ]
};
```

**FORBIDDEN:**
- Applications without `provideAnimations()` or `provideNoopAnimations()`
- Material components without animation support

**VIOLATION consequences:**
- Components will not animate
- Runtime errors in Material components
- Poor user experience

## CRITICAL: Modular Import Enforcement

ALL Material components MUST use specific module imports. Wildcard imports are FORBIDDEN.

**REQUIRED pattern:**
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule],
})
```

**FORBIDDEN:**
```typescript
import * as Material from '@angular/material'; // FORBIDDEN
```

**VIOLATION consequences:**
- Increased bundle size
- Longer compilation times
- Difficult tree-shaking

## CRITICAL: Theme Integration

Material theme MUST be loaded in global styles. Missing theme configuration is FORBIDDEN.

**REQUIRED in `styles.scss`:**
```scss
@use '@angular/material' as mat;
@include mat.core();
@include mat.all-component-themes($my-theme);
```

**FORBIDDEN:**
- Applications without theme configuration
- Component-level theme includes

## Form Control Enforcement

### CRITICAL: mat-form-field Wrapper Requirement

ALL `matInput` directives MUST be wrapped in `mat-form-field`. Standalone inputs are FORBIDDEN.

**REQUIRED pattern:**
```typescript
<mat-form-field appearance="outline">
  <mat-label>Email</mat-label>
  <input matInput [formControl]="email">
  @if (email.hasError('required')) {
    <mat-error>Email is required</mat-error>
  }
</mat-form-field>
```

**FORBIDDEN:**
```html
<input matInput> <!-- FORBIDDEN: missing mat-form-field wrapper -->
```

**VIOLATION consequences:**
- Styling failures
- Missing form field features (labels, hints, errors)
- Accessibility violations

### Input Field Requirements

**REQUIRED imports:**
- `MatFormFieldModule` - MUST be imported
- `MatInputModule` - MUST be imported for matInput directive

**REQUIRED validation display:**
- `@if (control.hasError())` - MUST show specific error messages
- `mat-error` - MUST be used for error display

### Select Dropdown Constraints

**REQUIRED:**
- `mat-select` MUST be wrapped in `mat-form-field`
- `@for` loop MUST use `track` expression

**FORBIDDEN:**
- Select elements without `mat-form-field` wrapper
- Missing `track` in `@for` loops

### Date Picker Configuration

**REQUIRED in `app.config.ts`:**
```typescript
providers: [
  provideNativeDateAdapter() // REQUIRED for date picker functionality
]
```

**REQUIRED:**
- `MatDatepickerModule` import
- `mat-form-field` wrapper for datepicker input
- `matDatepicker` directive on input
- `mat-datepicker-toggle` for user interaction

**FORBIDDEN:**
- Datepicker without `provideNativeDateAdapter()`
- Missing datepicker toggle

## Button Component Rules

**REQUIRED button directives:**
- `mat-button` - basic flat button
- `mat-raised-button` - elevated button for primary actions
- `mat-flat-button` - filled button without elevation
- `mat-stroked-button` - outlined button for secondary actions
- `mat-icon-button` - icon-only button
- `mat-fab` - floating action button
- `mat-mini-fab` - small floating action button

**CRITICAL: Icon Button Accessibility**

ALL `mat-icon-button` elements MUST have `aria-label` attribute. Missing labels are FORBIDDEN.

**REQUIRED:**
```html
<button mat-icon-button aria-label="Delete item">
  <mat-icon>delete</mat-icon>
</button>
```

**FORBIDDEN:**
```html
<button mat-icon-button> <!-- FORBIDDEN: missing aria-label -->
  <mat-icon>delete</mat-icon>
</button>
```

**VIOLATION consequences:**
- Accessibility failures
- Screen reader cannot identify button purpose
- WCAG compliance violations

## Navigation Component Enforcement

### Toolbar Requirements

**REQUIRED imports:**
- `MatToolbarModule` - MUST be imported

**REQUIRED structure:**
- `mat-toolbar` - root element
- `color` attribute - MUST specify theme color (primary/accent/warn)

**Icon buttons in toolbar:**
- MUST have `aria-label` for accessibility
- MUST use `mat-icon-button` directive

### Sidenav Constraints

**REQUIRED imports:**
- `MatSidenavModule` - MUST be imported
- `MatListModule` - MUST be imported for navigation lists

**REQUIRED structure:**
- `mat-sidenav-container` - root wrapper (MUST have height set)
- `mat-sidenav` - side panel (MUST specify mode: side/over/push)
- `mat-sidenav-content` - main content area

**Navigation list requirements:**
- `mat-nav-list` - MUST be used for navigation items
- `@for` loop - MUST include `track` expression
- `routerLinkActive` - MUST be applied for active state styling

**FORBIDDEN:**
- Sidenav without container
- Missing height on sidenav-container
- Navigation items without track expression

## Table Component Enforcement

**REQUIRED imports:**
- `MatTableModule` - MUST be imported
- `MatSortModule` - MUST be imported for sorting functionality
- `MatPaginatorModule` - MUST be imported for pagination

**CRITICAL: Row Definition Requirements**

ALL mat-table elements MUST define both header and data rows. Missing row definitions are FORBIDDEN.

**REQUIRED structure:**
```html
<table mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="column">
    <th mat-header-cell *matHeaderCellDef>Header</th>
    <td mat-cell *matCellDef="let item">{{ item.column }}</td>
  </ng-container>
  
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

**REQUIRED:**
- `matColumnDef` - MUST define unique column identifier
- `mat-header-cell` - MUST be present for each column
- `mat-cell` - MUST be present for each column
- `mat-header-row` - MUST reference `displayedColumns`
- `mat-row` - MUST reference `displayedColumns`

**Sorting constraints:**
- `matSort` directive - MUST be on `<table>` element
- `mat-sort-header` - MUST be on sortable `<th>` elements
- `(matSortChange)` - MUST handle sort events

**Pagination requirements:**
- `mat-paginator` - MUST be present for paginated tables
- `[length]` - MUST bind total item count
- `[pageSize]` - MUST specify page size
- `[pageSizeOptions]` - MUST provide size options
- `(page)` - MUST handle page change events

**FORBIDDEN:**
- Tables without row definitions
- Missing `displayedColumns` binding
- Pagination without total length binding

## Card Component Rules

**REQUIRED imports:**
- `MatCardModule` - MUST be imported

**REQUIRED card sections:**
- `mat-card` - root wrapper
- `mat-card-header` - optional header section
- `mat-card-content` - content section
- `mat-card-actions` - optional actions section

**FORBIDDEN:**
- Card content without proper sectioning
- Missing semantic card elements

## Dialog Enforcement

**REQUIRED imports:**
- `MatDialogModule` - MUST be imported
- `MatDialog` service - MUST be injected for opening dialogs
- `MAT_DIALOG_DATA` - MUST be injected in dialog component for data access

**CRITICAL: Dialog Structure Requirements**

ALL dialog components MUST use proper dialog sections. Missing sections are FORBIDDEN.

**REQUIRED dialog sections:**
```html
<h2 mat-dialog-title>{{ title }}</h2>
<mat-dialog-content>
  <!-- content -->
</mat-dialog-content>
<mat-dialog-actions align="end">
  <!-- actions -->
</mat-dialog-actions>
```

**REQUIRED:**
- `mat-dialog-title` - MUST be present for dialog title
- `mat-dialog-content` - MUST wrap dialog content
- `mat-dialog-actions` - MUST contain action buttons
- `[mat-dialog-close]` - MUST be used for close buttons

**Dialog configuration requirements:**
- `width` - MUST specify dialog width
- `data` - MUST pass data via config object
- `afterClosed()` - MUST subscribe for result handling

**FORBIDDEN:**
- Dialogs without proper section structure
- Missing `mat-dialog-close` on action buttons
- Direct DOM manipulation for dialog closing

## Snackbar Constraints

**REQUIRED imports:**
- `MatSnackBarModule` - MUST be imported
- `MatSnackBar` service - MUST be injected

**REQUIRED configuration:**
- `duration` - MUST specify display duration (milliseconds)
- `horizontalPosition` - MUST specify horizontal position
- `verticalPosition` - MUST specify vertical position

**FORBIDDEN:**
- Snackbars without duration (infinite snackbars)
- Missing position configuration

## CRITICAL: Accessibility Requirements

### ARIA Label Enforcement

ALL icon-only buttons MUST have `aria-label` attribute. Missing labels are ACCESSIBILITY VIOLATIONS.

**REQUIRED:**
```html
<button mat-icon-button aria-label="Delete item">
  <mat-icon>delete</mat-icon>
</button>
```

**FORBIDDEN:**
```html
<button mat-icon-button> <!-- VIOLATION: missing aria-label -->
  <mat-icon>delete</mat-icon>
</button>
```

**VIOLATION consequences:**
- Screen readers cannot identify button purpose
- WCAG 2.1 Level A compliance failure
- Accessibility lawsuit risk

### Form Field Label Requirements

ALL form fields MUST have `mat-label` element. Missing labels are FORBIDDEN.

**REQUIRED:**
```html
<mat-form-field>
  <mat-label>Email Address</mat-label>
  <input matInput type="email">
</mat-form-field>
```

**FORBIDDEN:**
```html
<mat-form-field> <!-- VIOLATION: missing mat-label -->
  <input matInput type="email">
</mat-form-field>
```

### Keyboard Navigation Requirements

ALL interactive elements MUST be keyboard accessible. Mouse-only interactions are FORBIDDEN.

**REQUIRED:**
- Tab navigation support
- Enter/Space key activation
- Arrow key navigation for menus/lists
- Escape key for closing dialogs/menus

### Focus Management Constraints

Components with custom focus behavior MUST use `FocusMonitor` from `@angular/cdk/a11y`.

**REQUIRED:**
```typescript
import { FocusMonitor } from '@angular/cdk/a11y';

ngAfterViewInit() {
  this.focusMonitor.monitor(this.elementRef, true);
}

ngOnDestroy() {
  this.focusMonitor.stopMonitoring(this.elementRef);
}
```

**FORBIDDEN:**
- Manual focus management without FocusMonitor
- Missing cleanup in ngOnDestroy

## Performance Requirements

### Change Detection Strategy

ALL Material components SHOULD use `OnPush` change detection strategy when possible.

**REQUIRED with signals:**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  data = signal<Data[]>([]);
}
```

### Virtual Scrolling Enforcement

Lists with &gt;100 items MUST use virtual scrolling. Large lists without virtualization are FORBIDDEN.

**REQUIRED imports:**
- `ScrollingModule` from `@angular/cdk/scrolling`

**REQUIRED structure:**
```html
<cdk-virtual-scroll-viewport itemSize="50">
  @for (item of items(); track item.id) {
    <mat-list-item>{{ item.name }}</mat-list-item>
  }
</cdk-virtual-scroll-viewport>
```

**VIOLATION consequences:**
- Poor performance with large datasets
- Memory exhaustion
- Browser freezing

### Component Lazy Loading

Heavy Material components MUST be lazy loaded. Eager loading all components is FORBIDDEN.

**REQUIRED:**
```typescript
loadComponent: () => import('./component').then(m => m.Component)
```

## Testing Requirements

### CRITICAL: Animation Provider in Tests

ALL component tests MUST provide animations. Tests without animations provider are FORBIDDEN.

**REQUIRED test configuration:**
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [provideAnimations()] // REQUIRED
  }).compileComponents();
});
```

**FORBIDDEN:**
```typescript
TestBed.configureTestingModule({
  imports: [MyComponent]
  // VIOLATION: missing provideAnimations()
});
```

**VIOLATION consequences:**
- Test failures
- Animation timing issues
- Unreliable test results

## Enforcement Summary

**REQUIRED in ALL Material implementations:**
- `provideAnimations()` in app.config.ts
- Specific module imports (no wildcards)
- `mat-form-field` wrapper for all inputs
- `aria-label` on all icon buttons
- `mat-label` in all form fields
- `track` expression in all `@for` loops
- `provideAnimations()` in all tests

**FORBIDDEN in ALL Material implementations:**
- Wildcard imports (`import * as Material`)
- Standalone `matInput` without `mat-form-field`
- Icon buttons without `aria-label`
- Form fields without `mat-label`
- Tables without row definitions
- Lists &gt;100 items without virtual scrolling
- Tests without `provideAnimations()`
