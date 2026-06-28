import { Component, ViewEncapsulation } from '@angular/core';
import { LoginComponent } from '../../ui/login/login';

@Component({
  selector: 'app-login-page',
  imports: [LoginComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginPageComponent {}
