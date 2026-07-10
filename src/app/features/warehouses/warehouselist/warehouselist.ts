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
  warehouse = signal<Warehouse[]>([]);
  

  constructor(private warehouseService: WarehouseService,
       private router: Router,
       private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.warehouseService.getWarehouse().subscribe({
      next: (data) => {
        this.warehouse.set(data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération', err);
      }
    });


  }

    onUpdate(id: number, data: any) {
    this.warehouseService.updateData(id, data).subscribe({
      next: (response) => {
        console.log('Donnée modifiée avec succès', response);
        // Mettre à jour la liste locale ici
      },
      error: (err) => console.error('Erreur lors de la modification', err)
    });
  }

onDelete(id: number): void {

  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {

    this.warehouseService.deleteData(id).subscribe({

      next: () => {

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
