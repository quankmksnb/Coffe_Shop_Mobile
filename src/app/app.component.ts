import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CoffeeDetailComponent } from "./features/coffee-detail/coffee-detail.component";
import { CoffeeHomeComponent } from "./features/coffee-home/coffee-home.component";
import { CoffeeOrderComponent } from "./features/coffee-order/coffee-order.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, CoffeeHomeComponent, CoffeeDetailComponent, CoffeeOrderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Coffe_Shop';
}
