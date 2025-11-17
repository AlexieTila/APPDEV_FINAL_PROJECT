
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MovieDialogComponent } from '../movie-dialog/movie-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  constructor(
    private movieService: MovieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  toggleFavorite(): void {
    if (this.movie.favorite) {
      this.movieService.removeFavorite(this.movie.id!);
      this.movie.favorite = false;
      this.snackBar.open('Removed from favorites!', 'Close', { duration: 2000 });
    } else {
      this.movieService.addFavorite(this.movie);
      this.movie.favorite = true;
      this.snackBar.open('Added to favorites!', 'Close', { duration: 2000 });
    }
  }

  rateUp(): void {
    this.movie.rating = 'up';
    this.movieService.rateMovie(this.movie.id!, 'up');
    this.snackBar.open('You liked this movie', 'Close', { duration: 2000 });
  }

  rateDown(): void {
    this.movie.rating = 'down';
    this.movieService.rateMovie(this.movie.id!, 'down');
    this.snackBar.open('You disliked this movie', 'Close', { duration: 2000 });
  }

  openNotesDialog(): void {
    const dialogRef = this.dialog.open(MovieDialogComponent, {
      width: '500px',
      data: { movie: this.movie }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.movieService.updateNotes(this.movie.id!, result.notes);
        this.movie.notes = result.notes;
        this.snackBar.open('Comment saved!', 'Close', { duration: 2000 });
      }
    });
  }
}