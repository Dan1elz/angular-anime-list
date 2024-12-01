import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  AddSeasonDTO,
  AnimeDTO,
  AnimesDTO,
  GenreDTO,
} from '../interfaces/anime-dto.interface';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private urlApi = `http://localhost:5188`;
  private token = this.userService.readonlyUserInfo;

  onPostAnime(anime: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    for (let pair of (anime as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    return this.http.post<any>(`${this.urlApi}/api/anime`, anime, { headers });
  }
  onGetAnimes(): Observable<AnimesDTO[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http.get<any>(`${this.urlApi}/api/anime`, { headers }).pipe(
      map((response: any) => {
        if (response.data) {
          var animes: AnimesDTO[] = response.data.map(
            (item: any) => this.mapAnimesData(item) as AnimesDTO
          );
          console.log(response);
          return animes;
        }
        return [] as AnimesDTO[];
      })
    );
  }
  onGetAnime(id: string): Observable<AnimeDTO> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http
      .get<any>(`${this.urlApi}/api/anime/${id}`, { headers })
      .pipe(
        map((response: any) => {
          if (response.data) {
            console.log(response.data);
            var anime: AnimeDTO = this.mapAnimeData(response.data);

            return anime;
          }
          return {} as AnimeDTO;
        })
      );
  }

  onGetGenres(): Observable<GenreDTO[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http.get<any>(`${this.urlApi}/api/genre`, { headers }).pipe(
      map((response: any) => {
        if (response.data) {
          var genres = response.data.map((item: GenreDTO) => item as GenreDTO);
          console.log(genres);
          return genres;
        }
        return [] as GenreDTO[];
      })
    );
  }

  onFavorite(favoriteState: boolean, animeId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.put<any>(
      `${this.urlApi}/api/anime/favorite/${animeId}`,
      { favoriteState },
      { headers }
    );
  }
  onWathed(watchedState: boolean, animeId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.put<any>(
      `${this.urlApi}/api/anime/watched/${animeId}`,
      { watchedState },
      { headers }
    );
  }

  onAddSeason(season: AddSeasonDTO): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.post<any>(`${this.urlApi}/api/season`, season, {
      headers,
    });
  }
  private mapAnimesData(data: any): AnimesDTO {
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
  private mapAnimeData(data: any): AnimeDTO {
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
