// src/types/models/Product.ts

export interface ProductModel {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}
