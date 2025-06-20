import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormatPipeTs',
  standalone: true
})
export class PriceFormatPipeTsPipe implements PipeTransform {
transform(price: number): string {
    if (price == null || isNaN(price)) return '';

    const rounded = Math.round(price * 100) / 100;
    const isInteger = Number.isInteger(rounded);
    
    return `$ ${isInteger ? rounded.toFixed(1) : rounded}`;
  }

}
