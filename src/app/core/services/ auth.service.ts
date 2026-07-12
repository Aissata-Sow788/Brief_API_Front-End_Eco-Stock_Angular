import { User } from "../models/user";
import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
  // Rend le service accessible dans toute l'application
  providedIn: 'root'
})
export class UserService {

  // Injection du service HttpClient pour communiquer avec l'API
  private http = inject(HttpClient);

  // URL de base de l'API Django
  private apiUrl = 'http://127.0.0.1:8000/api';

  // Envoie les identifiants de connexion à l'API
  login(credentials: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/token/`, credentials).pipe(

      // Exécute une action après la réponse de l'API
      tap((response: any) => {

        // Si la connexion est réussie et qu'un token est reçu
        if (response.access) {

          // Enregistre le token d'accès dans le Local Storage
          localStorage.setItem('auth_token', response.access);

          // Enregistre le token de rafraîchissement
          localStorage.setItem('refresh_token', response.refresh);
        }
      })
    );
  }

  // Déconnecte l'utilisateur en supprimant le token
  logout() {
    localStorage.removeItem('auth_token');
  }

  // Vérifie si l'utilisateur est connecté
  // Retourne true si un token existe, sinon false
  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }

}
