import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  initializeAppCheck,
  provideAppCheck,
  ReCaptchaEnterpriseProvider,
} from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDataConnect, provideDataConnect } from '@angular/fire/data-connect';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/workspace/tokens/workspace-runtime.token';
import { WorkspaceRuntimeFactory } from '@infrastructure/workspace';
import { EVENT_BUS, EVENT_STORE } from '@application/events';
import { InMemoryEventBus, InMemoryEventStore } from '@infrastructure/events';

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
    
    // DDD/Clean Architecture: Infrastructure Providers
    // Register infrastructure implementations for application abstractions
    {
      provide: WORKSPACE_RUNTIME_FACTORY,
      useClass: WorkspaceRuntimeFactory
    },
    
    // Event Infrastructure: Singleton EventBus and EventStore
    // Using InMemory implementations for development/testing
    // Production implementations (e.g., FirestoreEventStore) can be swapped via DI
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus
    },
    {
      provide: EVENT_STORE,
      useClass: InMemoryEventStore
    },

    // Firebase App Initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // Firebase Services
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,

    // Firebase App Check with reCAPTCHA Enterprise (disabled in non-production)
    ...(environment.production && environment.appCheckSiteKey
      ? [
          provideAppCheck(() => {
            const provider = new ReCaptchaEnterpriseProvider(
              environment.appCheckSiteKey,
            );
            return initializeAppCheck(undefined, {
              provider,
              isTokenAutoRefreshEnabled: true,
            });
          }),
        ]
      : []),
    provideDatabase(() => getDatabase()),
    provideDataConnect(() =>
      getDataConnect({
        connector: environment.dataConnect.connector,
        location: environment.dataConnect.location,
        service: environment.dataConnect.service,
      }),
    ),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideVertexAI(() => getVertexAI()),
  ],
};
