import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';
import { Movie } from '../../models/movie.model';
import { Review as ReviewModel } from '../../models/user.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './movie-detail.html',
  styleUrls: ['./movie-detail.scss']
})
export class MovieDetail implements OnInit {
  movie: Movie | null = null;
  streamingProviders: any[] = [];

  constructor(private route: ActivatedRoute, private movieService: MovieService, private userService: UserService) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovieDetails(id).subscribe(data => {
      this.movie = data;
    });
    this.movieService.getStreamingProviders(id).subscribe(data => {
      this.streamingProviders = data.results?.US?.flatrate || [];
    });
  }

  getGenreNames(): string {
    return this.movie?.genres?.map(g => g.name).join(', ') || '';
  }

  getCastNames(): string {
    return this.movie?.cast?.join(', ') || '';
  }

  addReview(rating: 'thumbs_up' | 'thumbs_down', comment: string) {
    if (this.movie) {
      const review: ReviewModel = { id: Date.now(), movieId: this.movie.id, userId: this.userService.getCurrentUser()!.id, rating, comment };
      this.userService.addReview(review);
    }
  }
}
