import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyAeCz85zIUe32oHVAsDQiZqudn1dhdKatE",
  authDomain: "artsy-b4a41.firebaseapp.com",
  projectId: "artsy-b4a41",
  storageBucket: "artsy-b4a41.appspot.com",
  messagingSenderId: "162521145916",
  appId: "1:162521145916:web:ea7743934a59101c315939",
  measurementId: "G-GDQ509FGZG"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
