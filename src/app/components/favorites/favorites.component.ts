import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MovieCardComponent],
})
export class FavoritesComponent implements OnInit {
  favorites: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.favorites$.subscribe(favorites => {
      this.favorites = favorites;
    });
  }
}