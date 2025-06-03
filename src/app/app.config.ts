import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { autenticacaoInterceptor } from './interceptor/autenticacao.interceptor';
import { tokenValidationInterceptor } from './interceptor/token-validation.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ 
      eventCoalescing: true 
    }), 
    ReactiveFormsModule,
    FormsModule,
    provideHttpClient(
      withInterceptors([autenticacaoInterceptor, tokenValidationInterceptor])
    ),
    provideRouter(routes),
    provideAnimations()
  ]
};

