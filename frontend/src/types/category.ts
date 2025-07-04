import { PaginationState } from './pagination';

export interface Category {
  id: number;
  name: string;
  product_count?: number;
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

export interface CreateCategoryData {
  name: string;
}
