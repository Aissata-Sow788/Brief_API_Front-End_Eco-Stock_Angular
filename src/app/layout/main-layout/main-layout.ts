import { Productlist } from './../../features/products/productlist/productlist';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { Warehouselist } from "../../features/warehouses/warehouselist/warehouselist";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar, Warehouselist, Productlist],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
