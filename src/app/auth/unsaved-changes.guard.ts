import { CanDeactivateFn } from '@angular/router';

export interface CanLeaveDirtyForm {
  hasUnsavedChanges: () => boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanLeaveDirtyForm> = (component) => {
  if (!component.hasUnsavedChanges()) {
    return true;
  }

  return confirm('Existem alteracoes nao salvas. Deseja sair mesmo assim?');
};
