import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AnimesDTO, ResponseGetDTO } from '../interfaces/anime-dto.interface';
import { map } from 'rxjs';
import { UserService } from './user.service';
import { AnimeMapperDTO } from '../mappers/animeMapperDTO';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private animeMapperDTO = inject(AnimeMapperDTO);
  private userService = inject(UserService);
  private urlApi = `http://localhost:5188`;
  private http = inject(HttpClient);
  private token = this.userService.readonlyUserInfo;

  private animeState = signal<ResponseGetDTO | null>(null);
  animeFavorited = this.animeState.asReadonly();

  onGetAnimesFavorited(offset: number, limit: number) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http
      .get<any>(`${this.urlApi}/api/anime/favorite/${offset}/${limit}`, {
        headers,
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
      .subscribe((anime) => this.animeState.set(anime));
  }

  onRemoveFavorited(animeId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http
      .put<any>(
        `${this.urlApi}/api/anime/favorite/${animeId}`,
        { favoriteState: false },
        { headers }
      )
      .subscribe(() => {
        const anime = this.animeState();
        const index = anime!.animes.findIndex((a) => a.id === animeId);
        if (index > 0) {
          anime!.animes.splice(index, 1);
          this.animeState.set(anime);
        }
      });
  }
}
