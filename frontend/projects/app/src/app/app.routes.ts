import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Persistent three-column workspace shell: the left document list stays
    // mounted while the center (+ its right sidebar) swaps via child routes.
    path: '',
    loadComponent: () => import('./features/workspace/workspace').then((m) => m.Workspace),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/workspace/empty-state').then((m) => m.EmptyState),
      },
      {
        path: 'documents/:id',
        loadComponent: () => import('./features/labeling/labeling').then((m) => m.Labeling),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
