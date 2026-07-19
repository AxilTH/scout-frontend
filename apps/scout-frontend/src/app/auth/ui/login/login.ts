import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  DestroyRef,
} from '@angular/core';
import { form, FormField, validate } from '@angular/forms/signals';
import { ButtonComponent } from '../../../shared/ui/button/button';
import { InputComponent } from '../../../shared/ui/input/input';
import { AuthService } from '../../data-access/auth';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ServerErrorParser } from '../../../shared/utils/server-error-parser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [FormField, ButtonComponent, InputComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly emailServerError = signal<string | null>(null);
  protected readonly passwordServerError = signal<string | null>(null);
  protected readonly formServerError = signal<string | null>(null);

  protected readonly loginModel = signal({
    email: '',
    password: '',
  });

  protected readonly loginForm = form(this.loginModel, schemaPath => {
    validate(schemaPath.email, () => {
      const serverError = this.emailServerError();
      if (serverError) {
        return { kind: 'server-error', message: serverError };
      }
      return null;
    });
    validate(schemaPath.password, () => {
      const serverError = this.passwordServerError();
      if (serverError) {
        return { kind: 'server-error', message: serverError };
      }
      return null;
    });
  });

  protected onSubmit(): void {
    const credentials = this.loginModel();

    this.authService
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.clearErrors();

          if (err.status === 401) {
            this.formServerError.set(
              'Неверный адрес электронной почты или пароль'
            );
            return;
          }
          if (err.status === 0) {
            this.formServerError.set(
              'Сервер недоступен. Пожалуйста, попробуйте позже'
            );
            return;
          }

          const rawMessages = err.error?.message;

          if (Array.isArray(rawMessages)) {
            const parsedErrors = ServerErrorParser.parse(rawMessages);

            if (parsedErrors['email']) {
              this.emailServerError.set(parsedErrors['email']);
            }
            if (parsedErrors['password']) {
              this.passwordServerError.set(parsedErrors['password']);
            }
          } else if (typeof err.error === 'string') {
            this.formServerError.set(rawMessages);
          } else {
            this.formServerError.set(
              'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже'
            );
          }
        },
      });
  }

  protected clearErrors(): void {
    this.emailServerError.set(null);
    this.passwordServerError.set(null);
    this.formServerError.set(null);
  }
}
