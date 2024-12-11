import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import {
  AddSeasonDTO,
  AnimeDTO,
  AnimesDTO,
  GenreDTO,
  ResponseGetDTO,
} from '../interfaces/anime-dto.interface';
import { Router } from '@angular/router';
import { AnimeMapperDTO } from '../mappers/animeMapperDTO';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private animeMapperDTO = inject(AnimeMapperDTO);
  private userService = inject(UserService);
  private urlApi = `http://localhost:5188`;
  private http = inject(HttpClient);
  private router = inject(Router);
  private token = this.userService.readonlyUserInfo;

  private animesState = signal<ResponseGetDTO | null>(null);
  animes = this.animesState.asReadonly();

  private animesRatingState = signal<ResponseGetDTO | null>(null);
  animesRating = this.animesRatingState.asReadonly();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token()}`,
  });

  onPostAnime(anime: FormData): Observable<any> {
    for (let pair of (anime as any).entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    return this.http.post<any>(`${this.urlApi}/api/anime`, anime, {
      headers: this.headers,
    });
  }
  onGetAnimes(offset: number, limit: number) {
    return this.http
      .get<any>(`${this.urlApi}/api/anime/${offset}/${limit}`, {
        headers: this.headers,
      })
      .pipe(
        map((response: any) => {
          console.log(response);
          if (response.data) {
            var animes: AnimesDTO[] = response.data.map(
              (item: any) => this.animeMapperDTO.mapAnimesDTO(item) as AnimesDTO
            );
            const total = response.total;
            return { animes, total };
          }
          return { animes: [], total: 0 };
        })
      )
      .subscribe((animes) => this.animesState.set(animes));
  }

  onGetAnime(id: string): Observable<AnimeDTO> {
    return this.http
      .get<any>(`${this.urlApi}/api/anime/${id}`, { headers: this.headers })
      .pipe(
        map((response: any) => {
          if (response.data) {
            console.log(response.data);
            var anime: AnimeDTO = this.animeMapperDTO.mapAnimeDTO(
              response.data
            );

            return anime;
          }
          return {} as AnimeDTO;
        })
      );
  }

  onGetAnimesOrderByRating(offset: number, limit: number) {
    return this.http
      .get<any>(`${this.urlApi}/api/anime/rating/${offset}/${limit}`, {
        headers: this.headers,
      })
      .pipe(
        map((response: any) => {
          if (response.data) {
            var animes: AnimesDTO[] = response.data.map(
              (item: any) => this.animeMapperDTO.mapAnimesDTO(item) as AnimesDTO
            );
            const total = response.total;
            return { animes, total };
          }
          return { animes: [], total: 0 };
        })
      )
      .subscribe((anime) => this.animesRatingState.set(anime));
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

  onToggleFavorite(favoriteState: boolean, animeId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http
      .put<any>(
        `${this.urlApi}/api/anime/favorite/${animeId}`,
        { favoriteState },
        { headers }
      )
      .subscribe(() => {
        const anime = this.animesState();
        const index = anime!.animes.findIndex((a) => a.id === animeId);
        if (index > 0) {
          anime!.animes[index].favoriteState = favoriteState;
          this.animesState.set(anime);
        }
      });
  }

  onAddSeason(season: AddSeasonDTO): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.post<any>(`${this.urlApi}/api/season`, season, {
      headers,
    });
  }
}
