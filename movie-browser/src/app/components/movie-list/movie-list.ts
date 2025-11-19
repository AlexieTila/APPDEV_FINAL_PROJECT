import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';
import { AddToFolderDialog } from '../add-to-folder-dialog/add-to-folder-dialog';

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
    MatMenuModule,
    MovieCard
  ],
  templateUrl: './movie-list.html',
  styleUrls: ['./movie-list.scss']
})
export class MovieList implements OnInit {
  movies: Movie[] = [];
  allMovies: Movie[] = [];
  searchQuery = '';
  selectedGenre = '';
  isLoading = false;
  currentFilter = 'popular';
  username = '';

  constructor(
    private movieService: MovieService, 
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    this.username = user?.username || 'User';
    this.loadPopularMovies();
  }

  loadPopularMovies() {
    this.currentFilter = 'popular';
    this.isLoading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data.results;
        this.allMovies = data.results;
        this.isLoading = false;
        this.applyGenreFilter();
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.isLoading = false;
      }
    });
  }

  loadLatestMovies() {
    this.currentFilter = 'latest';
    this.isLoading = true;
    this.movieService.getLatestMovies().subscribe({
      next: (data) => {
        this.movies = data.results;
        this.allMovies = data.results;
        this.isLoading = false;
        this.applyGenreFilter();
      },
      error: (error) => {
        console.error('Error loading latest movies:', error);
        this.isLoading = false;
      }
    });
  }

  loadTopRated() {
    this.currentFilter = 'topRated';
    this.isLoading = true;
    this.movieService.getPopularMovies().subscribe({
      next: (data) => {
        this.movies = data.results.sort((a: Movie, b: Movie) => (b.vote_average || 0) - (a.vote_average || 0));
        this.allMovies = this.movies;
        this.isLoading = false;
        this.applyGenreFilter();
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
    this.applyGenreFilter();
  }

  applyGenreFilter() {
    if (this.selectedGenre) {
      const genreId = parseInt(this.selectedGenre);
      this.movies = this.allMovies.filter(movie => 
        movie.genres.some(genre => genre.id === genreId)
      );
    } else {
      this.movies = [...this.allMovies];
    }
  }

  addToFavorites(movie: Movie) {
    const isFavorite = this.userService.isFavorite(movie.id);
    if (isFavorite) {
      this.userService.removeFromFavorites(movie.id);
    } else {
      this.userService.addToFavorites(movie);
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  onThumbsUp(movie: Movie) {
    console.log('Thumbs up:', movie.title);
  }

  onThumbsDown(movie: Movie) {
    console.log('Thumbs down:', movie.title);
  }

  onAddToFolder(movie: Movie) {
    const dialogRef = this.dialog.open(AddToFolderDialog, {
      width: '600px',
      maxWidth: '90vw',
      data: { movie }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        console.log('Movie added to folder:', result.folder.title);
      }
    });
  }

  onPlayMovie(movie: Movie) {
    console.log('Play movie:', movie.title);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
