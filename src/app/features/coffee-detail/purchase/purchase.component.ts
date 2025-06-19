import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
})
export class PurchaseComponent {
  @Input() price: number = 0;
  @Input() selectedSize: string = 'S'; // Mặc định size M
  currentPrice: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    // Khi price hoặc selectedSize thay đổi, tính lại giá
    if (changes['price'] || changes['selectedSize']) {
      this.currentPrice = this.calculatePriceBySize();
      console.log(`Price updated: Size ${this.selectedSize} = ${this.currentPrice}`);
    }
  }

  // Method để tính giá theo size (sẽ implement sau)
  calculatePriceBySize(): number {
    let sizeMultiplier = 1;

    switch (this.selectedSize) {
      case 'M':
        sizeMultiplier = 1.25;
        break;
      case 'L':
        sizeMultiplier = 1.35; 
        break;
      default:
        sizeMultiplier = 1;
        break;
    }

    return Math.round(this.price * sizeMultiplier * 100) / 100;
  }

  getDisplayPrice(): number {
    return this.currentPrice;
  }
}
