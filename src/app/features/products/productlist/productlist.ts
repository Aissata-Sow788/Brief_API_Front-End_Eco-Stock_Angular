import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Productform } from '../productform/productform';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [CommonModule, RouterLink, Productform],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css',
})
export class Productlist implements OnInit {
  // Propriété d'état interne contrôlant la visibilité d'une fenêtre modale
  showModal = false;

  // Signaux Angular réactifs pour stocker et suivre dynamiquement les variations de données
  produit = signal<Product[]>([]); // Signal contenant la liste complète des produits
  entrepots = signal<Warehouse[]>([]); // Signal contenant la liste des entrepôts de stockage

  // Tableau classique destiné à d'autres structures ou itérations génériques
  items: any[] = [];

  // Injection des services de données via le constructeur pour la communication HTTP
  constructor(
    private productService: ProductService,
    private warehouseService: WarehouseService
  ) {}

  // Hook de cycle de vie initialisant le composant après la création de ses propriétés
  ngOnInit(): void {
    // Souscription au flux asynchrone (Observable) pour récupérer les produits depuis le serveur
    this.productService.getProduits().subscribe({
      next: (data) => this.produit.set(data), // Alimentation réactive du signal produit
      error: (err) => console.error('Erreur récupération produits', err)
    });

    // Souscription au flux asynchrone (Observable) pour charger l'intégralité des entrepôts
    this.warehouseService.getWarehouse().subscribe({
      next: (data) => this.entrepots.set(data), // Alimentation réactive du signal entrepots
      error: (err) => console.error('Erreur récupération entrepôts', err)
    });
  }

  // Méthode permettant de résoudre le libellé d'un entrepôt à partir de sa clé primaire
  getNomEntrepot(id: number): string {
    const entrepot = this.entrepots().find(e => e.id === id); // Lecture de la valeur du signal entrepots
    return entrepot ? entrepot.nom : 'Inconnu';
  }

  // Gestionnaire d'événement interceptant l'ajout d'un produit (généralement via un Output d'un composant enfant)
  onAjoutProduit(produit: Product) {
    // Ajout asynchrone et immuable dans le signal pour notifier l'interface d'un changement
    this.produit.update(liste => [...liste, produit]);
  }

  // Déclenchement de la mise à jour d'une entité produit sur le backend
  onUpdate(id: number, data: any) {
    this.productService.updateProduit(id, data).subscribe({
      next: (response) => {
        console.log('Donnée modifiée avec succès', response);
        // Emplacement recommandé pour exécuter un update() sur le signal produit
      },
      error: (err) => console.error('Erreur lors de la modification', err)
    });
  }


 // Méthode permettant de supprimer un produit
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

    // Vérifie que l'utilisateur a confirmé la suppression
    if (result.isConfirmed) {

      // Appel du service HTTP pour supprimer le produit de la base de données
      this.productService.deleteData(id).subscribe({

        // Exécuté lorsque la suppression est réalisée avec succès
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'Le produit a été supprimé.',
            timer: 1500,
            showConfirmButton: false
          });

          // Met à jour le signal afin de retirer immédiatement le produit de la liste affichée
          this.produit.update(liste =>
            liste.filter(p => p.id !== id)
          );

        },

        // Gestion des erreurs retournées par l'API
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
        }

      });

    }

  });

}
}
