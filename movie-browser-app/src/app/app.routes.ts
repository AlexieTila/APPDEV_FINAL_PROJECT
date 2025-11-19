import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'favorites',
    loadComponent: () => import('./components/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'folders',
    loadComponent: () => import('./components/folders/folders.component').then(m => m.FoldersComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
