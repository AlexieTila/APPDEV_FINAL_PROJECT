import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Movie, MovieFilter, Review } from '../interfaces/movie.interface';
import { MovieModel } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = '/api/movies'; // Update with your actual API URL
  private favoritesSubject = new BehaviorSubject<Set<string>>(new Set());
  public favorites$ = this.favoritesSubject.asObservable();

  // Mock data for demonstration
  private mockMovies: Movie[] = this.generateMockMovies();

  constructor(private http: HttpClient) {
    this.loadFavoritesFromStorage();
  }

  private loadFavoritesFromStorage(): void {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      this.favoritesSubject.next(new Set(JSON.parse(stored)));
    }
  }

  private saveFavoritesToStorage(favorites: Set<string>): void {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }

  getSuggestedMovies(): Observable<Movie[]> {
    // Simulated API call
    return of(this.mockMovies.slice(0, 10));
    // Actual implementation:
    // return this.http.get<Movie[]>(`${this.apiUrl}/suggested`);
  }

  getLatestReleases(): Observable<Movie[]> {
    // Simulated API call
    const latest = [...this.mockMovies]
      .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
      .slice(0, 10);
    return of(latest);
    // Actual implementation:
    // return this.http.get<Movie[]>(`${this.apiUrl}/latest`);
  }

  searchMovies(query: string): Observable<Movie[]> {
    // Simulated API call
    const filtered = this.mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered);
    // Actual implementation:
    // const params = new HttpParams().set('q', query);
    // return this.http.get<Movie[]>(`${this.apiUrl}/search`, { params });
  }

  filterMovies(filters: MovieFilter): Observable<Movie[]> {
    // Simulated API call with filtering
    let filtered = [...this.mockMovies];

    if (filters.genres && filters.genres.length > 0) {
      filtered = filtered.filter(movie =>
        movie.genres.some(genre => filters.genres?.includes(genre))
      );
    }

    if (filters.yearFrom) {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() >= filters.yearFrom!
      );
    }

    if (filters.yearTo) {
      filtered = filtered.filter(movie =>
        new Date(movie.releaseDate).getFullYear() <= filters.yearTo!
      );
    }

    if (filters.ratingFrom) {
      filtered = filtered.filter(movie => movie.rating >= filters.ratingFrom!);
    }

    if (filters.ratingTo) {
      filtered = filtered.filter(movie => movie.rating <= filters.ratingTo!);
    }

    return of(filtered);
    // Actual implementation:
    // let params = new HttpParams();
    // Object.entries(filters).forEach(([key, value]) => {
    //   if (value) params = params.set(key, value.toString());
    // });
    // return this.http.get<Movie[]>(`${this.apiUrl}/filter`, { params });
  }

  getMovieById(id: string): Observable<Movie> {
    // Simulated API call
    const movie = this.mockMovies.find(m => m.id === id);
    return of(movie || this.mockMovies[0]);
    // Actual implementation:
    // return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  toggleFavorite(movieId: string): Observable<boolean> {
    const favorites = this.favoritesSubject.value;
    const isFavorite = favorites.has(movieId);

    if (isFavorite) {
      favorites.delete(movieId);
    } else {
      favorites.add(movieId);
    }

    this.saveFavoritesToStorage(favorites);
    this.favoritesSubject.next(new Set(favorites));

    // Actual implementation:
    // return this.http.post<boolean>(`${this.apiUrl}/${movieId}/favorite`, {});
    return of(!isFavorite);
  }

  isFavorite(movieId: string): boolean {
    return this.favoritesSubject.value.has(movieId);
  }

  getFavorites(): Observable<Movie[]> {
    const favoriteIds = Array.from(this.favoritesSubject.value);
    const favorites = this.mockMovies.filter(m => favoriteIds.includes(m.id));
    return of(favorites);
    // Actual implementation:
    // return this.http.get<Movie[]>(`${this.apiUrl}/favorites`);
  }

  rateMovie(movieId: string, rating: 'up' | 'down'): Observable<void> {
    // Actual implementation:
    // return this.http.post<void>(`${this.apiUrl}/${movieId}/rate`, { rating });
    return of(void 0);
  }

  getReviews(movieId: string): Observable<Review[]> {
    // Simulated API call
    return of([]);
    // Actual implementation:
    // return this.http.get<Review[]>(`${this.apiUrl}/${movieId}/reviews`);
  }

  addReview(movieId: string, rating: number, comment: string): Observable<Review> {
    // Simulated API call
    const review: Review = {
      id: Date.now().toString(),
      userId: '1',
      username: 'Current User',
      movieId,
      rating,
      comment,
      createdAt: new Date(),
      likes: 0
    };
    return of(review);
    // Actual implementation:
    // return this.http.post<Review>(`${this.apiUrl}/${movieId}/reviews`, { rating, comment });
  }

  getAllGenres(): Observable<string[]> {
    const genres = Array.from(
      new Set(this.mockMovies.flatMap(m => m.genres))
    ).sort();
    return of(genres);
  }

  private generateMockMovies(): Movie[] {
    const genres = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Romance', 'Horror', 'Adventure'];
    const movies: Movie[] = [];

    for (let i = 1; i <= 50; i++) {
      movies.push({
        id: i.toString(),
        title: `Movie ${i}`,
        poster: `https://via.placeholder.com/300x450/4A5568/FFFFFF?text=Movie+${i}`,
        backdrop: `https://via.placeholder.com/1280x720/334155/FFFFFF?text=Movie+${i}`,
        director: `Director ${i}`,
        cast: [
          { id: `${i}-1`, name: `Actor ${i * 2 - 1}`, character: 'Main Character' },
          { id: `${i}-2`, name: `Actor ${i * 2}`, character: 'Supporting Character' }
        ],
        genres: [genres[i % genres.length], genres[(i + 1) % genres.length]],
        releaseDate: new Date(2020 + (i % 5), (i % 12), 1),
        duration: 90 + (i % 60),
        rating: 5 + (i % 5) + Math.random(),
        description: `This is an exciting movie about ${genres[i % genres.length].toLowerCase()} and adventure. It takes you on a journey through ${genres[(i + 1) % genres.length].toLowerCase()} elements that will keep you entertained.`,
        tagline: `The greatest ${genres[i % genres.length].toLowerCase()} film of the year`,
        language: 'en',
        streamingPlatforms: [
          {
            id: '1',
            name: 'Netflix',
            logo: 'assets/netflix-logo.png',
            url: 'https://netflix.com',
            subscriptionType: 'subscription'
          },
          {
            id: '2',
            name: 'Amazon Prime',
            logo: 'assets/prime-logo.png',
            url: 'https://amazon.com/prime',
            subscriptionType: 'subscription'
          }
        ],
        isFavorite: false,
        userRating: null,
        averageRating: 7.5 + Math.random() * 2,
        totalReviews: Math.floor(Math.random() * 1000)
      });
    }

    return movies;
  }
}
