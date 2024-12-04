import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import {
  AddSeasonDTO,
  AnimeDTO,
  AnimesDTO,
  GenreDTO,
  ResponseGetDTO,
} from '../interfaces/anime-dto.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private urlApi = `http://localhost:5188`;
  private token = this.userService.readonlyUserInfo;
  private router = inject(Router);

  onPostAnime(anime: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    for (let pair of (anime as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    return this.http.post<any>(`${this.urlApi}/api/anime`, anime, { headers });
  }
  onGetAnimes(): Observable<ResponseGetDTO> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http
      .get<any>(`${this.urlApi}/api/anime/0/20/`, { headers })
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response.data) {
            var animes: AnimesDTO[] = response.data.map(
              (item: any) => this.mapAnimesData(item) as AnimesDTO
            );
            const total = response.total;
            return { animes, total };
          }
          return { animes: [], total: 0 };
        })
      );
  }

  onGetAnimesFavorited(
    offset: number,
    limit: number
  ): Observable<ResponseGetDTO> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http
      .get<any>(`${this.urlApi}/api/anime/favorite/${offset}/${limit}`, {
        headers,
      })
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response.data) {
            var animes: AnimesDTO[] = response.data.map(
              (item: any) => this.mapAnimesData(item) as AnimesDTO
            );
            const total = response.total;
            return { animes, total };
          }
          return { animes: [], total: 0 };
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

  onDelete(animeId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http
      .delete<any>(`${this.urlApi}/api/anime/${animeId}`, {
        headers,
      })
      .pipe(
        tap((response) => {
          if (!response.message) return;
          this.router.navigate(['/auth']);
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
