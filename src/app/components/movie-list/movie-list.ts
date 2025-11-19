import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MovieCard
  ],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.scss']
})
export class MovieList implements OnInit {
  movies: Movie[] = [];
  searchQuery = '';
  selectedGenre = '';
  isLoading = false;

  constructor(private movieService: MovieService, private userService: UserService) {}

  ngOnInit() {
    this.loadPopularMovies();
  }

  loadPopularMovies() {
    this.isLoading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.isLoading = false;
      }
    });
  }

  loadLatestMovies() {
    this.isLoading = true;
    this.movieService.getLatestMovies().subscribe({
      next: (data) => {
        this.movies = data.results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading latest movies:', error);
        this.isLoading = false;
      }
    });
  }

  loadTopRated() {
    this.isLoading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data.results.sort((a: Movie, b: Movie) => (b.vote_average || 0) - (a.vote_average || 0));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading top rated movies:', error);
        this.isLoading = false;
      }
    });
  }

  searchMovies() {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.isLoading = true;
      console.log('Searching for:', this.searchQuery);
      this.movieService.searchMovies(this.searchQuery).subscribe({
        next: (data) => {
          console.log('Search results:', data);
          this.movies = data.results || [];
          this.isLoading = false;
          if (this.movies.length === 0) {
            console.log('No movies found for query:', this.searchQuery);
          }
        },
        error: (error) => {
          console.error('Error searching movies:', error);
          this.movies = [];
          this.isLoading = false;
        }
      });
    } else {
      // If search is empty, reload popular movies
      this.loadPopularMovies();
    }
  }

  filterByGenre() {
    if (this.selectedGenre) {
      console.log('Filtering by genre:', this.selectedGenre);
    } else {
      this.loadPopularMovies();
    }
  }

  addToFavorites(movie: Movie) {
    this.userService.addToFavorites(movie);
    console.log('Added to favorites:', movie.title);
  }

  onThumbsUp(movie: Movie) {
    console.log('Thumbs up:', movie.title);
  }

  onThumbsDown(movie: Movie) {
    console.log('Thumbs down:', movie.title);
  }

  onAddToFolder(movie: Movie) {
    console.log('Add to folder:', movie.title);
  }

  onPlayMovie(movie: Movie) {
    console.log('Play movie:', movie.title);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
