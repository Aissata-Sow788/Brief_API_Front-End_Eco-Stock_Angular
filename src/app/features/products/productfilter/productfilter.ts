import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Productform } from '../productform/productform';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Warehouse } from '../../../core/models/warehouse';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Producttransfer } from '../producttransfer/producttransfer';


@Component({
  selector: 'app-productfilter',
  imports: [RouterLink, Productform, CommonModule], // Dépendances locales nécessaires au template
  templateUrl: './productfilter.html',
  styleUrl: './productfilter.css', 
})
export class Productfilter implements OnInit {

  // Signaux réactifs pour stocker l'état des données (optimise la détection des changements)
  produit = signal<Product[]>([]);   // Stocke la liste filtrée des produits
  entrepots = signal<Warehouse[]>([]); // Stocke la liste globale des entrepôts récupérés

  // Propriétés utilitaires pour suivre les identifiants en cours de manipulation
  idProduit!: number;
  idEntrepot!: number;

  // Injection des services nécessaires via le constructeur
  constructor(
    private productService: ProductService, // Service de gestion des requêtes HTTP des produits
    private route: ActivatedRoute,         // Permet d'accéder aux paramètres de l'URL active
    private router: Router,                // Service de navigation pour rediriger l'utilisateur
    private warehouseService: WarehouseService, // Service de gestion des requêtes HTTP des entrepôts
  ) {}

  // Hook de cycle de vie exécuté automatiquement à l'initialisation du composant
  ngOnInit(): void {
    // Récupération et conversion en nombre du paramètre 'id' de l'entrepôt depuis l'URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Consommation du service pour récupérer tous les produits
    this.productService.getProduits().subscribe({
      next: (data) => {
        // Filtrage des produits appartenant à l'entrepôt ciblé et mise à jour du signal
        this.produit.set(data.filter(p => p.warehouse === id));
      },
      error: (err) => {
        console.error('Erreur récupération produits', err);
      }
    });

    // Consommation du service pour récupérer la liste complète des entrepôts
    this.warehouseService.getWarehouse().subscribe({
      next: (data) => this.entrepots.set(data), // Mise à jour du signal des entrepôts
      error: (err) => console.error('Erreur récupération entrepôts', err)
    });
  }

  // Méthode synchrone pour retrouver le nom d'un entrepôt à partir de son identifiant
  getNomEntrepot(id: number): string {
    const entrepot = this.entrepots().find(e => e.id === id);
    return entrepot ? entrepot.nom : 'Inconnu';
  }

  // Redirection explicite vers la route de gestion ou de listing des entrepôts
  onAnnuler(): void {
    this.router.navigate(['/entrepot']);
  }

  // Procédure de transfert d'un produit spécifique vers un autre entrepôt sélectionné
  transfererProduit(idProduit: number): void {
    // Validation préalable : vérifie qu'un entrepôt de destination a bien été ciblé
    if (!this.idEntrepot) {
      alert("Veuillez sélectionner un entrepôt.");
      return;
    }

    // Appel de la méthode de transfert du service HTTP
    this.productService.transferProduit(idProduit, this.idEntrepot)
      .subscribe({
        next: (produit) => {
          alert("Produit transféré avec succès.");

          // Met à jour le signal de manière réactive en retirant le produit qui vient de quitter l'entrepôt actuel
          this.produit.update(liste =>
            liste.filter(p => p.id !== produit.id)
          );
        },
        error: (err) => {
          // Affiche l'erreur retournée par le serveur ou un message générique par défaut
          alert(err.error?.error || "Erreur lors du transfert.");
        }
      });
  }

  // Procédure de suppression définitive d'un produit
  onDelete(id: number): void {
    // Demande de confirmation à l'utilisateur avant exécution
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {

      // Sécurisation du type de la variable ID en forçant la conversion numérique
      const cleanId = Number(id);

      // Appel de la méthode de suppression du service HTTP
      this.productService.deleteData(cleanId).subscribe({
        next: () => {
          alert('Produit supprimé avec succès !');

          // Met à jour le signal de manière réactive pour exclure instantanément le produit supprimé de l'interface
          this.produit.update(liste => liste.filter(p => p.id !== cleanId));
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }
      });
    }
  }

}
