import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window.token';

export const LOCAL_STORAGE = new InjectionToken<Storage | null>(
  'LOCAL_STORAGE',
  {
    providedIn: 'root',
    factory: () => (inject(WINDOW).localStorage ? localStorage : null),
  }
);
