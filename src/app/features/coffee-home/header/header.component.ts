import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Output() searchChange = new EventEmitter<string>(); // Thêm Output event
  searchQuery: string = ''; // Thêm property để bind với input

  // Thêm method để xử lý search
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchChange.emit(this.searchQuery);
  }

  // Method để clear search
  clearSearch(): void {
    this.searchQuery = '';
    this.searchChange.emit(this.searchQuery);
  }
}
