import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/ auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userservice = inject(UserService)
  const router = inject(Router)

  if (userservice.isLoggedIn()){
    return true
  } else {
    router.navigate(['/'])
    return false
  }
};
