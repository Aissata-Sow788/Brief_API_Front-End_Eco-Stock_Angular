import { User } from "../models/user";
import { Injectable, inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable ({
  providedIn: 'root'
})

export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api'


login(credentials: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/token/`, credentials).pipe(
    tap((response: any) => {
      if (response.access) {
        localStorage.setItem('auth_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }
    })
  );
}

  logout(){
    localStorage.removeItem('auth_token');
  }


  isLoggedIn(){
    return !!localStorage.getItem('auth_token');
  }

}
