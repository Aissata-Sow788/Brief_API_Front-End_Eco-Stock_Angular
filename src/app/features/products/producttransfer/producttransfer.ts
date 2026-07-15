import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product';
import { Warehouse } from '../../../core/models/warehouse';
import { ProductService } from '../../../core/services/product.service';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
// Méthode appelée lorsqu'un utilisateur lance le transfert d'un produit
transfererProduit(): void {

  // Vérifie qu'un entrepôt de destination a bien été sélectionné
  if (!this.idEntrepot) {

    // Affiche une fenêtre d'avertissement si aucun entrepôt n'est choisi
    Swal.fire({
      icon: 'warning',                      // Icône d'avertissement
      title: 'Entrepôt non sélectionné',    // Titre de la popup
      text: 'Veuillez sélectionner un entrepôt.', // Message affiché
      background: '#212529',                // Couleur de fond
      color: '#fff',                        // Couleur du texte
      confirmButtonColor: '#0d6efd'         // Couleur du bouton de confirmation
    });

    // Interrompt l'exécution de la méthode
    return;
  }

  // Appel du service HTTP chargé d'effectuer le transfert du produit
  this.produitservice
    .transferProduit(this.idProduit, this.idEntrepot)
    .subscribe({

      // Callback exécuté si le transfert est réalisé avec succès
      next: () => {

        // Affiche une popup de confirmation
        Swal.fire({
          icon: 'success',
          title: 'Transfert effectué',
          text: 'Le produit a été transféré avec succès.',
          background: '#212529',
          color: '#fff',
          confirmButtonColor: '#198754'            
        }).then(() => {

          // Après la fermeture de la popup,
          // redirige l'utilisateur vers la liste des produits
          // du nouvel entrepôt de destination.
          this.router.navigate(['/products', this.idEntrepot]);

        });

      },

      // Callback exécuté si une erreur survient lors du transfert
      error: (err) => {

        // Récupère le message d'erreur renvoyé par l'API.
        // Si aucun message spécifique n'est disponible,
        // un message générique est utilisé.
        const messageErreur =
          err.error?.warehouse?.[0] ??
          err.error?.error ??
          'Erreur lors du transfert.';

        // Affiche une popup signalant l'échec du transfert
        Swal.fire({
          icon: 'error',
          title: 'Transfert impossible',
          text: messageErreur,
          background: '#212529',
          color: '#fff',
          confirmButtonColor: '#dc3545'
        });

      }

    });
}  // Méthode de navigation explicite pour retourner à l'affichage précédent
  retour(): void {
    this.router.navigate(['/products']);
  }
}
