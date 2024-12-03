import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private urlApi = `http://localhost:5188`;
  private token = this.userService.readonlyUserInfo;
  private router = inject(Router);

  onGetComments(animeId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any[]>(`${this.urlApi}/api/comment/${animeId}`, {
        headers,
      })
      .pipe(
        tap({
          next: (response: any) => {
            return response.data;
          },
          error: (error: any) => {
            console.error('Error fetching comments:', error);
          },
        })
      );
  }
  onGetComment(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http
      .get<any>(`${this.urlApi}/api/comment/comment/${id}`, {
        headers,
      })
      .pipe(
        tap({
          next: (response: any) => {
            return response;
          },
          error: (error: any) => {
            console.error('Error fetching comments:', error);
          },
        })
      );
  }

  onPostComment(comment: {
    animeId: string;
    commentText: string;
  }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(
      `${this.urlApi}/api/comment`,
      JSON.stringify(comment),
      {
        headers,
      }
    );
  }

  onPutComment(data: { commentText: string }, id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.put<any>(`${this.urlApi}/api/comment/${id}`, data, {
      headers,
    });
  }

  onDeleteComment(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.delete<any>(`${this.urlApi}/api/comment/${id}`, {
      headers,
    });
  }
}
