import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producttransfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producttransfer.html',
  styleUrl: './producttransfer.css',
})
export class Producttransfer implements OnInit {
  // Signaux réactifs (Signals) pour stocker l'état des données et optimiser la détection des changements
  moveProduit = signal<Product | null>(null); // Stocke l'entité du produit à transférer
  entrepots = signal<Warehouse[]>([]); // Stocke la liste de tous les entrepôts disponibles

  // Propriétés du composant servant à stocker les identifiants techniques
  idProduit!: number;
  idEntrepot!: number; // Cette propriété sera liée bidirectionnellement (Two-Way Binding) dans le formulaire

  // Injection des dépendances Angular (services de données et utilitaires de navigation) via le constructeur
  constructor(
    private produitservice: ProductService,
    private warehouseservice: WarehouseService,
    private router: Router, // Service de routage pour gérer les redirections
    private route: ActivatedRoute // Fournit l'accès instantané aux paramètres de la route active
  ) {}

  // Hook du cycle de vie exécuté automatiquement par Angular après l'initialisation du composant
  ngOnInit(): void {
    // Extraction du paramètre 'id' depuis la configuration de la route active et conversion en nombre
    this.idProduit = Number(this.route.snapshot.paramMap.get('id'));

    // Consommation asynchrone (Observable) du service pour récupérer les détails du produit ciblé
    this.produitservice.getProduit(this.idProduit).subscribe({
      next: (data: Product) => {
        this.moveProduit.set(data); // Remplacement de la valeur du signal moveProduit
      },
      error: (err) => {
        console.error('Erreur chargement produit', err);
      }
    });

    // Consommation asynchrone (Observable) du service pour récupérer la liste globale des entrepôts
    this.warehouseservice.getWarehouse().subscribe({
      next: (data: Warehouse[]) => {
        this.entrepots.set(data); // Remplacement de la valeur du signal entrepots
      },
      error: (err) => {
        console.error('Erreur chargement entrepôts', err);
      }
    });
  }

  // Méthode permettant de retrouver dynamiquement le libellé d'un entrepôt à partir de son ID
  getNomEntrepot(id: number): string {
    // Lecture de la valeur actuelle du signal entrepots() pour effectuer la recherche
    const entrepot = this.entrepots().find(e => e.id === id);
    return entrepot ? entrepot.nom : '';
  }

  // Méthode de traitement de transfert appelée lors de l'action utilisateur
  transfererProduit(): void {
    // Validation basique : s'assure qu'un entrepôt de destination a été choisi (liaison ngModel)
    if (!this.idEntrepot) {
      alert("Veuillez sélectionner un entrepôt.");
      return;
    }

    // Exécution de la requête HTTP de transfert via la souscription à l'Observable du service
    this.produitservice
      .transferProduit(this.idProduit, this.idEntrepot)
      .subscribe({
        next: (produit) => {
          alert('Transfert effectué avec succès.');
          // Redirection de l'utilisateur vers la vue des produits de l'entrepôt de destination
          this.router.navigate(['/products', this.idEntrepot]);
        },
        error: (err) => {
          // Gestion et extraction du message d'erreur provenant de la réponse du serveur API
          const messageErreur = err.error?.warehouse?.[0]
            ?? err.error?.error
            ?? 'Erreur lors du transfert.';
          alert(messageErreur);
        }
      });
  }

  // Méthode de navigation explicite pour retourner à l'affichage précédent
  retour(): void {
    this.router.navigate(['/products']);
  }
}
