import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CanLeaveDirtyForm } from '../auth/unsaved-changes.guard';
import { PlatziApiService } from '../services/platzi-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="container page-content">
      <a routerLink="/categorias" class="back-link">Voltar para categorias</a>

      <section class="form-shell narrow-form">
        <div>
          <span class="section-label">Categoria</span>
          <h1>{{ isEdit() ? 'Editar categoria' : 'Nova categoria' }}</h1>
          <p class="muted">Formulario de prototipagem com protecao contra saida sem salvar.</p>
        </div>

        <form [formGroup]="categoryForm" (ngSubmit)="submit()" class="record-form">
          <label>
            Nome
            <input type="text" formControlName="name">
          </label>

          <label>
            URL da imagem
            <input type="url" formControlName="image">
          </label>

          <div class="form-actions">
            <button type="submit" [disabled]="categoryForm.invalid">Salvar simulacao</button>
            <a routerLink="/categorias" class="secondary-button">Cancelar</a>
          </div>

          <p class="success-message" *ngIf="saved()">Operacao simulada com sucesso.</p>
        </form>
      </section>
    </main>
  `,
})
export class CategoryFormPage implements OnInit, CanLeaveDirtyForm {
  private api = inject(PlatziApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private initialValue = '';

  protected readonly isEdit = signal(false);
  protected readonly saved = signal(false);
  protected readonly categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    image: ['https://placehold.co/600x400', [Validators.required]],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit.set(!!id);

    if (id) {
      this.api.getCategory(id).subscribe({
        next: (category) => {
          this.categoryForm.patchValue({
            name: category.name,
            image: category.image,
          });
          this.markInitialValue();
        },
      });
      return;
    }

    this.markInitialValue();
  }

  hasUnsavedChanges(): boolean {
    return !this.saved() && JSON.stringify(this.categoryForm.getRawValue()) !== this.initialValue;
  }

  protected submit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.saved.set(true);
    this.router.navigateByUrl('/categorias');
  }

  private markInitialValue(): void {
    this.initialValue = JSON.stringify(this.categoryForm.getRawValue());
  }
}
