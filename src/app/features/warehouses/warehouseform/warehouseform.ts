import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WarehouseService } from '../../../core/services/warehouse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Warehouse } from '../../../core/models/warehouse';

@Component({
  selector: 'app-warehouseform',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouseform.html',
  styleUrl: './warehouseform.css',
})
export class Warehouseform implements OnInit {
  @Output() produitAjoute = new EventEmitter<any>();

  idEntrepot: number | null = null;   // null = mode création, sinon mode modification

  form = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
    localisation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    capacite: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(1)
    ])
  });

  constructor(
    private warehouseservice: WarehouseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.idEntrepot = Number(idParam);

      // Charge les données existantes et pré-remplit le formulaire
      this.warehouseservice.getWarehouse().subscribe({
        next: (data) => {
          const entrepot = data.find(e => e.id === this.idEntrepot);
          if (entrepot) {
            this.form.patchValue({
              nom: entrepot.nom,
              localisation: entrepot.localisation,
              capacite: entrepot.capacite
            });
          }
        },
        error: (err) => console.error('Erreur chargement entrepôt', err)
      });
    }
  }

  onAjout(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Le formulaire est invalide');
      return;
    }

    const nom = this.form.value.nom!;
    const localisation = this.form.value.localisation!;
    const capacite = Number(this.form.value.capacite);

    const donneesEntrepot: Partial<Warehouse> = { nom, localisation, capacite };

    if (this.idEntrepot) {
      // Mode modification
      this.warehouseservice.updateData(this.idEntrepot, donneesEntrepot).subscribe({
        next: (entrepotModifie) => {
          this.produitAjoute.emit(entrepotModifie);
          this.router.navigate(['/entrepot']);
        },
        error: (err) => console.error('Erreur lors de la modification', err)
      });
    } else {
      // Mode création
      this.warehouseservice.addEntrpot(donneesEntrepot as Warehouse).subscribe({
        next: (entrepotCree) => {
          this.produitAjoute.emit(entrepotCree);
          this.router.navigate(['/entrepot']);
        },
        error: (err) => console.error('Erreur lors de la création', err)
      });
    }
  }

  onAnnuler(): void {
    this.form.reset();
    this.router.navigate(['/entrepot']);
  }
}
