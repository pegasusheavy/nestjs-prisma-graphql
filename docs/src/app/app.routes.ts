import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started.component').then(
        (m) => m.GettingStartedComponent
      ),
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./pages/configuration/configuration.component').then(
        (m) => m.ConfigurationComponent
      ),
  },
  {
    path: 'decorators',
    loadComponent: () =>
      import('./pages/decorators/decorators.component').then(
        (m) => m.DecoratorsComponent
      ),
  },
  {
    path: 'esm',
    loadComponent: () =>
      import('./pages/esm/esm.component').then((m) => m.EsmComponent),
  },
  {
    path: 'validators',
    loadComponent: () =>
      import('./pages/validators/validators.component').then(
        (m) => m.ValidatorsComponent
      ),
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./pages/examples/examples.component').then(
        (m) => m.ExamplesComponent
      ),
  },
  {
    path: 'api',
    loadComponent: () =>
      import('./pages/api/api.component').then((m) => m.ApiComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
