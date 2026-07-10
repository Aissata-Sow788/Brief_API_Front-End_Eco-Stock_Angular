import { Injectable } from "@angular/core";
import { Warehouse } from "../models/warehouse";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getWarehouse(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}/entrepot/`);
  }

  addEntrpot(entrepot: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.apiUrl}/entrepot/`, entrepot);
  }

  updateData(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/entrepot/${id}/`, data);
  }

  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/entrepot/${id}/`);
  }
}
