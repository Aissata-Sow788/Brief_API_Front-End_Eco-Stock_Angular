import { Injectable } from "@angular/core";
import { Warehouse } from "../models/warehouse";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  // Rend le service disponible dans toute l'application
  providedIn: 'root'
})
export class WarehouseService {

  // URL de base de l'API Django
  private apiUrl = 'http://127.0.0.1:8000/api';

  // Injection du service HttpClient pour communiquer avec l'API
  constructor(private http: HttpClient) {}

  // Récupère la liste de tous les entrepôts
  getWarehouse(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}/entrepot/`);
  }

  // Envoie un nouvel entrepôt à l'API pour l'ajouter dans la base de données
  addEntrpot(entrepot: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.apiUrl}/entrepot/`, entrepot);
  }

  // Met à jour les informations d'un entrepôt à partir de son identifiant
  updateData(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/entrepot/${id}/`, data);
  }

  // Supprime un entrepôt grâce à son identifiant
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/entrepot/${id}/`);
  }
}
