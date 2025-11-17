import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,

  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    SearchBarComponent,
    MovieListComponent,
    FavoritesComponent
  ]
})

export class AppComponent {
  title = 'Movie Browser';
  currentView: 'browse' | 'favorites' = 'browse';
  currentFilters: { title: string; year?: string; genre?: string } = { title: '' };
  featuredMovie: any | null = null;
  favoritesCount = 0;

  constructor(private movieService: MovieService) {
    this.movieService.favorites$.subscribe(list => this.favoritesCount = list.length);
  }

  switchView(view: 'browse' | 'favorites'): void {
    this.currentView = view;
  }

  onFilters(filters: { title: string; year?: string; genre?: string }): void {
    this.currentFilters = filters;
  }

  onFeatured(detail: any): void {
    this.featuredMovie = detail;
  }

  onGenreChange(genre: string): void {
    this.currentFilters = { ...this.currentFilters, genre };
  }

  getHeroImage(): string {
    const poster = this.featuredMovie?.Poster;
    if (poster && poster !== 'N/A' && !poster.includes('SX300') && !poster.includes('300')) {
      return poster;
    }
    return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963f?q=90&w=2400&auto=format&fit=crop';
  }
}