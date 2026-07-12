import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Productform } from '../productform/productform';


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

  // Suppression physique d'un produit ciblé par son identifiant unique
  onDelete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {

      // Forçage du typage de la variable numérique pour parer aux anomalies de typage JS
      const cleanId = Number(id);

      // Traitement asynchrone de la suppression via l'Observable du service
      this.productService.deleteData(cleanId).subscribe({
        next: () => {
          alert('Produit supprimé avec succès !');

          // Mise à jour réactive du signal produit pour filtrer et exclure instantanément l'élément supprimé
          this.produit.update(liste => liste.filter(p => p.id !== cleanId));
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }
}
