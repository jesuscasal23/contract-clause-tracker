import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'documents/:id',
    loadComponent: () => import('./features/labeling/labeling').then((m) => m.Labeling),
  },
  { path: '**', redirectTo: '' },
];
