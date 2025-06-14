import { Component } from '@angular/core';
import { BottomNavigationComponent } from "../../shared/bottom-navigation/bottom-navigation.component";
import { HeaderComponent } from "./components/header/header.component";
import { MainContentComponent } from "./components/main-content/main-content.component";

@Component({
  selector: 'app-coffee-home',
  standalone: true,
  imports: [BottomNavigationComponent, HeaderComponent, MainContentComponent],
  templateUrl: './coffee-home.component.html',
  styleUrl: './coffee-home.component.scss'
})
export class CoffeeHomeComponent {

}
