import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Warehouse } from '../../../core/models/warehouse';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


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

// Méthode permettant de supprimer un produit à partir de son identifiant
onDelete(id: number) {

  // Affiche une boîte de dialogue de confirmation avant la suppression
  Swal.fire({
    title: 'Supprimer ce produit ?',
    text: 'Cette action est irréversible.',
    icon: 'warning',
    background: '#212529',
    color: '#fff',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {

    // Vérifie si l'utilisateur a confirmé la suppression
    if (result.isConfirmed) {

      // Appel du service HTTP pour supprimer le produit dans la base de données
      this.productservice.deleteData(id).subscribe({

        // Exécuté lorsque la suppression est effectuée avec succès
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'Le produit a été supprimé.',
            timer: 1500,
            showConfirmButton: false
          });

          // Met à jour le signal en retirant immédiatement le produit supprimé de la liste affichée
          this.produit.update(liste =>
            liste.filter(p => p.id !== id)
          );
        },

        // Gestion des erreurs renvoyées par l'API
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
        }

      });

    }

  });

}
    retour(): void {
    this.router.navigate(['/products']);
  }

}
