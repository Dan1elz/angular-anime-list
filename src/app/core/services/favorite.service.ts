import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AnimesDTO, ResponseGetDTO } from '../interfaces/anime-dto.interface';
import { map } from 'rxjs';
import { UserService } from './user.service';
import { AnimeMapperDTO } from '../mappers/animeMapperDTO';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private animeMapperDTO = inject(AnimeMapperDTO);
  private userService = inject(UserService);
  private urlApi = `http://localhost:5188`;
  private http = inject(HttpClient);
  private token = this.userService.readonlyUserInfo;

  private animeState = signal<ResponseGetDTO | undefined>(undefined);
  animeFavorited = this.animeState.asReadonly();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token()}`,
  });

  onGetAnimesFavorited(offset: number, limit: number) {
    return this.http
      .get<any>(`${this.urlApi}/api/anime/favorite/${offset}/${limit}`, {
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
      .subscribe((anime) => this.animeState.set(anime));
  }

  onRemoveFavorited(animeId: string) {
    return this.http
      .put<any>(
        `${this.urlApi}/api/anime/favorite/${animeId}`,
        { favoriteState: false },
        { headers: this.headers }
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
