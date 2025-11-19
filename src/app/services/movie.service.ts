import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  // OMDB API key - Get your free key at https://www.omdbapi.com/apikey.aspx
  private apiKey = '9bd82f91';
  private baseUrl = 'https://www.omdbapi.com';

  // Popular movie IDs to fetch
  private popularMovieIds = [
    'tt0111161', // The Shawshank Redemption
    'tt0068646', // The Godfather
    'tt0468569', // The Dark Knight
    'tt0110912', // Pulp Fiction
    'tt0109830', // Forrest Gump
    'tt1375666', // Inception
    'tt0137523', // Fight Club
    'tt0133093', // The Matrix
    'tt0167260', // The Lord of the Rings: The Return of the King
    'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
    'tt0080684', // Star Wars: Episode V
    'tt0816692', // Interstellar
  ];

  private latestMovieIds = [
    'tt15398776', // Oppenheimer
    'tt6710474',  // Everything Everywhere All at Once
    'tt9362722',  // Spider-Man: Across the Spider-Verse
    'tt1160419',  // Dune
    'tt10872600', // Spider-Man: No Way Home
    'tt8041270',  // Barbie
  ];

  constructor(private http: HttpClient) {}

  private convertOMDBToMovie(omdbMovie: any): Movie {
    const genreMap: { [key: string]: { id: number; name: string }[] } = {
      'Action': [{ id: 28, name: 'Action' }],
      'Adventure': [{ id: 12, name: 'Adventure' }],
      'Animation': [{ id: 16, name: 'Animation' }],
      'Comedy': [{ id: 35, name: 'Comedy' }],
      'Crime': [{ id: 80, name: 'Crime' }],
      'Drama': [{ id: 18, name: 'Drama' }],
      'Fantasy': [{ id: 14, name: 'Fantasy' }],
      'Horror': [{ id: 27, name: 'Horror' }],
      'Mystery': [{ id: 9648, name: 'Mystery' }],
      'Romance': [{ id: 10749, name: 'Romance' }],
      'Sci-Fi': [{ id: 878, name: 'Science Fiction' }],
      'Thriller': [{ id: 53, name: 'Thriller' }],
    };

    const genres = omdbMovie.Genre ? 
      omdbMovie.Genre.split(', ').map((g: string) => genreMap[g] || [{ id: 0, name: g }]).flat() : 
      [];

    return {
      id: parseInt(omdbMovie.imdbID.replace('tt', '')) || 0,
      title: omdbMovie.Title || 'Unknown',
      poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/placeholder.jpg',
      release_date: omdbMovie.Released || omdbMovie.Year || 'Unknown',
      overview: omdbMovie.Plot || 'No overview available.',
      genres: genres,
      director: omdbMovie.Director || 'Unknown',
      cast: omdbMovie.Actors ? omdbMovie.Actors.split(', ') : [],
      vote_average: omdbMovie.imdbRating ? parseFloat(omdbMovie.imdbRating) : 0
    };
  }

  getPopularMovies(): Observable<any> {
    if (this.apiKey === 'YOUR_OMDB_API_KEY') {
      console.error('⚠️ OMDB API KEY NOT SET! Get your free key at https://www.omdbapi.com/apikey.aspx');
      return of({ results: [] });
    }
    const apiKey = this.apiKey;
    
    const requests = this.popularMovieIds.map(id =>
      this.http.get(`${this.baseUrl}/?i=${id}&apikey=${apiKey}&plot=full`).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map((movies: any[]) => {
        const validMovies = movies
          .filter(m => m && m.Response === 'True')
          .map(m => this.convertOMDBToMovie(m));
        return { results: validMovies };
      }),
      catchError(() => of({ results: [] }))
    );
  }

  getLatestMovies(): Observable<any> {
    if (this.apiKey === 'YOUR_OMDB_API_KEY') {
      console.error('⚠️ OMDB API KEY NOT SET! Get your free key at https://www.omdbapi.com/apikey.aspx');
      return of({ results: [] });
    }
    const apiKey = this.apiKey;
    
    const requests = this.latestMovieIds.map(id =>
      this.http.get(`${this.baseUrl}/?i=${id}&apikey=${apiKey}&plot=full`).pipe(
        catchError(() => of(null))
      )
    );

    return forkJoin(requests).pipe(
      map((movies: any[]) => {
        const validMovies = movies
          .filter((m: any) => m && m.Response === 'True')
          .map((m: any) => this.convertOMDBToMovie(m));
        return { results: validMovies };
      }),
      catchError(() => of({ results: [] }))
    );
  }

  searchMovies(query: string): Observable<any> {
    if (!query || query.trim() === '') {
      console.log('Search query is empty');
      return of({ results: [] });
    }

    if (this.apiKey === 'YOUR_OMDB_API_KEY') {
      console.error('⚠️ OMDB API KEY NOT SET! Get your free key at https://www.omdbapi.com/apikey.aspx');
      alert('Please set your OMDB API key in movie.service.ts\n\nGet a FREE key at: https://www.omdbapi.com/apikey.aspx');
      return of({ results: [] });
    }

    const apiKey = this.apiKey;
    const searchUrl = `${this.baseUrl}/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
    
    console.log('Searching OMDB API:', searchUrl);
    
    return this.http.get(searchUrl).pipe(
      switchMap((response: any) => {
        console.log('OMDB Search Response:', response);
        
        if (response.Response === 'True' && response.Search && response.Search.length > 0) {
          console.log(`Found ${response.Search.length} movies, fetching details...`);
          
          // Fetch full details for each movie
          const detailRequests: Observable<any>[] = response.Search.slice(0, 10).map((movie: any) =>
            this.http.get(`${this.baseUrl}/?i=${movie.imdbID}&apikey=${apiKey}&plot=full`).pipe(
              catchError((err) => {
                console.error('Error fetching movie details:', err);
                return of(null);
              })
            )
          );

          if (detailRequests.length === 0) {
            return of({ results: [] });
          }

          return forkJoin(detailRequests).pipe(
            map((movies: any[]) => {
              console.log('Fetched movie details:', movies);
              const validMovies = movies
                .filter((m: any) => m && m.Response === 'True')
                .map((m: any) => this.convertOMDBToMovie(m));
              console.log('Valid movies after conversion:', validMovies);
              return { results: validMovies };
            })
          );
        } else {
          console.log('No movies found or error:', response.Error || 'No results');
          return of({ results: [] });
        }
      }),
      catchError((error) => {
        console.error('Search error:', error);
        return of({ results: [] });
      })
    );
  }

  getMovieDetails(id: number): Observable<Movie> {
    if (this.apiKey === 'YOUR_OMDB_API_KEY') {
      console.error('⚠️ OMDB API KEY NOT SET! Get your free key at https://www.omdbapi.com/apikey.aspx');
      return of({
        id: id,
        title: 'API Key Required',
        poster_path: '/placeholder.jpg',
        release_date: 'Unknown',
        overview: 'Please set your OMDB API key to view movie details.',
        genres: [],
        director: 'Unknown',
        cast: [],
        vote_average: 0
      });
    }
    const apiKey = this.apiKey;
    const imdbId = `tt${id.toString().padStart(7, '0')}`;
    
    return this.http.get(`${this.baseUrl}/?i=${imdbId}&apikey=${apiKey}&plot=full`).pipe(
      map((movie: any) => {
        if (movie.Response === 'True') {
          return this.convertOMDBToMovie(movie);
        }
        throw new Error('Movie not found');
      }),
      catchError(() => {
        // Return a placeholder movie
        return of({
          id: id,
          title: 'Movie Not Found',
          poster_path: '/placeholder.jpg',
          release_date: 'Unknown',
          overview: 'No information available.',
          genres: [],
          director: 'Unknown',
          cast: [],
          vote_average: 0
        });
      })
    );
  }

  getStreamingProviders(id: number): Observable<any> {
    // OMDB doesn't provide streaming info, return empty
    return of({ results: {} });
  }
}
