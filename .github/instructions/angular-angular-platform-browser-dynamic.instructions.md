---
description: 'Angular Platform Browser Dynamic: JIT compilation and dynamic bootstrapping for development environments'
applyTo: 'main.ts'
---

# @angular/platform-browser-dynamic Implementation Instructions

## CRITICAL: Development Only

**REQUIRED:**
- Use `@angular/platform-browser-dynamic` for development ONLY
- NEVER deploy with JIT compilation to production
- Production MUST use AOT compilation

**FORBIDDEN:**
- JIT compilation in production builds
- `platformBrowserDynamic()` in production code
- Dynamic module compilation in production

## Bootstrap Pattern

**REQUIRED for development:**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);
```

**FORBIDDEN:**
- `platformBrowserDynamic().bootstrapModule()` in new projects
- Module-based bootstrapping with standalone components

## JIT Compilation

**REQUIRED understanding:**
- JIT compiles templates at runtime
- Slower initial load than AOT
- Larger bundle size than AOT
- Development-friendly error messages

**FORBIDDEN:**
- JIT in production (use `ng build` for AOT)
- Relying on JIT-specific behavior
- JIT-only testing

## Standalone Component Bootstrap

**REQUIRED in Angular 20:**
- Use `bootstrapApplication()` for standalone apps
- Define app config in separate file
- Import all providers in app config

**FORBIDDEN:**
- `NgModule` bootstrapping in new code
- Mixing module and standalone bootstrap

## App Configuration

**REQUIRED app.config.ts structure:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // Other providers
  ]
};
```

**FORBIDDEN:**
- Missing provider configuration
- Providers in multiple locations
- Unorganized provider setup

## Development Features

**REQUIRED for development:**
- Enable debug mode for detailed errors
- Use source maps for debugging
- Development-specific error handling

**FORBIDDEN:**
- Production optimizations in development
- Disabled source maps
- Suppressed error details

## Migration to AOT

**REQUIRED for production:**
- Run `ng build --configuration production`
- Verify AOT compilation succeeds
- Test production build before deployment

**FORBIDDEN:**
- Deploying development builds
- Skipping production build verification
- AOT compilation errors in production

## Performance Considerations

**REQUIRED knowledge:**
- JIT has slower startup than AOT
- Larger bundle size in development
- Runtime template compilation overhead

**FORBIDDEN:**
- Using JIT for performance benchmarks
- Comparing JIT and AOT performance directly

## Error Handling

**REQUIRED:**
- Implement global error handler
- Log errors appropriately for environment
- User-friendly error messages in production

**FORBIDDEN:**
- Exposing stack traces in production
- Silent error failures
- Missing error boundaries

## Testing Environment

**REQUIRED:**
- Tests MAY use JIT for faster compilation
- Production tests MUST use AOT builds
- Verify both JIT and AOT compatibility

**FORBIDDEN:**
- Only testing with JIT
- Skipping AOT validation
- JIT-specific test logic

## Zone.js Integration

**REQUIRED for zone.js apps:**
- Import `zone.js` before bootstrap
- Configure zone.js flags if needed
- NEVER import zone.js in zone-less apps

**FORBIDDEN:**
- Missing zone.js import
- Incorrect zone.js configuration
- Zone.js in zone-less applications

## Debugging

**REQUIRED tools:**
- Angular DevTools for debugging
- Browser developer tools
- Source maps for error tracing

**FORBIDDEN:**
- Production builds for debugging
- Missing source map configuration

## Build Verification

**REQUIRED before deployment:**
- Run `ng build --configuration production`
- Verify no compilation errors
- Test production bundle
- Check bundle size metrics

**FORBIDDEN:**
- Deploying without production build test
- Ignoring compilation warnings
- Missing bundle analysis

## Enforcement Checklist

**REQUIRED:**
- Development environment ONLY
- `bootstrapApplication()` for standalone apps
- App config with all providers
- Production builds use AOT
- Source maps enabled in development
- Global error handler configured
- Zone.js imported (if not zone-less)

**FORBIDDEN:**
- JIT compilation in production
- Module-based bootstrap in new code
- Missing app configuration
- Deploying development builds
- AOT compilation errors
- Zone.js in zone-less apps
