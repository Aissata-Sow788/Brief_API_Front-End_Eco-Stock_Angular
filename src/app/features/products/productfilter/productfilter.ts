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
  imports: [RouterLink, Productform, CommonModule],
  templateUrl: './productfilter.html',
  styleUrl: './productfilter.css',
})
export class Productfilter implements OnInit {


  produit = signal<Product[]>([]);   // ← signal au lieu d'un tableau classique
  entrepots = signal<Warehouse[]>([])

    idProduit!: number;
  idEntrepot!: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProduits().subscribe({
      next: (data) => {
        this.produit.set(data.filter(p => p.warehouse === id));
      },
      error: (err) => {
        console.error('Erreur récupération produits', err);
      }
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

      // Optionnel : retourner à la liste des entrepôts en cas d'annulation
  onAnnuler(): void {
    this.router.navigate(['/entrepot']);
  }

  transfererProduit(idProduit: number): void {

  if (!this.idEntrepot) {
    alert("Veuillez sélectionner un entrepôt.");
    return;
  }

  this.productService.transferProduit(idProduit, this.idEntrepot)
    .subscribe({

      next: (produit) => {

        alert("Produit transféré avec succès.");

        // Retirer le produit de la liste actuelle
        this.produit.update(liste =>
          liste.filter(p => p.id !== produit.id)
        );

      },

      error: (err) => {

        alert(err.error?.error || "Erreur lors du transfert.");

      }

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






