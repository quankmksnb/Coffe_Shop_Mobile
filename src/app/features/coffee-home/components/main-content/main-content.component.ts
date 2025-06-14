import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import CategoryModel from './models/category.model';
import CoffeeProductModel from './models/coffee-product.model';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  listCategories = signal<CategoryModel[]>([]);
  listProducts = signal<CoffeeProductModel[]>([]);

  ngOnInit() {
    this.listCategories.set([
      { id: 'all', name: 'All Coffee', isActive: true },
      { id: 'espresso', name: 'Espresso', isActive: false },
      { id: 'macchiato', name: 'Latte', isActive: false },
      { id: 'latte', name: 'Cappuccino', isActive: false },
      { id: 'americano', name: 'Americano', isActive: false },
      { id: 'espresso', name: 'Mocha', isActive: false },
    ]);
    this.listProducts.set([
      {
        id: '1',
        name: 'Caffe Mocha',
        description: 'Deep Foam',
        price: 4.53,
        rating: 4.8,
        imageUrl: 'assets/img/coffee/coffee1.jpg',
        category: 'mocha',
      },
      {
        id: '2',
        name: 'Flat White',
        description: 'Espresso',
        price: 3.53,
        rating: 4.8,
        imageUrl: 'assets/img/coffee/coffee2.jpg',
        category: 'espresso',
      },
      {
        id: '3',
        name: 'Mocha Fusi',
        description: 'Ice/Hot',
        price: 7.53,
        rating: 4.8,
        imageUrl: 'assets/img/coffee/coffee3.jpg',
        category: 'mocha',
      },
      {
        id: '4',
        name: 'Caffe Panna',
        description: 'Ice/Hot',
        price: 5.53,
        rating: 4.8,
        imageUrl: 'assets/img/coffee/coffee4.jpg',
        category: 'latte',
      }
    ]);
  }

  onCategoryClick(selectedCategory: CategoryModel): void {
    this.listCategories.update((categories) =>
      categories.map((category) => ({
        ...category,
        isActive: false,
      }))
    );

    this.listCategories.update((categories) =>
      categories.map((category) => ({
        ...category,
        isActive: category.id === selectedCategory.id,
      }))
    );

    console.log('Selected category:', selectedCategory.id);
  }
}
