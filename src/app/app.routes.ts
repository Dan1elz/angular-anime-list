import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public-layout/login/login.component';
import { RegisterComponent } from './pages/public-layout/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },
];
