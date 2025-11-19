import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MovieCard],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class Favorites implements OnInit {
  favorites: Movie[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.favorites = user.favorites;
    }
  }

  removeFromFavorites(movie: Movie) {
    this.userService.removeFromFavorites(movie.id);
    // Remove instantly from the local array without reloading
    this.favorites = this.favorites.filter(m => m.id !== movie.id);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
