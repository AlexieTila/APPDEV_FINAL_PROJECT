import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { MovieList } from './components/movie-list/movie-list';
import { UserProfile } from './components/user-profile/user-profile';
import { Favorites } from './components/favorites/favorites';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'movies', component: MovieList, canActivate: [authGuard] },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: 'favorites', component: Favorites, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
