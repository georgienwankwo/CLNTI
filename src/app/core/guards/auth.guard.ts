import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userLoggedIn = authService.isUserLoggedIn();

  return userLoggedIn.pipe(
    take(1),
    map((loggedIn) => {
      return loggedIn ? true : router.createUrlTree(['/auth/login']);
    }),
  );
};

export const redirectAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userLoggedIn = authService.isUserLoggedIn();

  return userLoggedIn.pipe(
    take(1),
    map((loggedIn) => {
      return loggedIn ? router.createUrlTree(['/']) : true;
    }),
  );
};
