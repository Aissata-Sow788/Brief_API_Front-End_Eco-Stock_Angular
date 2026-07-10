import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productform',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productform.html',
  styleUrl: './productform.css',
})
export class Productform implements OnInit {
  @Output() produitAjoute = new EventEmitter<any>();

  entrepots = signal<Warehouse[]>([]);
  isEditMode = false;
  idProduit!: number;

  // Déclaration du formulaire
  form = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    quantite: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(1)
    ]),
    etat: new FormControl<'disponible' | 'réservé' | 'périmé' | null>(
      null,
      Validators.required
    ),
    warehouse: new FormControl<number | null>(null, [Validators.required])
  });

  constructor(
    private produitservice: ProductService,
    private warehouseservice: WarehouseService,
    private router: Router,
    private route: ActivatedRoute // Ajouté pour récupérer l'ID de l'URL
  ) {}

  ngOnInit(): void {
    // 1. Charger d'abord la liste des entrepôts pour le select du HTML
    this.warehouseservice.getWarehouse().subscribe({
      next: (data) => {
        this.entrepots.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement entrepôts', err);
      }
    });

    // 2. Vérifier si on est en mode édition (si un ID est présent dans l'URL)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.idProduit = Number(idParam);

      // Charger les données du produit à modifier
      this.produitservice.getProduits().subscribe({
        next: (produits) => {
          const produitAModifier = produits.find(p => p.id === this.idProduit);
          if (produitAModifier) {
            // On remplit le formulaire avec les valeurs du PRODUIT
            this.form.patchValue({
              nom: produitAModifier.nom,
              quantite: produitAModifier.quantite,
              etat: produitAModifier.etat,
              warehouse: produitAModifier.warehouse
            });
          }
        },
        error: (err) => console.error('Erreur chargement du produit', err)
      });
    }
  }

  onAjouter(): void {
    console.log('Tentative de soumission !');

    if (this.form.valid) {
      const produitData: Partial<Product> = {
        nom: this.form.value.nom!,
        quantite: Number(this.form.value.quantite),
        etat: this.form.value.etat as 'disponible' | 'réservé' | 'périmé',
        warehouse: Number(this.form.value.warehouse),
        date_expiration: new Date().toISOString().split('T')[0]
      };

    if (this.isEditMode) {
      // --- MODE EDITION (Mise à jour) ---
      const produitComplet = { ...produitData, id: this.idProduit } as Product;

      // On appelle la fonction corrigée du service en lui passant l'ID et l'objet
      this.produitservice.updateProduit(this.idProduit, produitComplet).subscribe({
        next: () => {
          alert("Produit mis à jour avec succès !");
          this.router.navigate(['/products', produitData.warehouse]);
        },
        error: (err) => {
          console.error('Erreur modification produit', err);
        }
      });

    }else {
        // --- MODE CREATION (Ajout) ---
        this.produitservice.addProduit(produitData as Product).subscribe({
          next: (produitcreer) => {
            this.produitAjoute.emit(produitcreer);
            this.router.navigate(['/products', produitData.warehouse]);
          },
          error: (err) => console.error('Erreur création produit', err)
        });
      }
    } else {
      this.form.markAllAsTouched();
      console.log('Le formulaire est invalide');
    }
  }

  onAnnuler(): void {
    this.form.reset({ etat: 'disponible' });
    this.router.navigate(['/products']);
  }
}
