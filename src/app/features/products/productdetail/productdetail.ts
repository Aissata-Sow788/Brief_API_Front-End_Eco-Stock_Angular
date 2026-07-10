import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../../core/services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Warehouse } from '../../../core/models/warehouse';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productdetail',
  imports: [CommonModule, RouterLink],
  templateUrl: './productdetail.html',
  styleUrl: './productdetail.css',
})
export class Productdetail implements OnInit{
 produit = signal<Product[]>([]);
  produitdetail = signal<Product | null>(null);   // un seul produit, pas un tableau
    entrepots = signal<Warehouse[]>([])

        idProduit!: number;
  idEntrepot!: number;


  constructor(private productservice: ProductService,
    private routes: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ){}

  ngOnInit(): void {
    const id = Number(this.routes.snapshot.paramMap.get('id'));

    this.productservice.getProduit(id).subscribe({
      next: (data: Product) => {
        this.produitdetail.set(data)
        console.log(data);
      }, error: (err) => {
      console.error(err);
    }
    })
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

  this.productservice.transferProduit(idProduit, this.idEntrepot)
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

    this.productservice.deleteData(cleanId).subscribe({
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
