import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="auth-page">
      <section class="auth-card">
        <span class="section-label">JWT</span>
        <h1>Entrar no painel</h1>
        <p>Use a credencial publica da Platzi Fake Store API para acessar o gerenciador.</p>

        <form [formGroup]="loginForm" (ngSubmit)="submit()">
          <label>
            Email
            <input type="email" formControlName="email" autocomplete="username">
          </label>

          <label>
            Senha
            <input type="password" formControlName="password" autocomplete="current-password">
          </label>

          <button type="submit" [disabled]="loginForm.invalid || loading()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="login-help">
          <strong>Teste rapido</strong>
          <span>john@mail.com / changeme</span>
        </div>
        <p class="error-message" *ngIf="error()">{{ error() }}</p>
      </section>
    </main>
  `,
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly loginForm = this.fb.group({
    email: ['john@mail.com', [Validators.required, Validators.email]],
    password: ['changeme', [Validators.required]],
  });

  protected submit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.loading.set(true);
    this.error.set('');

    this.authService.login(email ?? '', password ?? '').subscribe({
      next: () => this.router.navigateByUrl('/produtos'),
      error: () => {
        this.error.set('Email ou senha invalidos.');
        this.loading.set(false);
      },
    });
  }
}
