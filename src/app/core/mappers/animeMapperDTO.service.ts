import { Injectable } from '@angular/core';
import { AnimeDTO, AnimesDTO } from '../interfaces/anime-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class AnimeMapperDTO {
  mapAnimesDTO(data: any): AnimesDTO {
    return {
      id: data.anime.id,
      title: data.anime.title,
      alternativeTitle: data.anime.alternativeTitle,
      year: data.anime.year,
      image: data.animeUrl,
      description: data.anime.description,
      lenguage: data.anime.lenguage,
      rating: data.anime.rating,
      favoriteState: data.anime.favoriteState,
      watchedState: data.anime.watchedState,
      seasons: data.seasons,
    };
  }
  mapAnimeDTO(data: any): AnimeDTO {
    return {
      title: data.anime.title,
      alternativeTitle: data.anime.alternativeTitle,
      year: data.anime.year,
      image: data.hostUrl,
      description: data.anime.description,
      lenguage: data.anime.lenguage,
      rating: data.anime.rating,
      favoriteState: data.anime.favoriteState,
      watchedState: data.anime.watchedState,
      genres: data.genres,
      seasons: data.seasons ?? null,
    };
  }
}
