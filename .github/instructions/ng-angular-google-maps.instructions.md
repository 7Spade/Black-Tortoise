---
description: 'Google Maps integration: lazy loading, marker clustering, geocoding caching, API key security'
applyTo: '**'
---

# Angular Google Maps Rules

## CRITICAL: Core Requirements

**Lazy Loading (REQUIRED):**
- Use `@angular/google-maps` module only
- Load the Google Maps script dynamically in the component when needed
- NEVER include script synchronously in `index.html` or hardcode API keys

**API Key Security (REQUIRED):**
- Store API key in environment variables: `process.env['GOOGLE_MAPS_API_KEY']`
- Apply Google Cloud Console restrictions: HTTP referrers, API scope, quotas
- NEVER commit keys to version control
- Regular rotation of API keys is mandatory

**Marker Clustering (>50 markers):**
- Configure minimumClusterSize, maxZoom, and custom cluster styles
- Load only markers visible in the viewport; paginate or virtualize data if needed
- FORBIDDEN: rendering more than 50 markers without clustering

**Geocoding Caching (REQUIRED):**
- Cache all address → coordinates results in browser storage
- Check cache before making API calls
- Debounce user input for geocoding requests (minimum 300–500ms)
- FORBIDDEN: uncached or per-keystroke API requests

**Responsive Design:**
- Explicit map height required; avoid auto height
- Adjust map size based on breakpoints for mobile and tablet
- Use device-specific zoom levels

**Error Handling:**
- Handle script load failures, geocoding errors, and network timeouts
- FORBIDDEN: silent failures or unhandled promise rejections
