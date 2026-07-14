
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/ auth.service';


// Création d'un Guard appelé authGuard qui contrôle l'accès aux routes protégées
export const authGuard: CanActivateFn = (route, state) => {

  // Injection du UserService pour accéder à la méthode isLoggedIn()
  const userService = inject(UserService);

  // Injection du Router pour pouvoir rediriger l'utilisateur si nécessaire
  const router = inject(Router);


  // Vérifie si l'utilisateur est connecté grâce à la méthode isLoggedIn()
  if (userService.isLoggedIn()) {

    // Si l'utilisateur est connecté, autorise l'accès à la page demandée
    return true;

  } else {

    // Si l'utilisateur n'est pas connecté, redirige vers la page d'accueil ou de connexion
    router.navigate(['/']);

    // Bloque l'accès à la route protégée
    return false;
  }
};
