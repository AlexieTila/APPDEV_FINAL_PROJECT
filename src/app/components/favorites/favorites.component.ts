import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteMovies: Movie[] = [];
  loading = true;

  constructor(
    private movieService: MovieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.movieService.getFavorites().subscribe(movies => {
      this.favoriteMovies = movies;
      this.loading = false;
    });
  }

  removeFavorite(movie: Movie, event: Event): void {
    event.stopPropagation();
    this.movieService.toggleFavorite(movie.id).subscribe(() => {
      this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movie.id);
    });
  }

  viewMovie(movieId: string): void {
    this.router.navigate(['/movie', movieId]);
  }

  rateMovie(movie: Movie, rating: 'up' | 'down', event: Event): void {
    event.stopPropagation();
    this.movieService.rateMovie(movie.id, rating).subscribe(() => {
      movie.userRating = movie.userRating === rating ? null : rating;
    });
  }
}
