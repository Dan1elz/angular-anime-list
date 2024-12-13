import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GenreDTO } from '../interfaces/anime-dto.interface';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class GenresService {
  private userService = inject(UserService);
  private urlApi = `http://localhost:5188`;
  private http = inject(HttpClient);
  private token = this.userService.readonlyUserInfo;

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token()}`,
  });

  genres = toSignal<GenreDTO[] | undefined>(this.onGetGenres());

  onGetGenres(): Observable<GenreDTO[]> {
    return this.http
      .get<any>(`${this.urlApi}/api/genre`, { headers: this.headers })
      .pipe(
        map((response: any) => {
          if (response.data) {
            var genres = response.data.map(
              (item: GenreDTO) => item as GenreDTO
            );
            return genres;
          }
          return [] as GenreDTO[];
        })
      );
  }
}
