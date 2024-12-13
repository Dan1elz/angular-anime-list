import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, Signal, signal } from '@angular/core';
import {
  LoginDTO,
  UserInfoDTO,
  RegisterDTO,
  UserDTO,
  UpdateDTO,
} from '../interfaces/user-dto.interface';
import { map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/variable.environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private urlApi = environment.urlApi;
  private userInfo = signal<UserInfoDTO | undefined>(undefined);

  readonlyUserInfo = this.userInfo.asReadonly();
  constructor() {
    effect(() => this.onSyncUserInfo());
  }

  onRegister(register: RegisterDTO): Observable<any> {
    return this.http.post(`${this.urlApi}/api/user`, register);
  }

  onLogin(login: LoginDTO): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/api/user/login`, login).pipe(
      tap((response) => {
        if (!response.data) return;
        var token: UserInfoDTO = response.data;
        this.onSetUserInfo(token);
        this.router.navigate(['/auth']);
      })
    );
  }

  onGetUser(): Observable<UserDTO> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userInfo()}`,
    });

    return this.http.get<any>(`${this.urlApi}/api/user`, { headers }).pipe(
      map((response: any) => {
        console.log(response);
        if (response && response.data) {
          return response.data as UserDTO;
        }
        return {} as UserDTO;
      })
    );
  }

  onUpdate(update: UpdateDTO): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userInfo()}`,
    });
    return this.http.put(`${this.urlApi}/api/user`, update, { headers });
  }

  onDelete(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.userInfo()}`,
    });
    return this.http.delete(`${this.urlApi}/api/user`, { headers });
  }

  onLogout() {
    localStorage.removeItem('UserData');
    this.userInfo.set(undefined);
    this.router.navigate(['/login']);
  }

  onSyncUserInfo() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('UserData', JSON.stringify(this.userInfo()));
    }
  }

  onSetUserInfo(userInfo: UserInfoDTO) {
    this.userInfo.set(userInfo);
  }

  onTrySyncUserInfo() {
    if (this.isLocalStorageAvailable()) {
      const userInfo = localStorage.getItem('UserData');
      if (!userInfo) return;
      this.onSetUserInfo(JSON.parse(userInfo));
    }
  }

  isUserLogged(): boolean {
    return !!this.userInfo();
  }

  isLocalStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
