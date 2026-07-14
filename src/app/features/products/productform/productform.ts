import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { Router, ActivatedRoute } from '@angular/router';
import { validate } from '@angular/forms/signals';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Métadonnées du composant Angular décoré par @Component
@Component({
  selector: 'app-productform', // Nom de la balise HTML personnalisée générée pour ce composant
  standalone: true, // Indique que le composant gère lui-même ses dépendances sans NgModule
  imports: [ReactiveFormsModule, CommonModule], // Modules importés et accessibles dans le template HTML
  templateUrl: './productform.html', // Chemin d'accès au fichier de template HTML
  styleUrl: './productform.css', // Chemin d'accès au fichier de styles CSS
})
export class Productform implements OnInit {
  // Décorateur @Output permettant d'émettre des événements personnalisés vers le composant parent
  @Output() produitAjoute = new EventEmitter<any>();

  // Signal réactif contenant le tableau des entrepôts pour la synchronisation du template
  entrepots = signal<Warehouse[]>([]);

  // Variables d'état interne pour basculer entre la création et la modification
  isEditMode = false;
  idProduit!: number;
  today = new Date().toISOString().split('T')[0];

  // Initialisation d'un formulaire réactif (Reactive Forms) avec des contrôles typés et validateurs
  form = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantite: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+$'), // Expression régulière limitant la saisie aux entiers positifs
      Validators.min(1)
    ]),
    date_expiration: new FormControl('', [
  Validators.required

]),
    etat: new FormControl<'disponible' | 'réservé' | 'périmé' | null>(
      null,
      Validators.required
    ),
    warehouse: new FormControl<number | null>(null, [Validators.required])
  });

  // Injection des dépendances requises (services de données et services de routage) via le constructeur
  constructor(
    private produitservice: ProductService,
    private warehouseservice: WarehouseService,
    private router: Router,
    private route: ActivatedRoute // Fournit l'accès instantané aux informations de la route active
  ) {}

  // Hook du cycle de vie exécuté une fois le composant instancié et les entrées initialisées
  ngOnInit(): void {
    // 1. Récupération asynchrone de la liste des entrepôts via le service et assignation au signal
    this.warehouseservice.getWarehouse().subscribe({
      next: (data) => {
        this.entrepots.set(data); // Remplacement de la valeur du signal
      },
      error: (err) => {
        console.error('Erreur chargement entrepôts', err);
      }
    });

    // 2. Analyse du paramètre d'URL 'id' pour basculer en mode édition si celui-ci est détecté
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.idProduit = Number(idParam);

      // Chargement de l'ensemble des produits pour extraire l'entité correspondante
      this.produitservice.getProduits().subscribe({
        next: (produits) => {
          const produitAModifier = produits.find(p => p.id === this.idProduit);
          if (produitAModifier) {
            // Remplissage partiel ou total du formulaire Angular avec les valeurs de l'objet trouvé
              this.form.patchValue({
                nom: produitAModifier.nom,
                quantite: produitAModifier.quantite,
                date_expiration: produitAModifier.date_expiration.split('T')[0],
                etat: produitAModifier.etat,
                warehouse: produitAModifier.warehouse
              });
          }
        },
        error: (err) => console.error('Erreur chargement du produit', err)
      });
    }
  }

  // Traitement exécuté lors du déclenchement de la soumission du formulaire
  onAjouter(): void {
    console.log('Tentative de soumission !');

    // Vérification de la conformité du formulaire vis-à-vis des critères des Validators définis
    if (this.form.valid) {
      // Extraction et formatage sécurisé des données du formulaire réactif
      const produitData: Partial<Product> = {
        nom: this.form.value.nom!,
        quantite: Number(this.form.value.quantite),
        etat: this.form.value.etat as 'disponible' | 'réservé' | 'périmé',
        warehouse: Number(this.form.value.warehouse),
       date_expiration: this.form.value.date_expiration!
      };

    if (this.isEditMode) {
      // --- MODE EDITION (Mise à jour) ---
      const produitComplet = { ...produitData, id: this.idProduit } as Product;

      // Consommation du service HTTP pour sauvegarder les modifications
      this.produitservice.updateProduit(this.idProduit, produitComplet).subscribe({
        next: () => {
          alert("Produit mis à jour avec succès !");
          // Redirection dynamique basée sur la valeur saisie dans le contrôle 'products'
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erreur modification produit', err);
        }
      });

    }else {
        // --- MODE CREATION (Ajout) ---
        // Consommation du service HTTP pour enregistrer une nouvelle entité
        this.produitservice.addProduit(produitData as Product).subscribe({
          next: (produitcreer) => {
            // Déclenchement de l'événement Output pour notifier le composant parent
            this.produitAjoute.emit(produitcreer);
            // Redirection vers l'espace de gestion de l'entrepôt concerné
            this.router.navigate(['/products']);
          },
          error: (err) => console.error('Erreur création produit', err)
        });
      }
    } else {
      // Force l'activation visuelle des erreurs de validation sur l'ensemble des champs si invalide
      this.form.markAllAsTouched();
      console.log('Le formulaire est invalide');
    }
  }

  // Réinitialisation de l'état du formulaire et retour à la racine des produits
  onAnnuler(): void {
    this.form.reset({ etat: 'disponible' }); // Réinitialise en appliquant une valeur par défaut
    this.router.navigate(['/products']);
  }
}
