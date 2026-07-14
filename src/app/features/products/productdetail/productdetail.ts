import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Warehouse } from '../../../core/models/warehouse';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { CommonModule } from '@angular/common';

@Component({
  // Nom du composant utilisé dans les templates HTML
  selector: 'app-productdetail',

  // Modules importés et utilisés dans le template
  imports: [CommonModule, RouterLink],

  // Fichier HTML associé au composant
  templateUrl: './productdetail.html',

  // Fichier CSS associé au composant
  styleUrl: './productdetail.css',
})
export class Productdetail implements OnInit {

  // Signal contenant la liste des produits
  produit = signal<Product[]>([]);

  // Signal contenant le produit sélectionné
  produitdetail = signal<Product | null>(null);

  // Signal contenant la liste des entrepôts
  entrepots = signal<Warehouse[]>([]);

  // Identifiant du produit
  idProduit!: number;

  // Identifiant de l'entrepôt sélectionné
  idEntrepot!: number;

  // Injection des services nécessaires
  constructor(
    private productservice: ProductService,
    private routes: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) {}

  // Méthode exécutée automatiquement au chargement du composant
  ngOnInit(): void {

    // Récupère l'identifiant du produit dans l'URL
    const id = Number(this.routes.snapshot.paramMap.get('id'));

    // Récupère les informations du produit correspondant
    this.productservice.getProduit(id).subscribe({

      // Si la récupération réussit
      next: (data: Product) => {

        // Stocke le produit dans le signal
        this.produitdetail.set(data);

        console.log(data);
      },

      // Gestion des erreurs
      error: (err) => {
        console.error(err);
      }
    });

    // Récupère la liste des entrepôts
    this.warehouseService.getWarehouse().subscribe({

      // Met à jour le signal contenant les entrepôts
      next: (data) => this.entrepots.set(data),

      // Gestion des erreurs
      error: (err) => console.error('Erreur récupération entrepôts', err)
    });
  }

  // Retourne le nom de l'entrepôt à partir de son identifiant
  getNomEntrepot(id: number): string {

    // Recherche l'entrepôt correspondant
    const entrepot = this.entrepots().find(e => e.id === id);

    // Retourne son nom ou "Inconnu" s'il n'existe pas
    return entrepot ? entrepot.nom : 'Inconnu';
  }

  // Redirige l'utilisateur vers la liste des entrepôts
  onAnnuler(): void {
    this.router.navigate(['/entrepot']);
  }

  // Transfère un produit vers un autre entrepôt
  transfererProduit(idProduit: number): void {

    // Vérifie qu'un entrepôt a été sélectionné
    if (!this.idEntrepot) {
      alert("Veuillez sélectionner un entrepôt.");
      return;
    }

    // Appelle le service pour effectuer le transfert
    this.productservice.transferProduit(idProduit, this.idEntrepot)
      .subscribe({

        // Si le transfert réussit
        next: (produit) => {

          alert("Produit transféré avec succès.");

          // Retire le produit de la liste affichée
          this.produit.update(liste =>
            liste.filter(p => p.id !== produit.id)
          );
        },

        // Gestion des erreurs
        error: (err) => {
          alert(err.error?.error || "Erreur lors du transfert.");
        }

      });
  }

 // Suppression physique d'un produit ciblé par son identifiant unique
  onDelete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {

      // Forçage du typage de la variable numérique pour parer aux anomalies de typage JS
      const cleanId = Number(id);

      // Traitement asynchrone de la suppression via l'Observable du service
      this.productservice.deleteData(cleanId).subscribe({
        next: () => {
          alert('Produit supprimé avec succès !');

          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

    retour(): void {
    this.router.navigate(['/products']);
  }

}
