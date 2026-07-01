import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = 'https://api.escuelajs.co/api/v1';
  private readonly storageKey = 'platzi-store-session';
  private readonly sessionState = signal<Session | null>(this.loadSession());

  readonly session = computed(() => this.sessionState());
  readonly isLoggedIn = computed(() => !!this.sessionState()?.accessToken);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        const session: Session = {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          email,
        };

        localStorage.setItem(this.storageKey, JSON.stringify(session));
        this.sessionState.set(session);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionState.set(null);
    this.router.navigateByUrl('/login');
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  private loadSession(): Session | null {
    const rawSession = localStorage.getItem(this.storageKey);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as Session;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
