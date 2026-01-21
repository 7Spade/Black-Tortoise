---
description: 'Google Maps integration: lazy loading, marker clustering, geocoding caching, API key security'
applyTo: '**'
---

# Angular Google Maps Rules

## CRITICAL: Core Requirements

**Lazy Loading (REQUIRED):**
- Use `@angular/google-maps` module only
- Load script ONLY when map component needed
- NEVER synchronous loading in index.html or hardcoded keys

**API Key Security (REQUIRED):**
- Store in environment variables: `process.env['GOOGLE_MAPS_API_KEY']`
- Google Cloud Console restrictions: HTTP referrers, API scope, quotas
- NEVER in version control or unrestricted
- Regular key rotation mandatory

**Marker Clustering (>50 markers):**
- MUST configure: minimumClusterSize, maxZoom, custom styles
- Load viewport markers only, paginate/virtualize data
- FORBIDDEN: rendering >50 without clustering

**Geocoding Caching (REQUIRED):**
- Cache all results (address → coordinates) in browser storage
- Check cache BEFORE API calls
- Debounce requests 300-500ms minimum
- FORBIDDEN: uncached requests or keystroke geocoding

**Responsive Design:**
- Explicit height required (auto height breaks rendering)
- Breakpoint-based sizing for mobile
- Device-specific zoom levels

**Error Handling:**
- Handle script load failures, geocoding errors, network timeouts
- FORBIDDEN: silent failures, unhandled rejections
