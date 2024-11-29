import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal, Signal } from '@angular/core';
import { Router } from 'express';
import { map, Observable } from 'rxjs';
import { GenreDTO } from '../interfaces/anime-dto.interface';

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

  onGetGenres(): Observable<GenreDTO[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });
    return this.http.get<any>(`${this.urlApi}/api/genre`, { headers }).pipe(
      map((response: any) => {
        if (response.data) {
          var batata = response.data.map((item: GenreDTO) => item as GenreDTO);
          console.log(batata);
          return batata;
        }
        return [] as GenreDTO[];
      })
    );
  }
}
