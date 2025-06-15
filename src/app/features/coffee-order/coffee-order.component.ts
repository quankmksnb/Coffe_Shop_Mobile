import { Component } from '@angular/core';
import { TopNavigationComponent } from "../../shared/top-navigation/top-navigation.component";

@Component({
  selector: 'app-coffee-order',
  standalone: true,
  imports: [TopNavigationComponent],
  templateUrl: './coffee-order.component.html',
  styleUrl: './coffee-order.component.scss'
})
export class CoffeeOrderComponent {

}
