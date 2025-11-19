import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.scss']
})
export class MovieCard {
  @Input() movie!: Movie;
  @Output() favorite = new EventEmitter<Movie>();
  @Output() thumbsUp = new EventEmitter<Movie>();
  @Output() thumbsDown = new EventEmitter<Movie>();
  @Output() addToFolder = new EventEmitter<Movie>();
  @Output() play = new EventEmitter<Movie>();

  isFavorite = false;
  hasThumbsUp = false;
  hasThumbsDown = false;

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
