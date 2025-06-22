import { Component, input } from '@angular/core';
import { TopNavigationComponent } from '../../shared/top-navigation/top-navigation.component';
import { DeliveryAddressComponent } from './components/delivery-address/delivery-address.component';
import { DiscountListComponent } from './components/discount-list/discount-list.component';
import { PriceFormatPipeTsPipe } from 'src/app/core/pipes/price-format.pipe.ts.pipe';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-coffee-order',
  standalone: true,
  imports: [
    TopNavigationComponent,
    DeliveryAddressComponent,
    DiscountListComponent,
    PriceFormatPipeTsPipe,
    CommonModule,
  ],
  templateUrl: './coffee-order.component.html',
  styleUrl: './coffee-order.component.scss',
})
export class CoffeeOrderComponent {
  id = input();
  priceDetail: number = 0;
  basePrice: number = 0;
  quantity: number = 1;
  originalDeliveryFee: number = 2.0;
  deliveryFee: number = 2.0;
  discountPercent: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      const priceParam = queryParams.get('priceDetail');
      
      if (priceParam) {
        this.priceDetail = parseFloat(priceParam);
        this.basePrice = this.priceDetail;
      } else {
        // Fallback: redirect về coffee-home nếu thiếu price
        this.router.navigate(['/coffee-home']);
      }
    });

    this.applyDiscount(this.discountPercent);
  }

  onDiscountSelected(discountPercent: number): void {
    this.discountPercent = discountPercent;
    this.applyDiscount(discountPercent);
  }

  private applyDiscount(discountPercent: number): void {
    if (discountPercent === 0) {
      this.deliveryFee = this.originalDeliveryFee;
    } else {
      this.deliveryFee = this.originalDeliveryFee * (1 - discountPercent / 100);
    }
  }

  // Tăng số lượng
  increaseQuantity(): void {
    this.quantity++;
    this.updateTotalPrice();
  }

  // Giảm số lượng (tối thiểu là 1)
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateTotalPrice();
    }
  }

  private updateTotalPrice(): void {
    this.priceDetail = this.basePrice * this.quantity;
  }

  getTotalAmount(): number {
    return this.priceDetail + this.deliveryFee;
  }
}
