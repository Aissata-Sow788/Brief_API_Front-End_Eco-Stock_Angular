import { Productform } from './features/products/productform/productform';
import { Routes } from '@angular/router';
import { Warehouselist } from './features/warehouses/warehouselist/warehouselist';
import { Login } from './features/auth/login/login';
import { MainLayout } from './layout/main-layout/main-layout';
import { Productlist } from './features/products/productlist/productlist';
import { Productdetail } from './features/products/productdetail/productdetail';
import { Productfilter } from './features/products/productfilter/productfilter';
import { authGuard } from './core/guards/auth-guard';
import { Warehouseform } from './features/warehouses/warehouseform/warehouseform';
import { Producttransfer } from './features/products/producttransfer/producttransfer';

export const routes: Routes = [
 {
    path: '',
    component: Login
  },

  {
    path: '',
    component: MainLayout,
    // canActivate: [authGuard],

    children: [

      {
        path: '',
        redirectTo: 'entrepot',
        pathMatch: 'full'
      },

      {
  path: 'produitform',
  component: Productform,
},

      {
        path: 'entrepot',
        component: Warehouselist,
        canActivate: [authGuard]
      },

      {
        path: 'products',
        component: Productlist,
        // canActivate: [authGuard]
      },

            {
        path: 'transfer/:id',
        component: Producttransfer,
        // canActivate: [authGuard]
      },


      {
  path: 'warehouseform/:id',
  component: Warehouseform,
},

      {
        path: 'produitform/:id',
        component: Productform,
        // canActivate: [authGuard]
      },
            {
        path: 'warehouseform',
        component: Warehouseform,
        // canActivate: [authGuard]
      },

      {
        path: 'products/:id',
        component: Productfilter,
        // canActivate: [authGuard]
      },

      {
        path: 'productdetail/:id',
        component: Productdetail,
        // canActivate: [authGuard]
      }

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];
