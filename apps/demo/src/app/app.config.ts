import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideGlintUI, provideGlintIcons, mapIcons, lucideToSvg } from '@glint-ng/core';
import { Github, Home, Zap, Layers, Shield, Package } from 'lucide';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideGlintUI(),
    provideGlintIcons(
      mapIcons({ github: Github, home: Home, zap: Zap, layers: Layers, shield: Shield, package: Package }, lucideToSvg),
    ),
  ],
};
