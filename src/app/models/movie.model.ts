import { Movie, Cast, StreamingPlatform } from '../interfaces/movie.interface';

export class MovieModel implements Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  director: string;
  cast: Cast[];
  genres: string[];
  releaseDate: Date;
  duration: number;
  rating: number;
  description: string;
  tagline?: string;
  language: string;
  budget?: number;
  revenue?: number;
  productionCompanies?: string[];
  streamingPlatforms: StreamingPlatform[];
  isFavorite?: boolean;
  userRating?: 'up' | 'down' | null;
  averageRating?: number;
  totalReviews?: number;

  constructor(data: Partial<Movie>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.poster = data.poster || '';
    this.backdrop = data.backdrop;
    this.director = data.director || '';
    this.cast = data.cast || [];
    this.genres = data.genres || [];
    this.releaseDate = data.releaseDate || new Date();
    this.duration = data.duration || 0;
    this.rating = data.rating || 0;
    this.description = data.description || '';
    this.tagline = data.tagline;
    this.language = data.language || 'en';
    this.budget = data.budget;
    this.revenue = data.revenue;
    this.productionCompanies = data.productionCompanies;
    this.streamingPlatforms = data.streamingPlatforms || [];
    this.isFavorite = data.isFavorite || false;
    this.userRating = data.userRating || null;
    this.averageRating = data.averageRating;
    this.totalReviews = data.totalReviews;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  setUserRating(rating: 'up' | 'down' | null): void {
    this.userRating = rating;
  }

  getFormattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }

  getFormattedReleaseYear(): number {
    return this.releaseDate.getFullYear();
  }
}
