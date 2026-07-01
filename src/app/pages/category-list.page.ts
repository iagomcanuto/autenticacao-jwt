import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, PlatziApiService, Product } from '../services/platzi-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="container page-content">
      <section class="filters">
        <div>
          <span class="section-label">Categorias</span>
          <h1>Gestao de categorias</h1>
          <p class="muted">Pesquise por nome ou slug e simule manutencao dos registros.</p>
        </div>
        <a routerLink="/categorias/novo" class="primary-button">Nova categoria</a>
      </section>

      <form [formGroup]="filterForm" class="filter-bar compact-filter">
        <input type="search" formControlName="search" placeholder="Buscar categoria">
        <select formControlName="withProducts" aria-label="Produtos vinculados">
          <option value="">Todas</option>
          <option value="yes">Com produtos</option>
          <option value="no">Sem produtos</option>
        </select>
      </form>

      <section class="category-grid" *ngIf="!loading(); else loadingTemplate">
        <article class="category-card" *ngFor="let category of filteredCategories()">
          <img [src]="category.image" [alt]="category.name">
          <div>
            <span class="section-label">#{{ category.id }}</span>
            <h2>{{ category.name }}</h2>
            <p>{{ category.slug }}</p>
            <strong>{{ countProducts(category.id) }} produtos</strong>
          </div>
          <div class="row-actions">
            <a [routerLink]="['/categorias', category.id, 'editar']">Editar</a>
            <a [routerLink]="['/categorias', category.id, 'excluir']" class="danger-link">Excluir</a>
          </div>
        </article>
      </section>

      <div class="state-card" *ngIf="!loading() && !filteredCategories().length">
        Nenhuma categoria encontrada.
      </div>

      <ng-template #loadingTemplate>
        <div class="state-card">Carregando categorias...</div>
      </ng-template>
    </main>
  `,
})
export class CategoryListPage implements OnInit {
  private api = inject(PlatziApiService);
  private fb = inject(FormBuilder);

  protected readonly categories = signal<Category[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly filterForm = this.fb.group({ search: [''], withProducts: [''] });
  protected readonly formValue = signal(this.filterForm.getRawValue());

  protected readonly filteredCategories = computed(() => {
    const filters = this.formValue();
    const search = (filters.search ?? '').trim().toLowerCase();
    const withProducts = filters.withProducts ?? '';

    return this.categories().filter((category) => {
      const count = this.countProducts(category.id);
      const matchesSearch =
        !search ||
        category.name.toLowerCase().includes(search) ||
        category.slug.toLowerCase().includes(search);
      const matchesCount =
        !withProducts || (withProducts === 'yes' ? count > 0 : count === 0);
      return matchesSearch && matchesCount;
    });
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => this.formValue.set(this.filterForm.getRawValue()));
    this.api.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getProducts().subscribe({ next: (products) => this.products.set(products) });
  }

  protected countProducts(categoryId: number): number {
    return this.products().filter((product) => product.category.id === categoryId).length;
  }
}
