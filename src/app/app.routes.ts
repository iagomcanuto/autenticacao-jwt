import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { unsavedChangesGuard } from './auth/unsaved-changes.guard';
import { CategoryFormPage } from './pages/category-form.page';
import { CategoryListPage } from './pages/category-list.page';
import { DeletePage } from './pages/delete.page';
import { LoginPage } from './pages/login.page';
import { ProductFormPage } from './pages/product-form.page';
import { ProductListPage } from './pages/product-list.page';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: 'produtos', component: ProductListPage },
      { path: 'produtos/novo', component: ProductFormPage, canDeactivate: [unsavedChangesGuard] },
      { path: 'produtos/:id/editar', component: ProductFormPage, canDeactivate: [unsavedChangesGuard] },
      { path: 'produtos/:id/excluir', component: DeletePage },
      { path: 'categorias', component: CategoryListPage },
      { path: 'categorias/novo', component: CategoryFormPage, canDeactivate: [unsavedChangesGuard] },
      { path: 'categorias/:id/editar', component: CategoryFormPage, canDeactivate: [unsavedChangesGuard] },
      { path: 'categorias/:id/excluir', component: DeletePage },
    ],
  },
  { path: '**', redirectTo: 'produtos' },
];
