import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginDto } from './auth.interface';
import { Observable, tap } from 'rxjs';
import { IS_BROWSER } from '../../shared/tokens/browser.token';
import { LOCAL_STORAGE } from '../../shared/tokens/local-storage.token';
import { API_URL } from '../../shared/tokens/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly IS_BROWSER = inject(IS_BROWSER);
  private readonly LOCAL_STORAGE = inject(LOCAL_STORAGE);
  private readonly API_URL = inject(API_URL);

  public readonly token = signal<string | null>(
    this.LOCAL_STORAGE?.getItem('auth_token') ?? null
  );

  public readonly isAuthenticated = computed(() => !!this.token());

  public login(credentials: LoginDto): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(tap(response => this.saveToken(response.accessToken)));
  }

  public saveToken(token: string): void {
    this.token.set(token);
    if (this.IS_BROWSER) this.LOCAL_STORAGE!.setItem('auth_token', token);
  }

  public logout(): void {
    this.token.set(null);
    if (this.IS_BROWSER) this.LOCAL_STORAGE!.removeItem('auth_token');
  }
}
