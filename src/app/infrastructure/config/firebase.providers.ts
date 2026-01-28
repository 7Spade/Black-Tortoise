import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
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
import { environment } from '@env/environment';

export function provideFirebaseIntegration(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
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
  ]);
}
