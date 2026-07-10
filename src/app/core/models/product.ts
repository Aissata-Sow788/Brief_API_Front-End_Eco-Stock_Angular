export interface Product {
  id: number;
  nom: string;
  quantite: number;
  date_expiration: string;
  etat: 'disponible' | 'réservé' | 'périmé';
  warehouse: number;
}
