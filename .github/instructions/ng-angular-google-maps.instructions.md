---
description: 'Google Maps integration enforcement: lazy loading, marker clustering, geocoding caching, API key security, and performance constraints'
applyTo: '**'
---

# Angular Google Maps Rules

## CRITICAL: Script Lazy Loading

Google Maps API script MUST be lazy loaded. Eager loading is FORBIDDEN.

**REQUIRED:**
- Use `@angular/google-maps` module (official Angular integration)
- Load script ONLY when map component needed
- Configure API key in environment variables (NEVER hardcode)

**FORBIDDEN:**
- Synchronous script loading in index.html
- Hardcoded API keys in source code
- Global script loading for unused maps

**VIOLATION consequences:**
- Increased initial bundle size
- Slower page load
- API quota waste
- Security vulnerabilities

## Marker Clustering Enforcement

When marker count >50 → MUST implement clustering.

**REQUIRED configuration:**
```typescript
{
  minimumClusterSize: number,
  maxZoom: number,
  styles: CustomClusterIcon[]
}
```

**REQUIRED optimizations:**
- Load markers in viewport ONLY
- Paginate/virtualize marker data from backend
- Custom cluster icons for UX

**FORBIDDEN:**
- Rendering >50 markers without clustering
- Loading all markers regardless of viewport
- Missing cluster configuration

**VIOLATION consequences:**
- Browser performance degradation
- Memory exhaustion
- Poor user experience

## Geocoding Constraints

**REQUIRED caching mechanism:**
1. Cache all geocoding results (address → coordinates)
2. Use browser storage for persistence
3. Check cache BEFORE API call
4. Debounce requests (300-500ms minimum)

**FORBIDDEN:**
- Geocoding on every keystroke
- Missing cache check
- Synchronous geocoding requests
- Unhandled geocoding errors

**VIOLATION consequences:**
- API quota exhaustion
- Cost overruns
- Rate limiting
- Poor performance

## CRITICAL: API Key Security

ALL API keys MUST be restricted and secured.

**REQUIRED restrictions in Google Cloud Console:**
1. HTTP referrers (specific domains ONLY)
2. API restrictions (Maps JavaScript API ONLY)
3. Usage monitoring and quotas
4. Regular key rotation

**FORBIDDEN:**
- Unrestricted API keys
- API keys in version control
- Public API keys without referrer restrictions
- Missing usage monitoring

**VIOLATION consequences:**
- Unauthorized API usage
- Cost overruns
- Security breaches
- API abuse

## Environment Configuration

**REQUIRED pattern:**
```typescript
// environment.ts
export const environment = {
  googleMapsApiKey: process.env['GOOGLE_MAPS_API_KEY'] || ''
};
```

**FORBIDDEN:**
```typescript
// NEVER do this
const apiKey = 'AIzaSy...';
```

## Responsive Map Constraints

**REQUIRED CSS configuration:**
```css
google-map {
  height: 400px;  /* explicit height REQUIRED */
  width: 100%;
}

@media (max-width: 768px) {
  google-map {
    height: 300px;  /* smaller on mobile */
  }
}
```

**REQUIRED responsive features:**
- Device-specific zoom levels
- Breakpoint-based heights
- Resize event handling

**FORBIDDEN:**
- Auto height (causes rendering issues)
- Fixed pixel widths
- Missing mobile optimization

## Error Handling

**REQUIRED error handling:**
- Script load failures
- Geocoding errors
- Network timeouts
- Invalid coordinates

**FORBIDDEN:**
- Silent failures
- Missing error boundaries
- Unhandled promise rejections

## Enforcement Summary

**REQUIRED in ALL map implementations:**
- Lazy script loading via `@angular/google-maps`
- Marker clustering when >50 markers
- Geocoding result caching
- API key restrictions and security
- Responsive sizing
- Error handling

**FORBIDDEN in ALL map implementations:**
- Hardcoded API keys
- Unrestricted API access
- Missing clustering for large datasets
- Uncached geocoding requests
