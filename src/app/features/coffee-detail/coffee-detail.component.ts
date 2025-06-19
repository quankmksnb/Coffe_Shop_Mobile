import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopNavigationComponent } from 'src/app/shared/top-navigation/top-navigation.component';
import CoffeeProductModel from '../coffee-home/models/coffee-product.model';
import { CoffeeDetailService } from './service/product-detail.service';
import { PurchaseComponent } from "./purchase/purchase.component";

@Component({
  selector: 'app-coffee-detail',
  standalone: true,
  imports: [TopNavigationComponent, CommonModule, PurchaseComponent],
  templateUrl: './coffee-detail.component.html',
  styleUrl: './coffee-detail.component.scss'
})
export class CoffeeDetailComponent {
productDetail: CoffeeProductModel | undefined;
  // xử lý read more
  isDescriptionExpanded = false;
  maxDescriptionLines = 3;
  calculatedPrice: number = 0;
  ratingProduct: number = 0;
  selectedSize: string = 'S';

  constructor(
    private readonly coffeeDetailService: CoffeeDetailService,
    private readonly cdr: ChangeDetectorRef,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    console.log('Constructor called');
    // const state = this.router.getCurrentNavigation()?.extras.state;
    // if (state) {
    //   this.calculatedPrice = state['calculatedPrice'] ?? 0;
    //   this.ratingProduct = state['rating'] ?? 0;
    //   );
    // }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const productId = Number(params['id']);
      if (productId && productId > 0) {
        this.getProductDetail(productId);
      }
    });
    const state = window.history.state;
    if (state) {
      this.calculatedPrice = state['calculatedPrice'] ?? 0;
      this.ratingProduct = state['rating'] ?? 0;
      console.log(
        'giá là: ',
        this.calculatedPrice,
        'Rating: ',
        this.ratingProduct
      );
    }
  }

  getProductDetail(id: number): void {
    this.coffeeDetailService.getCoffeeProductById(id).subscribe({
      next: (data) => {
        console.log('Raw API data:', data);
        if (data) {
          this.productDetail = this.mapApiDataToModel(data);
          // Force change detection
          this.cdr.detectChanges();
        } else {
          console.error('Product not found!');
        }
      },
      error: (err) => {
        console.error('Error fetching product:', err);
      },
    });
  }

  private mapApiDataToModel(apiData: any): CoffeeProductModel {
    const mapped = {
      id: apiData.id,
      name: apiData.title,
      description: apiData.description,
      price: this.calculatedPrice,
      rating: this.ratingProduct,
      imageUrl: apiData.image,
      category: 'Hot/Coffee',
      ingredients: apiData.ingredients,
    };
    console.log('Mapping result:', mapped);
    return mapped;
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
  shouldShowReadMore(): boolean {
    if (!this.productDetail?.description) return false;

    const estimatedCharsPerLine = 40;
    const maxChars = this.maxDescriptionLines * estimatedCharsPerLine;

    return this.productDetail.description.length > maxChars;
  }

  getDisplayDescription(): string {
    if (!this.productDetail?.description) return '';

    if (this.isDescriptionExpanded || !this.shouldShowReadMore()) {
      return this.productDetail.description;
    }

    const estimatedCharsPerLine = 40;
    const maxChars = this.maxDescriptionLines * estimatedCharsPerLine;

    return this.productDetail.description.substring(0, maxChars) + '...';
  }

  onSizeChange(size: string): void {
    this.selectedSize = size;
    console.log('Size changed to:', size);
  }
}
