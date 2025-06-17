import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import CategoryModel from './models/category.model';
import CoffeeProductModel from './models/coffee-product.model';
import { CoffeeListService } from './service/coffee-list.service';
import { Router } from '@angular/router';

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
  filteredProducts = signal<CoffeeProductModel[]>([]);
  isLoading = signal<boolean>(false);
  private readonly ingredientPrices: { [key: string]: number } = {
    coffee: 2,
    base: 2,
    espresso: 2,
    expresso: 2,
    americano: 2,
    café: 2,
    sirop: 1,
    cacao: 1,
    rum: 3,
  };

  constructor(
    private readonly coffeeService: CoffeeListService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.getCoffeeProductsAPI();
  }
  // đẩy giá lên state
  navigateToProductDetail(productId: number): void {
    const product = this.listProducts().find(p => p.id === productId);
    this.router.navigate(['/coffee-detail', productId], {
      state: { calculatedPrice: product?.price, productData: product },
    });
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
          const filteredData = data.filter((item: any) => {
            const isNumericId =
              !isNaN(Number(item.id)) &&
              item.id !== null &&
              item.id !== undefined;
            const hasValidImage =
              item.image &&
              item.image !== 'none' &&
              item.image.trim() !== '' &&
              item.image !== 'null';

            return isNumericId && hasValidImage;
          });

          const listCoffeeProductsGetAPI = filteredData.map((item: any) => {
            const ingredients = this.processIngredients(item.ingredients);
            const calculatedPrice =
              this.calculatePriceFromIngredients(ingredients);

            return {
              id: item.id,
              name: item.title,
              description: item.description,
              price: calculatedPrice,
              rating: this.generateRandomRating(),
              imageUrl: item.image,
              category: 'all',
              ingredients: ingredients,
            };
          });

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

  /**
   * Xử lý ingredients từ API data
   */
  private processIngredients(ingredientsData: any): string[] {
    if (!ingredientsData) return [];

    // Nếu là array
    if (Array.isArray(ingredientsData)) {
      return ingredientsData.filter((item) => item && typeof item === 'string');
    }

    // Nếu là string JSON
    if (typeof ingredientsData === 'string') {
      try {
        const parsed = JSON.parse(ingredientsData);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && typeof item === 'string');
        }
        // Nếu là string có dấu phẩy
        return ingredientsData
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      } catch {
        // Nếu parse failed, coi như string thông thường
        return ingredientsData
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item);
      }
    }

    return [];
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

    // Làm tròn đến 2 chữ số thập phân
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
}
