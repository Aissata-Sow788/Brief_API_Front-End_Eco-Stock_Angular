// Importe le type HttpInterceptorFn qui permet de créer un intercepteur HTTP fonctionnel
import { HttpInterceptorFn } from '@angular/common/http';

// Création de l'intercepteur d'authentification
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Récupère le token d'authentification stocké dans le Local Storage
  const token = localStorage.getItem('auth_token');

  // Vérifie si un token existe
  if (token) {

    // Clone la requête HTTP afin de ne pas modifier la requête originale
    const clonedRequest = req.clone({

      // Ajoute l'en-tête Authorization contenant le token JWT
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Envoie la requête clonée avec le token au serveur
    return next(clonedRequest);
  }

  // Si aucun token n'est trouvé, la requête est envoyée sans modification
  return next(req);
};
