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
  moveProduit = signal<Product | null>(null);
  entrepots = signal<Warehouse[]>([]);

  idProduit!: number;
  idEntrepot!: number;

  constructor(
    private produitservice: ProductService,
    private warehouseservice: WarehouseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.idProduit = Number(this.route.snapshot.paramMap.get('id'));

    this.produitservice.getProduit(this.idProduit).subscribe({
      next: (data: Product) => {
        this.moveProduit.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement produit', err);
      }
    });

    this.warehouseservice.getWarehouse().subscribe({
      next: (data: Warehouse[]) => {
        this.entrepots.set(data);
      },
      error: (err) => {
        console.error('Erreur chargement entrepôts', err);
      }
    });
  }

  getNomEntrepot(id: number): string {
    const entrepot = this.entrepots().find(e => e.id === id);
    return entrepot ? entrepot.nom : '';
  }


transfererProduit(): void {
  if (!this.idEntrepot) {
    alert("Veuillez sélectionner un entrepôt.");
    return;
  }

  this.produitservice
    .transferProduit(this.idProduit, this.idEntrepot)
    .subscribe({
      next: (produit) => {
        alert('Transfert effectué avec succès.');
        this.router.navigate(['/products', this.idEntrepot]);
      },
      error: (err) => {
        const messageErreur = err.error?.warehouse?.[0]
          ?? err.error?.error
          ?? 'Erreur lors du transfert.';
        alert(messageErreur);
      }
    });
}

  retour(): void {
    this.router.navigate(['/products', this.idProduit]);
  }
}
