import { Component } from '@angular/core';
import { ProductDetailComponent } from "./components/product-detail/product-detail.component";
import { PurchaseComponent } from "./components/purchase/purchase.component";

@Component({
  selector: 'app-coffee-detail',
  standalone: true,
  imports: [ProductDetailComponent, PurchaseComponent],
  templateUrl: './coffee-detail.component.html',
  styleUrl: './coffee-detail.component.scss'
})
export class CoffeeDetailComponent {

}
