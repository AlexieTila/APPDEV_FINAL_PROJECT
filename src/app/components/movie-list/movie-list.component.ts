import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.css'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MovieCardComponent]
})
export class MovieListComponent implements OnInit {
  @Output() featured = new EventEmitter<any>();
  movies: Movie[] = [];
  loading = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {}

  @Input() set filters(f: { title: string; year?: string; genre?: string; type?: 'movie'|'series'|'episode' }) {
    const title = (f?.title || '').trim();
    const term = title || 'star';
    this.searchMovies(term, f?.year, f?.type, f?.genre);
  }

  searchMovies(title: string, year?: string, type?: 'movie'|'series'|'episode', genre?: string): void {
    this.loading = true;
    this.movieService.searchMovies(title, year, type).subscribe({
      next: (response) => {
        if (response.Response === 'True') {
          this.movies = response.Search.map((movie: any) => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            posterUrl: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
            favorite: this.movieService.isFavorite(movie.imdbID)
          }));
          if (this.movies.length) {
            this.movieService.getMovieById(this.movies[0].id!).subscribe({
              next: (detail) => this.featured.emit(detail)
            });
          }
          if (genre) {
            forkJoin(this.movies.map(m => this.movieService.getMovieById(m.id!))).subscribe({
              next: (details: any[]) => {
                const wanted = details.filter(d => d && d.Genre && d.Genre.toLowerCase().includes(genre.toLowerCase())).map(d => d.imdbID);
                this.movies = this.movies.filter(m => wanted.includes(m.id!));
                this.loading = false;
              },
              error: () => { this.loading = false; }
            });
            return;
          }
        } else {
          this.movies = [];
        }
        this.loading = false;
      },
      error: () => {
        this.movies = [];
        this.loading = false;
      }
    });
  }
}