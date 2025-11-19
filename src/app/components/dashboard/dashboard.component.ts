import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { FolderService } from '../../services/folder.service';
import { Movie, MovieFilter } from '../../interfaces/movie.interface';
import { Folder } from '../../interfaces/folder.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  suggestedMovies: Movie[] = [];
  latestMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  allGenres: string[] = [];
  folders: Folder[] = [];

  searchControl = new FormControl('');
  selectedGenres: string[] = [];

  loading = false;
  showFilters = false;

  filters: MovieFilter = {
    sortBy: 'popularity',
    sortOrder: 'desc'
  };

  constructor(
    private movieService: MovieService,
    private folderService: FolderService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadGenres();
    this.loadFolders();
    this.setupSearch();
  }

  loadMovies(): void {
    this.loading = true;

    this.movieService.getSuggestedMovies().subscribe(movies => {
      this.suggestedMovies = movies;
      this.loading = false;
    });

    this.movieService.getLatestReleases().subscribe(movies => {
      this.latestMovies = movies;
    });
  }

  loadGenres(): void {
    this.movieService.getAllGenres().subscribe(genres => {
      this.allGenres = genres;
    });
  }

  loadFolders(): void {
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        if (query && query.trim()) {
          this.performSearch(query.trim());
        } else {
          this.filteredMovies = [];
        }
      });
  }

  performSearch(query: string): void {
    this.loading = true;
    this.movieService.searchMovies(query).subscribe(movies => {
      this.filteredMovies = movies;
      this.loading = false;
    });
  }

  toggleGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index >= 0) {
      this.selectedGenres.splice(index, 1);
    } else {
      this.selectedGenres.push(genre);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filters.genres = this.selectedGenres.length > 0 ? this.selectedGenres : undefined;

    this.loading = true;
    this.movieService.filterMovies(this.filters).subscribe(movies => {
      this.filteredMovies = movies;
      this.loading = false;
    });
  }

  clearFilters(): void {
    this.selectedGenres = [];
    this.filters = {
      sortBy: 'popularity',
      sortOrder: 'desc'
    };
    this.filteredMovies = [];
    this.searchControl.setValue('');
  }

  toggleFavorite(movie: Movie, event: Event): void {
    event.stopPropagation();
    this.movieService.toggleFavorite(movie.id).subscribe(isFavorite => {
      movie.isFavorite = isFavorite;
    });
  }

  viewMovie(movieId: string): void {
    this.router.navigate(['/movie', movieId]);
  }

  addToFolder(movie: Movie, event: Event): void {
    event.stopPropagation();
    // This will be implemented with a dialog to select folder
    console.log('Add to folder:', movie.title);
  }

  rateMovie(movie: Movie, rating: 'up' | 'down', event: Event): void {
    event.stopPropagation();
    this.movieService.rateMovie(movie.id, rating).subscribe(() => {
      movie.userRating = movie.userRating === rating ? null : rating;
    });
  }

  getDisplayedMovies(): Movie[] {
    if (this.filteredMovies.length > 0) {
      return this.filteredMovies;
    }
    return this.suggestedMovies;
  }

  isFavorite(movieId: string): boolean {
    return this.movieService.isFavorite(movieId);
  }
}
