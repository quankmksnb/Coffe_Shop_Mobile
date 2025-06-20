import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import DiscountModel from './model/discount.model';

@Component({
  selector: 'app-discount-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discount-list.component.html',
  styleUrl: './discount-list.component.scss'
})
export class DiscountListComponent {
  @Output() discountSelected = new EventEmitter<number>();
   // Discount hiện tại được chọn
  selectedDiscount: DiscountModel | null = null;
  isDiscountListVisible: boolean = false;

  // Danh sách các discount có sẵn
  discountItems: DiscountModel[] = [
    {
      id: 1,
      title: '30% Off Delivery',
      description: 'Save 30% on delivery fee',
      discountPercent: 30,
      isSelected: false
    },
    {
      id: 2,
      title: '50% Off Delivery',
      description: 'Save 50% on delivery fee',
      discountPercent: 50,
      isSelected: false
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: '100% off delivery fee',
      discountPercent: 100,
      isSelected: false
    }
  ];


  toggleDiscountList(): void {
    this.isDiscountListVisible = !this.isDiscountListVisible;
  }


  selectDiscount(discount: DiscountModel): void {
    this.discountItems.forEach(item => item.isSelected = false);
    
    discount.isSelected = true;
    this.selectedDiscount = discount;
    
    this.discountSelected.emit(discount.discountPercent);
    
    this.isDiscountListVisible = false;
  }

  // hủy chọn discount
  removeDiscount(): void {
    if (this.selectedDiscount) {
      this.selectedDiscount.isSelected = false;
      this.selectedDiscount = null;

      this.discountSelected.emit(0);
    }
  }

  // Lấy text hiển thị cho discount đã chọn
  getDiscountText(): string {
    if (this.selectedDiscount) {
      return `1 Discount is Applied (${this.selectedDiscount.discountPercent}% Off)`;
    }
    return '1 Discount is Applied';
  }
}
