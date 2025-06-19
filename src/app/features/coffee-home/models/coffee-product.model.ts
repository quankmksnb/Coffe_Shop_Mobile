export default interface CoffeeProductModel {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
  category?: string;
  ingredients: string[];
}