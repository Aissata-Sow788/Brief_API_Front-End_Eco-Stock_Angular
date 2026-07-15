import { Component, OnInit, signal } from '@angular/core';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Warehouse } from '../../../core/models/warehouse';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


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
// Méthode permettant de modifier un entrepôt existant
onUpdate(id: number, data: any): void {

  // Appel du service HTTP pour mettre à jour l'entrepôt identifié par son id
  this.warehouseService.updateData(id, data).subscribe({

    // Callback exécuté si la modification est effectuée avec succès
    next: () => {

      // Affiche une popup de confirmation avec SweetAlert2
      Swal.fire({
        icon: 'success',                     // Icône de succès
        title: 'Modification effectuée',     // Titre de la popup
        text: "L'entrepôt a été mis à jour avec succès.", // Message affiché
        background: '#212529',               // Couleur de fond de la popup
        color: '#fff',                       // Couleur du texte
        confirmButtonColor: '#198754'        // Couleur du bouton de validation
      }).then(() => {

        // Une fois la popup fermée, redirection vers la liste des entrepôts
        this.router.navigate(['/entrepot']);

      });

    },

    // Callback exécuté si une erreur survient lors de la requête HTTP
    error: (err) => {

      // Affiche l'erreur dans la console du navigateur
      console.error(err);

      // Affiche une popup indiquant que la modification a échoué
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "La modification de l'entrepôt a échoué.",
        background: '#212529',
        color: '#fff',
        confirmButtonColor: '#dc3545'
      });

    }

  });

}


// Méthode permettant de supprimer un entrepôt
onDelete(id: number) {

  // Affiche une boîte de dialogue de confirmation avant la suppression
  Swal.fire({
    title: 'Supprimer cet entrepôt ?',       // Titre de confirmation
    text: 'Cette action est irréversible.',  // Message d'avertissement
    icon: 'warning',                         // Icône d'avertissement
    background: '#212529',                   // Couleur de fond
    color: '#fff',                           // Couleur du texte
    showCancelButton: true,                  // Affiche le bouton Annuler
    confirmButtonColor: '#dc3545',           // Couleur du bouton Supprimer
    cancelButtonColor: '#6c757d',            // Couleur du bouton Annuler
    confirmButtonText: 'Supprimer',          // Texte du bouton de confirmation
    cancelButtonText: 'Annuler'              // Texte du bouton Annuler
  }).then((result) => {

    // Vérifie si l'utilisateur a confirmé la suppression
    if (result.isConfirmed) {

      // Appel du service HTTP pour supprimer l'entrepôt
      this.warehouseService.deleteData(id).subscribe({

        // Callback exécuté lorsque la suppression est terminée
        next: () => {

          // Affiche une popup indiquant que la suppression a réussi
          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: "L'entrepôt a été supprimé avec succès.",
            background: '#212529',
            color: '#fff',
            confirmButtonColor: '#198754',
            timer: 1500,              // Fermeture automatique après 1,5 seconde
            showConfirmButton: false  // Masque le bouton OK
          });

          // Met à jour le signal Angular en retirant immédiatement
          // l'entrepôt supprimé de la liste affichée
          this.warehouse.update(liste =>
            liste.filter(e => e.id !== id)
          );

        },

        // Callback exécuté en cas d'erreur lors de la suppression
        error: (err) => {

          console.error(err);

          // Affiche une popup signalant l'échec de la suppression
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Impossible de supprimer l'entrepôt.",
            background: '#212529',
            color: '#fff',
            confirmButtonColor: '#dc3545'
          });

        }

      });

    }

  });

}
}
