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
  showModal = false;
  produit = signal<Product[]>([]);
  entrepots = signal<Warehouse[]>([]);

  items: any[] = [];

  constructor(
    private productService: ProductService,
    private warehouseService: WarehouseService
  ) {}

  ngOnInit(): void {
    this.productService.getProduits().subscribe({
      next: (data) => this.produit.set(data),
      error: (err) => console.error('Erreur récupération produits', err)
    });

    this.warehouseService.getWarehouse().subscribe({
      next: (data) => this.entrepots.set(data),
      error: (err) => console.error('Erreur récupération entrepôts', err)
    });
  }

  getNomEntrepot(id: number): string {
    const entrepot = this.entrepots().find(e => e.id === id);
    return entrepot ? entrepot.nom : 'Inconnu';
  }

  onAjoutProduit(produit: Product) {
    this.produit.update(liste => [...liste, produit]);
  }

      onUpdate(id: number, data: any) {
    this.productService.updateProduit(id, data).subscribe({
      next: (response) => {
        console.log('Donnée modifiée avec succès', response);
        // Mettre à jour la liste locale ici
      },
      error: (err) => console.error('Erreur lors de la modification', err)
    });
  }
  
onDelete(id: number): void {
  if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {

    // Assurez-vous que l'id est un nombre propre
    const cleanId = Number(id);

    this.productService.deleteData(cleanId).subscribe({
      next: () => {
        alert('Produit supprimé avec succès !');

        // Si vous utilisez un signal pour votre liste de produits :
        this.produit.update(liste => liste.filter(p => p.id !== cleanId));
      },
      error: (err) => {
        console.error('Erreur lors de la suppression', err);
      }
    });
  }
}
}
