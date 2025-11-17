import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private favoritesSubject = new BehaviorSubject<Movie[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  
  private readonly STORAGE_KEY = 'movieFavorites';
  private apiKey = '4a3b711b';

  constructor(private http: HttpClient) {
    this.loadFavorites();
  }

  searchMovies(query: string, year?: string, type?: 'movie'|'series'|'episode'): Observable<any> {
    const params = new URLSearchParams({ apikey: this.apiKey, s: query });
    if (year) params.set('y', year);
    if (type) params.set('type', type);
    return this.http.get(`https://www.omdbapi.com/?${params.toString()}`);
  }

  getMovieById(imdbID: string): Observable<any> {
    const params = new URLSearchParams({ apikey: this.apiKey, i: imdbID });
    return this.http.get(`https://www.omdbapi.com/?${params.toString()}`);
  }

  private loadFavorites(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const favorites = JSON.parse(stored);
      this.favoritesSubject.next(favorites);
    }
  }

  getFavorites(): Movie[] {
    return this.favoritesSubject.value;
  }

  addFavorite(movie: Movie): void {
    const favorites = this.favoritesSubject.value;
    if (!favorites.find(m => m.id === movie.id)) {
      const updated = [...favorites, { ...movie, favorite: true }];
      this.saveFavorites(updated);
    }
  }

  rateMovie(movieId: string, rating: 'up' | 'down'): void {
    const favorites = this.favoritesSubject.value;
    const exists = favorites.find(m => m.id === movieId);
    if (exists) {
      const updated = favorites.map(m => m.id === movieId ? { ...m, rating } : m);
      this.saveFavorites(updated);
    }
  }

  removeFavorite(movieId: string): void {
    const favorites = this.favoritesSubject.value;
    const updated = favorites.filter(m => m.id !== movieId);
    this.saveFavorites(updated);
  }

  isFavorite(movieId: string): boolean {
    return this.favoritesSubject.value.some(m => m.id === movieId);
  }

  updateNotes(movieId: string, notes: string): void {
    const favorites = this.favoritesSubject.value;
    const updated = favorites.map(m => 
      m.id === movieId ? { ...m, notes } : m
    );
    this.saveFavorites(updated);
  }

  private saveFavorites(favorites: Movie[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }
}