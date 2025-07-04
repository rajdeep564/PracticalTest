import { PaginationState } from './pagination';

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  colors: string[];
  tags: string[];
  category_name?: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

export interface CreateProductData {
  category_id: number;
  name: string;
  price: number;
  colors: string[];
  tags: string[];
}
