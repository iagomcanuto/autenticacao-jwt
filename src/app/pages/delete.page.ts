import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category, PlatziApiService, Product } from '../services/platzi-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container page-content">
      <a [routerLink]="backUrl()" class="back-link">Voltar</a>

      <section class="delete-shell">
        <span class="section-label">Exclusao simulada</span>
        <h1>Confirmar exclusao</h1>
        <p class="muted">
          Esta tela representa a confirmacao de exclusao. Nenhum dado sera removido da API.
        </p>

        <div class="delete-preview" *ngIf="title(); else loadingTemplate">
          <img *ngIf="image()" [src]="image()" [alt]="title()">
          <div>
            <strong>{{ title() }}</strong>
            <span>{{ kindLabel() }} #{{ id() }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="danger-button" (click)="confirmDelete()">Confirmar exclusao</button>
          <a [routerLink]="backUrl()" class="secondary-button">Cancelar</a>
        </div>

        <p class="success-message" *ngIf="deleted()">Exclusao simulada com sucesso.</p>
      </section>

      <ng-template #loadingTemplate>
        <div class="state-card">Carregando registro...</div>
      </ng-template>
    </main>
  `,
})
export class DeletePage implements OnInit {
  private api = inject(PlatziApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly id = signal(0);
  protected readonly kind = signal<'produto' | 'categoria'>('produto');
  protected readonly title = signal('');
  protected readonly image = signal('');
  protected readonly deleted = signal(false);
  protected readonly kindLabel = computed(() => (this.kind() === 'produto' ? 'Produto' : 'Categoria'));
  protected readonly backUrl = computed(() => (this.kind() === 'produto' ? '/produtos' : '/categorias'));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const isCategory = this.router.url.includes('/categorias/');
    this.id.set(id);
    this.kind.set(isCategory ? 'categoria' : 'produto');

    if (isCategory) {
      this.api.getCategory(id).subscribe({ next: (category) => this.fillCategory(category) });
      return;
    }

    this.api.getProduct(id).subscribe({ next: (product) => this.fillProduct(product) });
  }

  protected confirmDelete(): void {
    this.deleted.set(true);
    setTimeout(() => this.router.navigateByUrl(this.backUrl()), 650);
  }

  private fillCategory(category: Category): void {
    this.title.set(category.name);
    this.image.set(category.image);
  }

  private fillProduct(product: Product): void {
    this.title.set(product.title);
    this.image.set(product.images?.[0] || product.category.image);
  }
}
