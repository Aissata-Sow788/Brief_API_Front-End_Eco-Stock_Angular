import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product } from './../models/product';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api';   // ← retire le slash final

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/produits/`);
  }

  getProduit(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/produits/${id}/`);
  }

  addProduit(produit: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/produits/`, produit);
  }
  transferProduit(id: number, warehouse: number): Observable<Product> {
    return this.http.post<Product>(
      `${this.apiUrl}/produits/${id}/move/`,
      { warehouse: warehouse }
    );
  }

  // À remplacer dans product.service.ts
updateProduit(id: number, produit: Product): Observable<Product> {
  // Correction de 'products' en 'produits' + ajout du slash final
  return this.http.put<Product>(`${this.apiUrl}/produits/${id}/`, produit);
}
  // updateData(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/products/${id}/`, data);
  // }

  // deleteData(id: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}/products/${id}/`);
  // }

  deleteData(id: number): Observable<any> {
  // Correction de 'products' en 'produits' + nettoyage du slash final
  return this.http.delete(`${this.apiUrl}/produits/${id}/`);
}

}
