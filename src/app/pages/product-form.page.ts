import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanLeaveDirtyForm } from '../auth/unsaved-changes.guard';
import { Category, PlatziApiService } from '../services/platzi-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="container page-content">
      <a routerLink="/produtos" class="back-link">Voltar para produtos</a>

      <section class="form-shell">
        <div>
          <span class="section-label">Produto</span>
          <h1>{{ isEdit() ? 'Editar produto' : 'Novo produto' }}</h1>
          <p class="muted">Prototipo de formulario. Ao salvar, o sistema apenas simula a operacao.</p>
        </div>

        <form [formGroup]="productForm" (ngSubmit)="submit()" class="record-form">
          <label>
            Titulo
            <input type="text" formControlName="title">
          </label>

          <div class="two-columns">
            <label>
              Preco
              <input type="number" min="0" formControlName="price">
            </label>
            <label>
              Categoria
              <select formControlName="categoryId">
                <option value="">Selecione</option>
                <option *ngFor="let category of categories()" [value]="category.id">
                  {{ category.name }}
                </option>
              </select>
            </label>
          </div>

          <label>
            URL da imagem
            <input type="url" formControlName="image">
          </label>

          <label>
            Descricao
            <textarea formControlName="description" rows="5"></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="productForm.invalid">Salvar simulacao</button>
            <a routerLink="/produtos" class="secondary-button">Cancelar</a>
          </div>

          <p class="success-message" *ngIf="saved()">Operacao simulada com sucesso.</p>
        </form>
      </section>
    </main>
  `,
})
export class ProductFormPage implements OnInit, CanLeaveDirtyForm {
  private api = inject(PlatziApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private initialValue = '';

  protected readonly categories = signal<Category[]>([]);
  protected readonly isEdit = signal(false);
  protected readonly saved = signal(false);
  protected readonly productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(1)]],
    categoryId: ['', [Validators.required]],
    image: ['https://placehold.co/600x400', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit.set(!!id);
    this.api.getCategories().subscribe({ next: (categories) => this.categories.set(categories) });

    if (id) {
      this.api.getProduct(id).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            title: product.title,
            price: product.price,
            categoryId: String(product.category.id),
            image: product.images?.[0] ?? product.category.image,
            description: product.description,
          });
          this.markInitialValue();
        },
      });
      return;
    }

    this.markInitialValue();
  }

  hasUnsavedChanges(): boolean {
    return !this.saved() && JSON.stringify(this.productForm.getRawValue()) !== this.initialValue;
  }

  protected submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saved.set(true);
    this.router.navigateByUrl('/produtos');
  }

  private markInitialValue(): void {
    this.initialValue = JSON.stringify(this.productForm.getRawValue());
  }
}
