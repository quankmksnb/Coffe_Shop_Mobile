import { Component } from '@angular/core';
import { TopNavigationComponent } from "../../../../shared/top-navigation/top-navigation.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [TopNavigationComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  product =  {
    id: 1,
    imgHref: 'assets/img/coffee/oder-coffee.jpg',
    name: 'Caffe Mocha',
    description: 'A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk the fo...',
  }
}
