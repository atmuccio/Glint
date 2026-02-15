import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'button', pathMatch: 'full' },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button-demo.component').then(m => m.ButtonDemoComponent),
  },
  {
    path: 'card',
    loadComponent: () =>
      import('./pages/card-demo.component').then(m => m.CardDemoComponent),
  },
  {
    path: 'input',
    loadComponent: () =>
      import('./pages/input-demo.component').then(m => m.InputDemoComponent),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./pages/tooltip-demo.component').then(m => m.TooltipDemoComponent),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./pages/dialog-demo.component').then(m => m.DialogDemoComponent),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./pages/select-demo.component').then(m => m.SelectDemoComponent),
  },
  {
    path: 'theme',
    loadComponent: () =>
      import('./pages/theme-demo.component').then(m => m.ThemeDemoComponent),
  },
];
