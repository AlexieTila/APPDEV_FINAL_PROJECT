 
import { Movie } from './movie.model';

export type { Movie };

export interface User {
  id: number;
  username: string;
  profilePicture?: string;
  favorites: Movie[];
  folders: Folder[];
  reviews: Review[];
}

export interface Folder {
  id: number;
  title: string;
  description: string;
  movies: Movie[];
}

export interface Review {
  id: number;
  movieId: number;
  userId: number;
  rating: 'thumbs_up' | 'thumbs_down';
  comment: string;
}
