import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public-layout/login/login.component';
import { RegisterComponent } from './pages/public-layout/register/register.component';
import { MainComponent } from './pages/public-layout/main/main.component';
import { isUserLoggedGuard } from './core/guards/is-user-logged.guard';
import { HomeComponent } from './pages/authenticated-layout/home/home.component';
import { AddAnimeComponent } from './pages/authenticated-layout/add-anime/add-anime.component';
import { ProfileComponent } from './pages/authenticated-layout/profile/profile.component';
import { AnimeComponent } from './pages/authenticated-layout/anime/anime.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  {
    path: 'auth',
    component: MainComponent,
    canActivate: [isUserLoggedGuard],
    children: [
      { path: '', redirectTo: '/auth/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'add-anime', component: AddAnimeComponent },
      { path: 'settings', component: AddAnimeComponent },
      { path: 'anime/:id', component: AnimeComponent },
    ],
  },
];
