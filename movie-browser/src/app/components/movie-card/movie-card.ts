import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Movie } from '../../models/movie.model';
import { MovieDetail } from '../movie-detail/movie-detail';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCard implements OnInit {
  @Input() movie!: Movie;
  @Output() favorite = new EventEmitter<Movie>();
  @Output() thumbsUp = new EventEmitter<Movie>();
  @Output() thumbsDown = new EventEmitter<Movie>();
  @Output() addToFolder = new EventEmitter<Movie>();
  @Output() play = new EventEmitter<Movie>();

  isFavorite = false;
  hasThumbsUp = false;
  hasThumbsDown = false;

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    // Check if movie is in favorites
    this.isFavorite = this.userService.isFavorite(this.movie.id);
  }

  openMovieDetail() {
    this.dialog.open(MovieDetail, {
      data: { movieId: this.movie.id },
      width: '90vw',
      maxWidth: '1000px',
      maxHeight: '90vh',
      panelClass: 'movie-detail-dialog-container'
    });
  }

  onFavorite(event: Event) {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.favorite.emit(this.movie);
  }

  onThumbsUp(event: Event) {
    event.stopPropagation();
    this.hasThumbsUp = !this.hasThumbsUp;
    if (this.hasThumbsUp) {
      this.hasThumbsDown = false;
    }
    this.thumbsUp.emit(this.movie);
  }

  onThumbsDown(event: Event) {
    event.stopPropagation();
    this.hasThumbsDown = !this.hasThumbsDown;
    if (this.hasThumbsDown) {
      this.hasThumbsUp = false;
    }
    this.thumbsDown.emit(this.movie);
  }

  onAddToFolder(event: Event) {
    event.stopPropagation();
    this.addToFolder.emit(this.movie);
  }

  onPlay(event: Event) {
    event.stopPropagation();
    this.play.emit(this.movie);
  }
}
