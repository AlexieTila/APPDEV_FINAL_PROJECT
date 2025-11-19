import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MovieService } from '../../services/movie.service';
import { Movie, Review } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  reviewForm: FormGroup;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovie(movieId);
      this.loadReviews(movieId);
    }
  }

  loadMovie(id: string): void {
    this.movieService.getMovieById(id).subscribe(movie => {
      this.movie = movie;
      this.loading = false;
    });
  }

  loadReviews(movieId: string): void {
    this.movieService.getReviews(movieId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  toggleFavorite(): void {
    if (!this.movie) return;

    this.movieService.toggleFavorite(this.movie.id).subscribe(isFavorite => {
      if (this.movie) {
        this.movie.isFavorite = isFavorite;
      }
    });
  }

  rateMovie(rating: 'up' | 'down'): void {
    if (!this.movie) return;

    this.movieService.rateMovie(this.movie.id, rating).subscribe(() => {
      if (this.movie) {
        this.movie.userRating = this.movie.userRating === rating ? null : rating;
      }
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.movie) return;

    const { rating, comment } = this.reviewForm.value;
    this.movieService.addReview(this.movie.id, rating, comment).subscribe(review => {
      this.reviews.unshift(review);
      this.reviewForm.reset({ rating: 5, comment: '' });
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isFavorite(): boolean {
    return this.movie ? this.movieService.isFavorite(this.movie.id) : false;
  }

  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}
