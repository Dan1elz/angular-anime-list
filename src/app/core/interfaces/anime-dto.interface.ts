export interface GenreDTO {
  id: string;
  name: string;
  created: string;
  updated: string;
}
export interface AnimesDTO {
  id: string;
  title: string;
  alternativeTitle?: string;
  year: number;
  image: string;
  description: string;
  lenguage: string;
  rating: number;
  favoriteState: boolean;
  watchedState: boolean;
  seasons: number;
}
export interface AnimeDTO {
  title: string;
  alternativeTitle?: string;
  year: number;
  image: string;
  description: string;
  lenguage: string;
  rating: number;
  favoriteState: boolean;
  watchedState: boolean;
  genres: Genre[];
  seasons?: SeasonsDTO[];
}
export interface SeasonsDTO {
  id: string;
  name: string;
  quantityEpisodes: number;
}
interface Genre {
  name: string;
}
