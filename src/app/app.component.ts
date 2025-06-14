import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoffeeDetailComponent } from "./features/coffee-detail/coffee-detail.component";
import { CoffeeHomeComponent } from "./features/coffee-home/coffee-home.component";
import { BottomNavigationComponent } from "./shared/bottom-navigation/bottom-navigation.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavigationComponent, CoffeeHomeComponent, CoffeeDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Coffe_Shop';
}
