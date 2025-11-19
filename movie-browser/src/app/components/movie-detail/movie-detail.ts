import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { Review as ReviewModel } from '../../models/user.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.scss']
})
export class MovieDetail implements OnInit {
  movie: Movie | null = null;
  streamingProviders: any[] = [];
  isFavorite = false;
  hasThumbsUp = false;
  hasThumbsDown = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: number },
    private dialogRef: MatDialogRef<MovieDetail>,
    private movieService: MovieService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.movieService.getMovieDetails(this.data.movieId).subscribe(data => {
      this.movie = data;
      this.checkIfFavorite();
    });
    this.movieService.getStreamingProviders(this.data.movieId).subscribe(data => {
      this.streamingProviders = data.results?.US?.flatrate || [];
    });
  }

  checkIfFavorite() {
    const user = this.userService.getCurrentUser();
    if (user && this.movie) {
      this.isFavorite = user.favorites.some(fav => fav.id === this.movie!.id);
    }
  }

  getGenreNames(): string {
    return this.movie?.genres?.map(g => g.name).join(', ') || '';
  }

  getCastNames(): string {
    return this.movie?.cast?.join(', ') || '';
  }

  getYear(): string {
    if (!this.movie?.release_date) return 'Unknown';
    const date = new Date(this.movie.release_date);
    return date.getFullYear().toString();
  }

  toggleFavorite() {
    if (this.movie) {
      if (this.isFavorite) {
        this.userService.removeFromFavorites(this.movie.id);
      } else {
        this.userService.addToFavorites(this.movie);
      }
      this.isFavorite = !this.isFavorite;
    }
  }

  onThumbsUp() {
    this.hasThumbsUp = !this.hasThumbsUp;
    if (this.hasThumbsUp) {
      this.hasThumbsDown = false;
      this.addReview('thumbs_up', '');
    }
  }

  onThumbsDown() {
    this.hasThumbsDown = !this.hasThumbsDown;
    if (this.hasThumbsDown) {
      this.hasThumbsUp = false;
      this.addReview('thumbs_down', '');
    }
  }

  addToFolder() {
    // TODO: Implement folder selection dialog
    console.log('Add to folder clicked');
  }

  addReview(rating: 'thumbs_up' | 'thumbs_down', comment: string) {
    if (this.movie) {
      const user = this.userService.getCurrentUser();
      if (user) {
        const review: ReviewModel = { 
          id: Date.now(), 
          movieId: this.movie.id, 
          userId: user.id, 
          rating, 
          comment 
        };
        this.userService.addReview(review);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
