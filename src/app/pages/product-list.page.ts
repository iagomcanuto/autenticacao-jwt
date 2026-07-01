import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category, PlatziApiService, Product } from '../services/platzi-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="kicker">Platzi Fake Store API</span>
          <h1>Gestao de produtos</h1>
          <p>Catalogo protegido por JWT com filtros, acoes simuladas e visual limpo para operacao.</p>
        </div>
        <div class="hero-panel">
          <strong>{{ products().length }}</strong>
          <span>produtos carregados</span>
          <strong>{{ categories().length }}</strong>
          <span>categorias ativas</span>
        </div>
      </div>
    </section>

    <main class="container page-content">
      <section class="filters">
        <div>
          <span class="section-label">Produtos</span>
          <h2>Lista de produtos</h2>
        </div>
        <a routerLink="/produtos/novo" class="primary-button">Novo produto</a>
      </section>

      <form [formGroup]="filterForm" class="filter-bar">
        <input type="search" formControlName="search" placeholder="Buscar por nome">
        <select formControlName="categoryId" aria-label="Categoria">
          <option value="">Todas as categorias</option>
          <option *ngFor="let category of categories()" [value]="category.id">{{ category.name }}</option>
        </select>
        <input type="number" min="0" formControlName="maxPrice" placeholder="Preco maximo">
      </form>

      <ng-container *ngIf="!loading(); else loadingTemplate">
        <section class="table-shell" *ngIf="filteredProducts().length; else emptyTemplate">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preco</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts()">
                <td>
                  <div class="record-title">
                    <img [src]="imageOf(product)" [alt]="product.title">
                    <div>
                      <strong>{{ product.title }}</strong>
                      <span>#{{ product.id }} - {{ product.slug }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ product.category.name }}</td>
                <td>{{ product.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</td>
                <td>
                  <div class="row-actions">
                    <a [routerLink]="['/produtos', product.id, 'editar']">Editar</a>
                    <a [routerLink]="['/produtos', product.id, 'excluir']" class="danger-link">Excluir</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </ng-container>

      <ng-template #loadingTemplate>
        <div class="state-card">Carregando produtos...</div>
      </ng-template>

      <ng-template #emptyTemplate>
        <div class="state-card">Nenhum produto encontrado com esses filtros.</div>
      </ng-template>
    </main>
  `,
})
export class ProductListPage implements OnInit {
  private api = inject(PlatziApiService);
  private fb = inject(FormBuilder);

  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly loading = signal(true);
  protected readonly filterForm = this.fb.group({
    search: [''],
    categoryId: [''],
    maxPrice: [''],
  });
  protected readonly formValue = signal(this.filterForm.getRawValue());

  protected readonly filteredProducts = computed(() => {
    const filters = this.formValue();
    const search = (filters.search ?? '').trim().toLowerCase();
    const categoryId = Number(filters.categoryId || 0);
    const maxPrice = Number(filters.maxPrice || 0);

    return this.products().filter((product) => {
      const matchesSearch = !search || product.title.toLowerCase().includes(search);
      const matchesCategory = !categoryId || product.category.id === categoryId;
      const matchesPrice = !maxPrice || product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  });

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => this.formValue.set(this.filterForm.getRawValue()));
    this.api.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.api.getCategories().subscribe({ next: (categories) => this.categories.set(categories) });
  }

  protected imageOf(product: Product): string {
    return product.images?.[0] || product.category.image || 'https://placehold.co/120x120';
  }
}
