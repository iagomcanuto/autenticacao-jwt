import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="topbar">
      <div class="container topbar-inner">
        <a routerLink="/produtos" class="brand" aria-label="Ir para produtos">
          <span>PF</span>
          Platzi Admin
        </a>

        <nav class="nav-actions">
          <a routerLink="/produtos" routerLinkActive="active">
            Produtos
          </a>
          <a routerLink="/categorias" routerLinkActive="active">Categorias</a>
          <span class="session-email" *ngIf="sessionEmail()">{{ sessionEmail() }}</span>
          <a routerLink="/login" class="login-link" *ngIf="!isLoggedIn()">Entrar</a>
          <button type="button" *ngIf="isLoggedIn()" (click)="logout()">Sair</button>
        </nav>
      </div>
    </header>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .topbar {
        background: rgba(250, 250, 247, 0.92);
        border-bottom: 1px solid var(--border);
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(14px);
      }

      .topbar-inner {
        align-items: center;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        min-height: 72px;
      }

      .brand {
        align-items: center;
        color: var(--ink);
        display: inline-flex;
        font-size: 1.05rem;
        font-weight: 800;
        gap: 0.7rem;
        text-decoration: none;
      }

      .brand span {
        align-items: center;
        background: var(--accent);
        border-radius: 8px;
        color: #fff;
        display: inline-flex;
        height: 38px;
        justify-content: center;
        width: 38px;
      }

      .nav-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        justify-content: flex-end;
      }

      .nav-actions a,
      .nav-actions button {
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        color: var(--muted);
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0.62rem 0.85rem;
        text-decoration: none;
      }

      .nav-actions a:hover,
      .nav-actions a.active,
      .nav-actions button:hover {
        background: #f0ede6;
        color: var(--ink);
      }

      .nav-actions .login-link {
        background: var(--ink);
        color: #fff;
      }

      .session-email {
        color: var(--muted);
        font-size: 0.9rem;
        font-weight: 700;
        padding: 0.62rem 0.35rem;
      }

      @media (max-width: 560px) {
        .topbar-inner {
          align-items: flex-start;
          flex-direction: column;
          padding-bottom: 0.9rem;
          padding-top: 0.9rem;
        }

        .nav-actions {
          justify-content: flex-start;
          width: 100%;
        }
      }
    `,
  ],
})
export class App {
  private authService = inject(AuthService);
  protected readonly isLoggedIn = computed(() => this.authService.isLoggedIn());
  protected readonly sessionEmail = computed(() => this.authService.session()?.email ?? '');

  protected logout(): void {
    this.authService.logout();
  }
}
