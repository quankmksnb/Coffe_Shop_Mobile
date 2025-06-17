import { Component } from '@angular/core';
import { TopNavigationComponent } from "../../shared/top-navigation/top-navigation.component";
import { DeliveryAddressComponent } from "./components/delivery-address/delivery-address.component";
import { DiscountListComponent } from "./components/discount-list/discount-list.component";

@Component({
  selector: 'app-coffee-order',
  standalone: true,
  imports: [TopNavigationComponent, DeliveryAddressComponent, DiscountListComponent],
  templateUrl: './coffee-order.component.html',
  styleUrl: './coffee-order.component.scss'
})
export class CoffeeOrderComponent {

}
