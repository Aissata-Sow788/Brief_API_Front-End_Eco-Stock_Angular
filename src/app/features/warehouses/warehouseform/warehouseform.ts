import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Warehouse } from '../../../core/models/warehouse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouseform',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouseform.html',
  styleUrl: './warehouseform.css',
})
export class Warehouseform implements OnInit {
  // Décorateur @Output permettant d'émettre des événements personnalisés afin de communiquer des données au composant parent
  @Output() produitAjoute = new EventEmitter<any>();

  // Propriété d'état interne servant à basculer dynamiquement la logique entre la création et la modification
  idEntrepot: number | null = null;   // null = mode création, sinon mode modification

  // Instanciation et configuration d'un formulaire réactif (Reactive Forms) avec des contrôles typés et leurs validateurs synchrone
  form = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    localisation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    capacite: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+$'), // Expression régulière restreignant le champ aux entiers positifs
      Validators.min(1)
    ])
  });

  // Injection des dépendances requises (services de persistance et services de routage d'Angular) via le constructeur
  constructor(
    private warehouseservice: WarehouseService,
    private router: Router, // Utilisé pour déclencher des navigations programmatiques explicites
    private route: ActivatedRoute // Permet de lire l'état et les paramètres de la route actuellement active
  ) {}

  // Hook de cycle de vie exécuté automatiquement par Angular après la phase d'initialisation du composant
  ngOnInit(): void {
    // Analyse et récupération du paramètre 'id' éventuellement présent dans le segment d'URL courant
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.idEntrepot = Number(idParam);

      // Souscription à l'Observable du service pour charger les données de l'entrepôt correspondant
      this.warehouseservice.getWarehouse().subscribe({
        next: (data) => {
          const entrepot = data.find(e => e.id === this.idEntrepot);
          if (entrepot) {
            // Remplissage partiel ou complet des contrôles du formulaire réactif avec les données récupérées
            this.form.patchValue({
              nom: entrepot.nom,
              localisation: entrepot.localisation,
              capacite: entrepot.capacite
            });
          }
        },
        error: (err) => console.error('Erreur chargement entrepôt', err)
      });
    }
  }

  // Gestionnaire de soumission déclenché lors de la validation du formulaire
  onAjout(): void {
    // Validation structurelle : si le formulaire ne satisfait pas les validateurs, on bloque le traitement
    if (this.form.invalid) {
      // Force le passage à l'état "touched" sur tous les champs pour faire apparaître visuellement les messages d'erreur
      this.form.markAllAsTouched();
      console.log('Le formulaire est invalide');
      return;
    }

    // Extraction sécurisée des valeurs actuelles contenues dans les contrôles du formulaire
    const nom = this.form.value.nom!;
    const localisation = this.form.value.localisation!;
    const capacite = Number(this.form.value.capacite);

    const donneesEntrepot: Partial<Warehouse> = { nom, localisation, capacite };

// Vérifie si un identifiant d'entrepôt est présent.
// Si oui, cela signifie que le formulaire est en mode modification.
if (this.idEntrepot) {

  // -------------------- MODE MODIFICATION --------------------
  // Appel du service HTTP permettant de mettre à jour
  // les informations de l'entrepôt existant dans la base de données.
  this.warehouseservice.updateData(this.idEntrepot, donneesEntrepot).subscribe({

    // Callback exécuté lorsque la mise à jour est effectuée avec succès
    next: (entrepotModifie) => {

      // Affichage d'une fenêtre de confirmation avec SweetAlert2
      Swal.fire({
        icon: 'success',                         // Icône de succès
        title: 'Modification effectuée',         // Titre de la fenêtre
        text: "L'entrepôt a été mis à jour avec succès.", // Message affiché
        background: '#212529',                   // Couleur de fond de la popup
        color: '#fff',                           // Couleur du texte
        confirmButtonColor: '#198754'            // Couleur du bouton de validation
      }).then(() => {

        // Une fois la popup fermée par l'utilisateur,
        // redirection vers la liste des entrepôts.
        this.router.navigate(['/entrepot']);

      });

    },

    // Callback exécuté lorsqu'une erreur survient lors de la requête HTTP
    error: (err) => {

      // Affiche l'erreur dans la console du navigateur pour faciliter le débogage
      console.error(err);

      // Affiche une popup indiquant que la modification a échoué
      Swal.fire({
        icon: 'error',                           // Icône d'erreur
        title: 'Erreur',                         // Titre de la popup
        text: "La modification de l'entrepôt a échoué.", // Message d'erreur
        background: '#212529',                   // Couleur de fond
        color: '#fff',                           // Couleur du texte
        confirmButtonColor: '#dc3545'            // Couleur du bouton
      });

    }

  });

} else {
      // --- MODE CRÉATION ---
      // Consommation du service HTTP pour insérer une nouvelle entrée
      this.warehouseservice.addEntrpot(donneesEntrepot as Warehouse).subscribe({
        next: (entrepotCree) => {
          // Émission de la donnée créée vers le composant parent via le canal @Output
          this.produitAjoute.emit(entrepotCree);
          // Redirection programmatique vers le listing principal des entrepôts
          this.router.navigate(['/entrepot']);
        },
        error: (err) => console.error('Erreur lors de la création', err)
      });
    }
  }

  // Procédure d'annulation pour réinitialiser les contrôles et quitter l'écran courant
  onAnnuler(): void {
    this.form.reset(); // Remet à zéro l'état de validation et vide les valeurs du formulaire réactif
    this.router.navigate(['/entrepot']); // Redirection de sécurité vers l'arborescence principale
  }
}
