import { UserService } from '../../../core/services/ auth.service';
import { User } from './../../../core/models/user';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  submitting = false;
  loginError = '';
  showPassword = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      Validators.pattern(/^[a-zA-Z0-9._-]+$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(20),
    ])
  });

  onSubmit(): void {
    this.loginError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.submitting) {
      return; // évite les doubles soumissions
    }

    const username = this.form.value.username!.trim();
    const password = this.form.value.password!;

    this.submitting = true;

    this.userService.login({ username, password }).subscribe({
      next: (response) => {
        this.submitting = false;
        this.router.navigate(['/entrepot']);
      },

      error: (error) => {
        this.submitting = false;

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

  // Getters pratiques pour le template
  get username() { return this.form.get('username'); }
  get password() { return this.form.get('password'); }
}
