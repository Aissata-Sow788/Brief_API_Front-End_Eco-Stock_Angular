import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './layout/sidebar/sidebar';
import { Navbar } from './layout/navbar/navbar';
import { Login } from './features/auth/login/login';
import { Warehouselist } from './features/warehouses/warehouselist/warehouselist';
import { Productlist } from './features/products/productlist/productlist';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Eco-Stock');
}
