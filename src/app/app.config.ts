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
import { WorkspaceEventEffects } from '@application/events/workspace-event.effects';

/**
 * Application Configuration with Zone-less Change Detection
 *
 * DDD Architecture + Workspace Event Effects:
 * - Domain layer: Pure TypeScript (no Angular/RxJS)
 * - Application layer: Use cases, signal stores, event effects
 * - Infrastructure layer: Event bus implementation with RxJS
 * - Presentation layer: Zone-less components with OnPush
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    
    // DDD/Clean Architecture: Infrastructure Providers
    {
      provide: WORKSPACE_RUNTIME_FACTORY,
      useClass: WorkspaceRuntimeFactory
    },
    
    // Workspace Event Effects
    WorkspaceEventEffects,

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
