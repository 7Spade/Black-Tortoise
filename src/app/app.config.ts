import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEventHandlers } from '@application/handlers';
import { routes } from 'src/app/shell/routes/app.routes';
import { provideApplication } from './application/providers';
import { provideAuthInfrastructure } from './infrastructure/config/auth.providers';
import { provideEventsInfrastructure } from './infrastructure/config/events.providers';
import { provideFirebaseIntegration } from './infrastructure/config/firebase.providers';
import { provideModulesInfrastructure } from './infrastructure/config/modules.providers';
import { provideWorkspaceInfrastructure } from '@workspace/infrastructure';
import { provideTemplateCore } from './template-core/template.providers';

/**
 * Application Configuration with Zone-less Change Detection
 *
 * This configuration enables Angular's zone-less mode, which provides:
 *
 * Benefits:
 * - Improved performance: No Zone.js overhead for change detection
 * - Smaller bundle size: Zone.js (~40KB) is not included
 * - Better debugging: Explicit change detection through signals
 * - Modern architecture: Fully reactive with @ngrx/signals
 *
 * DDD Architecture:
 * - Domain layer: Pure TypeScript (no Angular/RxJS)
 * - Application layer: Use cases, signal stores, abstractions
 * - Infrastructure layer: Event bus implementation with RxJS
 * - Presentation layer: Zone-less components with OnPush
 *
 * Clean Architecture Compliance:
 * - Infrastructure implementations registered via DI tokens
 * - Application/Presentation depend on abstractions
 * - Dependency Inversion Principle enforced
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Zone-less change detection (stable in Angular 20)
    provideZonelessChangeDetection(),

    // Router configuration with lazy-loaded routes
    provideRouter(routes),
    provideAnimations(),

    // Application Initialization (AuthStore, etc.)
    provideApplication(),

    // Infrastructure Providers - Functional Composition
    provideWorkspaceInfrastructure(),
    provideAuthInfrastructure(),
    provideModulesInfrastructure(),
    provideEventsInfrastructure(),

    // Template Core Providers
    provideTemplateCore(),

    // Domain Event Handlers
    provideEventHandlers(),

    // Firebase Integration
    provideFirebaseIntegration(),
  ],
};

