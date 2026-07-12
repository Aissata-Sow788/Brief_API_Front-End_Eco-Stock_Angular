import { UserService } from '../../../core/services/ auth.service';
import { User } from './../../../core/models/user';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  // Nom du composant utilisé dans les templates HTML
  selector: 'app-login',

  // Modules utilisés par ce composant
  imports: [ReactiveFormsModule],

  // Fichier HTML associé au composant
  templateUrl: './login.html',

  // Fichier CSS associé au composant
  styleUrl: './login.css',
})
export class Login {

  // Indique si une requête de connexion est en cours
  submitting = false;

  // Contient le message d'erreur affiché à l'utilisateur
  loginError = '';

  // Permet d'afficher ou masquer le mot de passe
  showPassword = false;

  // Injection des services nécessaires
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  // Déclaration du formulaire réactif
  form = new FormGroup({

    // Champ nom d'utilisateur avec ses validations
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9._-]+$/)
    ]),

    // Champ mot de passe avec ses validations
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ])
  });

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(): void {

    // Réinitialise le message d'erreur
    this.loginError = '';

    // Vérifie que le formulaire est valide
    if (this.form.invalid) {

      // Affiche les erreurs de validation sur tous les champs
      this.form.markAllAsTouched();
      return;
    }

    // Empêche plusieurs clics sur le bouton de connexion
    if (this.submitting) {
      return;
    }

    // Récupère les valeurs saisies
    const username = this.form.value.username!.trim();
    const password = this.form.value.password!;

    // Active l'état de chargement
    this.submitting = true;

    // Appelle le service de connexion
    this.userService.login({ username, password }).subscribe({

      // Exécuté si la connexion réussit
      next: (response) => {

        // Désactive le chargement
        this.submitting = false;

        // Redirige l'utilisateur vers la liste des entrepôts
        this.router.navigate(['/entrepot']);
      },

      // Exécuté si une erreur survient
      error: (error) => {

        // Désactive le chargement
        this.submitting = false;

        // Gestion des différents types d'erreurs
        if (error.status === 401 || error.status === 400) {
          this.loginError = 'Identifiants incorrects.';
        } else if (error.status === 0) {
          this.loginError = 'Impossible de contacter le serveur.';
        } else {
          this.loginError = 'Une erreur est survenue. Réessayez.';
        }
      }
    });
  }

  // Getter permettant d'accéder facilement au champ username dans le template HTML
  get username() {
    return this.form.get('username');
  }

  // Getter permettant d'accéder facilement au champ password dans le template HTML
  get password() {
    return this.form.get('password');
  }
}
