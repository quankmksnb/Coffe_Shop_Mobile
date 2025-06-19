import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/coffee-home/coffee-home.component').then(m => m.CoffeeHomeComponent)
    },
    {
        path: 'coffee-detail/:id',
        loadComponent: () => import('./features/coffee-detail/coffee-detail.component').then(m => m.CoffeeDetailComponent)
    },
    {
        path: 'coffee-order/:id',
        loadComponent: () => import('./features/coffee-order/coffee-order.component').then(m => m.CoffeeOrderComponent)
    }
];