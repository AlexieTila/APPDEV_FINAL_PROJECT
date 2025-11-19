 
export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
  genres: Genre[];
  director: string;
  cast: string[];
  vote_average: number;
  streaming_providers?: StreamingProvider[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface StreamingProvider {
  provider_name: string;
  logo_path: string;
}