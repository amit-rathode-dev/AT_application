import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptorService } from './helpers/interceptors/auth-interceptor.service';
import { loaderInterceptor } from './helpers/interceptors/loader.interceptor';
import { MessageService } from 'primeng/api';







export const appConfig: ApplicationConfig = {

  providers: [

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),
    provideAnimationsAsync(),

    provideHttpClient(
      withInterceptors([
        (req, next) => {

          const interceptor = new AuthInterceptorService();
          // Manually invoke the intercept method, pass the correct HttpHandler type
          return interceptor.intercept(req, next as any); // Type casting 'next' to any to resolve the type mismatch
        },
             loaderInterceptor

      ])
    ),
    MessageService
  ],


};


