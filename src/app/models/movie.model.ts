export interface Movie {
  id?: string;
  title: string;
  year: string;
  genre?: string;
  posterUrl?: string;
  favorite?: boolean;
  notes?: string;
  rating?: 'up' | 'down';
}