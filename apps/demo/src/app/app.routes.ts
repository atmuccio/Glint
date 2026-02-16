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
  {
    path: 'form-controls',
    loadComponent: () =>
      import('./pages/form-controls-demo.component').then(m => m.FormControlsDemoComponent),
  },
  {
    path: 'text-inputs',
    loadComponent: () =>
      import('./pages/text-inputs-demo.component').then(m => m.TextInputsDemoComponent),
  },
  {
    path: 'data-display',
    loadComponent: () =>
      import('./pages/data-display-demo.component').then(m => m.DataDisplayDemoComponent),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./pages/table-demo.component').then(m => m.TableDemoComponent),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./pages/tabs-demo.component').then(m => m.TabsDemoComponent),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./pages/accordion-demo.component').then(m => m.AccordionDemoComponent),
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/feedback-demo.component').then(m => m.FeedbackDemoComponent),
  },
  {
    path: 'toast',
    loadComponent: () =>
      import('./pages/toast-demo.component').then(m => m.ToastDemoComponent),
  },
  {
    path: 'navigation',
    loadComponent: () =>
      import('./pages/navigation-demo.component').then(m => m.NavigationDemoComponent),
  },
  {
    path: 'stepper-timeline',
    loadComponent: () =>
      import('./pages/stepper-timeline-demo.component').then(m => m.StepperTimelineDemoComponent),
  },
  {
    path: 'divider',
    loadComponent: () =>
      import('./pages/divider-demo.component').then(m => m.DividerDemoComponent),
  },
  {
    path: 'containers',
    loadComponent: () =>
      import('./pages/containers-demo.component').then(m => m.ContainersDemoComponent),
  },
];
