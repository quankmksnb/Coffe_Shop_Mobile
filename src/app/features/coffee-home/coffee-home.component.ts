import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BottomNavigationComponent } from '../../shared/bottom-navigation/bottom-navigation.component';
import { HeaderComponent } from './header/header.component';
import CategoryModel from './models/category.model';
import CoffeeProductModel from './models/coffee-product.model';
import { CoffeeListService } from './service/coffee-list.service';
import { PriceFormatPipeTsPipe } from 'src/app/core/pipes/price-format.pipe.ts.pipe';

@Component({
  selector: 'app-coffee-home',
  standalone: true,
  imports: [
    BottomNavigationComponent,
    HeaderComponent, 
    RouterLink,
    CommonModule,
    PriceFormatPipeTsPipe,
  ],
  templateUrl: './coffee-home.component.html',
  styleUrl: './coffee-home.component.scss',
})
export class CoffeeHomeComponent {
  listCategories = signal<CategoryModel[]>([]);
  listProducts = signal<CoffeeProductModel[]>([]);
  filteredProducts = signal<CoffeeProductModel[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = signal<string>('');

  private readonly ingredientPrices: { [key: string]: number } = {
  ...Object.fromEntries(['coffee', 'base', 'espresso', 'expresso', 'americano', 'café'].map(item => [item, 2])),
  ...Object.fromEntries(['sirop', 'cacao'].map(item => [item, 1])),
  rum: 3,
};

  constructor(
    private readonly coffeeService: CoffeeListService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.getCoffeeProductsAPI();
  }
  onSearchChange(searchTerm: string): void {
    this.searchQuery.set(searchTerm);
    this.applyFilters();
  }
  /**
   * Load coffee products from API and convert to our model
   */

  private getCoffeeProductsAPI() {
    this.isLoading.set(true);

    this.coffeeService.getCoffeeProducts().subscribe({
      next: (data) => {
        this.isLoading.set(false);

        if (data && Array.isArray(data) && data.length > 0) {
          const listCoffeeProductsGetAPI = data.reduce(
            (prev: Array<CoffeeProductModel>, item: any) => {
              // validate img and id
              if (
                !item?.id ||
                isNaN(Number(item.id)) ||
                !item?.image ||
                item.image === 'none' ||
                item.image === 'null' ||
                item.image.trim() === ''
              ) {
                return prev;
              }

              // Xử lý ingredients
              if (typeof item.ingredients === 'string') {
                const ingredients = item.ingredients.split(',');
                item.ingredients = ingredients.map((ig: string) => ig.trim());
              }

              // Tính toán price 
              const calculatedPrice = this.calculatePriceFromIngredients(
                item.ingredients || []
              );

              const coffeeProduct: CoffeeProductModel = {
                id: item.id,
                name: item.title,
                description: item.description,
                price: calculatedPrice,
                rating: this.generateRandomRating(),
                imageUrl: item.image,
                category: 'all',
                ingredients: item.ingredients || [],
              };

              prev.push(coffeeProduct);
              return prev;
            },
            []
          );

          this.listProducts.set(listCoffeeProductsGetAPI);
          this.generateCategoriesFromIngredients(listCoffeeProductsGetAPI);
          this.filteredProducts.set(listCoffeeProductsGetAPI);
          console.log(
            'Coffee products with ingredients:',
            listCoffeeProductsGetAPI
          );
        } else {
          this.listProducts.set([]);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error fetching coffee products:', error);
        this.listProducts.set([]);
      },
    });
  }

  private generateRandomRating(): number {
    return Math.round((Math.random() * 1 + 4) * 10) / 10;
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

    this.filterProductsByCategory(selectedCategory.id);

    console.log('Selected category:', selectedCategory.id);
  }

  /**
   *
   * Tính giá tiền coffee theo công thức
   */
  private calculatePriceFromIngredients(ingredients: string[]): number {
    let totalPrice = 0;
    const processedIngredients = new Set<string>(); // Tránh tính trùng lặp

    ingredients.forEach((ingredient) => {
      const normalizedIngredient = ingredient.toLowerCase().trim();

      if (
        this.ingredientPrices[normalizedIngredient] &&
        !processedIngredients.has(normalizedIngredient)
      ) {
        totalPrice += this.ingredientPrices[normalizedIngredient];
        processedIngredients.add(normalizedIngredient);
        console.log(
          `Found exact match: ${normalizedIngredient} = $${this.ingredientPrices[normalizedIngredient]}`
        );
        return;
      }

      // Tìm kiếm theo từ khóa chứa trong tên thành phần
      let found = false;
      for (const [key, price] of Object.entries(this.ingredientPrices)) {
        if (
          normalizedIngredient.includes(key) &&
          !processedIngredients.has(key)
        ) {
          totalPrice += price;
          processedIngredients.add(key);
          console.log(
            `Found partial match: ${normalizedIngredient} contains ${key} = $${price}`
          );
          found = true;
          break;
        }
      }

      // Nếu không tìm thấy, coi như "other" = 0.5
      if (!found && !processedIngredients.has(normalizedIngredient)) {
        totalPrice += 0.5;
        processedIngredients.add(normalizedIngredient);
        console.log(`Unknown ingredient: ${normalizedIngredient} = $0.5`);
      }
    });
    return Math.round(totalPrice * 100) / 100;
  }

  /**
   * in hoa chữ đầu
   */
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * lấy ingredient của product để tạo thành category
   */
  private generateCategoriesFromIngredients(products: CoffeeProductModel[]) {
    const uniqueIngredientList = new Set<string>();
    // Lấy tất cả ingredients từ các products
    products.forEach((product) => {
      product.ingredients.forEach((ingredient) => {
        if (ingredient?.trim()) {
          uniqueIngredientList.add(ingredient.toLowerCase().trim());
        }
      });
    });

    // Tạo categories all
    const categories: CategoryModel[] = [
      { id: 'all', name: 'All Coffee', isActive: true },
    ];

    Array.from(uniqueIngredientList)
      .sort()
      .forEach((ingredient, index) => {
        categories.push({
          id: ingredient,
          name: this.capitalizeFirstLetter(ingredient),
          isActive: false,
        });
      });

    this.listCategories.set(categories);
    console.log('Generated categories from ingredients:', categories);
  }

  private filterProductsByCategory(categoryId: string): void {
    const allProducts = this.listProducts();

    if (categoryId === 'all') {
      // Hiển thị tất cả sản phẩm
      this.filteredProducts.set(allProducts);
    } else {
      // Lọc sản phẩm có ingredient trùng với category đã chọn
      const filtered = allProducts.filter((product) =>
        product.ingredients.some(
          (ingredient) =>
            ingredient.toLowerCase().trim() === categoryId.toLowerCase()
        )
      );
      this.filteredProducts.set(filtered);
    }

    console.log(
      `Filtered products for category "${categoryId}":`,
      this.filteredProducts()
    );
  }


   private applyFilters(): void {
    const allProducts = this.listProducts();
    const currentSearchQuery = this.searchQuery().toLowerCase().trim();
    const activeCategory = this.listCategories().find(cat => cat.isActive);
    
    let filtered = allProducts;

    // Áp dụng filter theo category
    if (activeCategory && activeCategory.id !== 'all') {
      filtered = filtered.filter((product) =>
        product.ingredients.some(
          (ingredient) =>
            ingredient.toLowerCase().trim() === activeCategory.id.toLowerCase()
        )
      );
    }

    // Áp dụng search filter
    if (currentSearchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(currentSearchQuery) ||
        product.description?.toLowerCase().includes(currentSearchQuery) ||
        product.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(currentSearchQuery)
        )
      );
    }

    this.filteredProducts.set(filtered);
    
    console.log(`Applied filters - Category: "${activeCategory?.id}", Search: "${currentSearchQuery}"`, filtered);
  }
}
