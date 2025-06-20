import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopNavigationComponent } from 'src/app/shared/top-navigation/top-navigation.component';
import CoffeeProductModel from '../coffee-home/models/coffee-product.model';
import { CoffeeDetailService } from './service/product-detail.service';
import { PurchaseComponent } from './purchase/purchase.component';

@Component({
  selector: 'app-coffee-detail',
  standalone: true,
  imports: [TopNavigationComponent, CommonModule, PurchaseComponent],
  templateUrl: './coffee-detail.component.html',
  styleUrl: './coffee-detail.component.scss',
})
export class CoffeeDetailComponent {
  // Only productDetail uses signal
  productDetail = signal<CoffeeProductModel | undefined>(undefined);

  // Rest remain as regular properties
  isDescriptionExpanded = false;
  calculatedPrice: number = 0;
  ratingProduct: number = 0;
  id: number = -1;
  selectedSize: string = 'S';

  constructor(
    private readonly coffeeDetailService: CoffeeDetailService
  ) {
    console.log('Constructor called');
  }

  ngOnInit(): void {
    const state = window.history.state;
    if (state) {
      this.calculatedPrice = state['calculatedPrice'] ?? 0;
      this.ratingProduct = state['rating'] ?? 0;
      this.id = state['id'] ?? 0;
      this.getProductDetail(this.id);
      console.log(
        'giá là: ',
        this.calculatedPrice,
        'rating: ',
        this.ratingProduct
      );
    }
  }

  getProductDetail(id: number): void {
    this.coffeeDetailService.getCoffeeProductById(id).subscribe({
      next: (data) => {
        console.log('Raw API data:', data);
        if (data) {
          const mappedProduct = this.mapApiDataToModel(data);
          this.productDetail.set(mappedProduct);
          // No need for change detection - signals handle this automatically
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

  get shouldShowReadMore(): boolean {
    const product = this.productDetail();
    if (!product?.description) return false;
    // tạo 1 thẻ ảo để đo nếu description dài hơn 3 dòng
    const element = document.createElement('div');
    element.style.cssText = `
    font-size: 14px;
    line-height: 1.5;
    max-width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    visibility: hidden;
    position: absolute;
  `;
    element.textContent = product.description;
    document.body.appendChild(element);
    const isTruncated = element.scrollHeight > element.clientHeight;
    document.body.removeChild(element);
    return isTruncated;
  }

  onSizeChange(size: string): void {
    this.selectedSize = size;
    console.log('Size changed to:', size);
  }
}
