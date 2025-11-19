import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MovieCard],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class Favorites implements OnInit {
  @Input() favorites: Movie[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (!this.favorites || this.favorites.length === 0) {
      const user = this.userService.getCurrentUser();
      if (user) {
        this.favorites = user.favorites;
      }
    }
  }

  removeFromFavorites(movie: Movie) {
    this.userService.removeFromFavorites(movie.id);
    const user = this.userService.getCurrentUser();
    if (user) {
      this.favorites = user.favorites;
    }
  }
}
