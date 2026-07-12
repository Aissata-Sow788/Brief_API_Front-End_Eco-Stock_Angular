import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from './../models/product';
import { Injectable } from "@angular/core";


@Injectable({
  // Rend le service disponible dans toute l'application
  providedIn: 'root'
})
export class ProductService {

  // URL de base de l'API Django
  private apiUrl = 'http://127.0.0.1:8000/api';

  // Injection du service HttpClient pour effectuer les requêtes HTTP
  constructor(private http: HttpClient) {}

  // Récupère la liste de tous les produits
  getProduits(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produits/`);
  }

  // Récupère un produit spécifique grâce à son identifiant
  getProduit(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/produits/${id}/`);
  }

  // Ajoute un nouveau produit dans la base de données
  addProduit(produit: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/produits/`, produit);
  }

  // Transfère un produit vers un autre entrepôt
  transferProduit(id: number, warehouse: number): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/produits/${id}/move/`,
      { warehouse: warehouse }
    );
  }

  // Met à jour les informations d'un produit existant
  updateProduit(id: number, produit: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/produits/${id}/`, produit);
  }

  // Supprime un produit à partir de son identifiant
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produits/${id}/`);
  }

}


