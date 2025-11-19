export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  director: string;
  cast: Cast[];
  genres: string[];
  releaseDate: Date;
  duration: number; // in minutes
  rating: number; // out of 10
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
}

export interface Cast {
  id: string;
  name: string;
  character: string;
  profileImage?: string;
}

export interface StreamingPlatform {
  id: string;
  name: string;
  logo: string;
  url: string;
  subscriptionType: 'free' | 'subscription' | 'rent' | 'buy';
  price?: number;
}

export interface MovieFilter {
  genres?: string[];
  yearFrom?: number;
  yearTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  sortBy?: 'title' | 'rating' | 'releaseDate' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  likes?: number;
}
