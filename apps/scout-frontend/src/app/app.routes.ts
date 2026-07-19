import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/feature/login-page/login-page';
import { guestGuard } from './auth/data-access/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
  },
];
