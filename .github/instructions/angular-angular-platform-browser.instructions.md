---
description: 'Angular Platform Browser: DOM manipulation, sanitization, security, title service, and meta tags for browser applications'
applyTo: '**/*.ts'
---

# @angular/platform-browser Implementation Instructions

## Sanitization Required

REQUIRED:

* Use DomSanitizer for sanitizing untrusted content
* NEVER bypass sanitization without security review
* Sanitize user input before rendering as HTML

FORBIDDEN:

* Direct innerHTML with user content
* bypassSecurityTrust*() without justification
* Rendering unsanitized external content

## DOM Manipulation

REQUIRED:

* Use Angular directives for DOM updates
* Use Renderer2 for direct DOM manipulation
* Inject DOCUMENT token instead of global document

FORBIDDEN:

* Direct document access
* ElementRef.nativeElement manipulation without Renderer2
* DOM manipulation in component constructors

## Title and Meta Service

REQUIRED:

* Inject Title service for page title updates
* Inject Meta service for meta tag management
* Update title on route changes

FORBIDDEN:

* Direct document.title manipulation
* Manual meta tag creation
* Hardcoded page titles

## Safe Resource URLs

REQUIRED:

* Use DomSanitizer.sanitize() for external URLs
* Validate URLs before setting as iframe src
* Use bypassSecurityTrustResourceUrl() ONLY for known safe URLs

FORBIDDEN:

* Unvalidated external URLs in iframes
* User-provided URLs without sanitization
* Bypassing URL security without validation

## Event Management

REQUIRED:

* Use @HostListener() for DOM event handling
* Clean up event listeners in ngOnDestroy()
* Use Angular event bindings in templates

FORBIDDEN:

* addEventListener() without cleanup
* Global event listeners without removal
* Memory leaks from unremoved listeners

## Transfer State (SSR)

REQUIRED:

* Use TransferState for server-to-client data transfer
* Serialize data on server, rehydrate on client
* NEVER fetch data twice (server + client)

FORBIDDEN:

* Duplicate API calls in SSR + client
* Missing transfer state for SSR apps
* Unserializable data in transfer state

## Platform Detection

REQUIRED:

* Use isPlatformBrowser() for browser-specific code
* Use isPlatformServer() for server-specific code
* Import from @angular/common

FORBIDDEN:

* typeof window !== 'undefined' checks
* Assuming browser environment
* Direct window access without platform check

## Browser-Only Features

REQUIRED:
if (isPlatformBrowser(this.platformId)) {
// Browser-only code
}

FORBIDDEN:

* Browser APIs without platform check
* SSR failures from browser assumptions

## Hydration

REQUIRED:

* Enable hydration with provideClientHydration()
* NEVER disable hydration without reason
* Test hydration in development

FORBIDDEN:

* SSR without hydration
* Hydration mismatch errors in production

## Service Worker

REQUIRED:

* Register service worker in production ONLY
* Configure ngsw-config.json properly
* Handle service worker updates

FORBIDDEN:

* Service workers in development
* Missing update notifications
* Unhandled service worker errors

## Animation Testing

REQUIRED:

* Use provideNoopAnimations() in test configuration
* NEVER test animation timing
* Focus on animation presence, not duration

FORBIDDEN:

* Real animations in unit tests
* Timing-dependent test assertions

## Performance Optimization

REQUIRED:

* Lazy load platform-browser features
* Use NgOptimizedImage for images
* Implement proper caching strategies

FORBIDDEN:

* Loading unused browser features
* Unoptimized images
* Missing cache headers

## Security Headers

REQUIRED:

* Content Security Policy (CSP)
* X-Frame-Options
* X-Content-Type-Options
* Referrer-Policy

FORBIDDEN:

* Missing security headers in production
* Permissive CSP policies

## Testing

REQUIRED:

* Mock DOCUMENT token in tests
* Test sanitization behavior
* Verify platform-specific code paths

FORBIDDEN:

* Tests depending on real DOM
* Missing sanitization tests
* Untested browser-specific features

## Enforcement Checklist

REQUIRED:

* DomSanitizer for untrusted content
* Renderer2 for DOM manipulation
* DOCUMENT injection over global access
* Title and Meta services for metadata
* isPlatformBrowser() for browser-specific code
* provideClientHydration() for SSR apps
* Security headers in production
* TransferState for SSR data sharing

FORBIDDEN:

* Direct innerHTML with user content
* bypassSecurityTrust*() without validation
* Global document access
* Browser APIs without platform checks
* Missing hydration in SSR
* Service workers in development
