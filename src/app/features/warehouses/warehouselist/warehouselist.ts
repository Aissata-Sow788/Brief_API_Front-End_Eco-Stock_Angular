import { Component, OnInit, signal } from '@angular/core';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Warehouse } from '../../../core/models/warehouse';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-warehouselist',
  imports: [RouterLink, CommonModule],
  templateUrl: './warehouselist.html',
  styleUrl: './warehouselist.css', 
})
export class Warehouselist implements OnInit {
  // Signal réactif contenant le tableau des entrepôts pour une mise à jour fluide de l'interface
  warehouse = signal<Warehouse[]>([]);


  // Injection des dépendances (services de données et de navigation) via le constructeur
  constructor(private warehouseService: WarehouseService,
       private router: Router, // Service de routage pour naviguer programmatiquement
       private route: ActivatedRoute, // Fournit l'accès aux paramètres de l'URL courante
  ) {}

  // Hook de cycle de vie s'exécutant automatiquement à l'initialisation du composant
  ngOnInit(): void {

    // Extraction et conversion en nombre d'un éventuel identifiant 'id' présent dans l'URL
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Souscription à l'Observable pour récupérer de manière asynchrone la liste des entrepôts
    this.warehouseService.getWarehouse().subscribe({
      next: (data) => {
        // Alimentation réactive du signal avec les données reçues du serveur
        this.warehouse.set(data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération', err);
      }
    });


  }

  // Traitement asynchrone pour modifier les données d'un entrepôt existant
  onUpdate(id: number, data: any) {
    this.warehouseService.updateData(id, data).subscribe({
      next: (response) => {
        console.log('Donnée modifiée avec succès', response);
        // Emplacement idéal pour faire un .update() sur le signal 'warehouse' afin de synchroniser l'affichage local
      },
      error: (err) => console.error('Erreur lors de la modification', err)
    });
  }

  // Suppression physique d'un entrepôt ciblé par son identifiant unique
  onDelete(id: number): void {

    // Boîte de dialogue de confirmation avant le traitement de suppression
    if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {

      // Appel de la méthode de suppression du service HTTP
      this.warehouseService.deleteData(id).subscribe({

        next: () => {

          // Mise à jour réactive et immuable du signal pour exclure l'entrepôt supprimé instantanément du DOM
          this.warehouse.update(liste =>
            liste.filter(entrepot => entrepot.id !== id)
          );

          console.log('Entrepôt supprimé');

        },

        error: (err) => {
          console.error('Erreur lors de la suppression', err);
        }

      });

    }

  }
}
