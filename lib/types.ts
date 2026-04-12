export interface ProductSpecs {
  socket?: string;
  cores?: number;
  [key: string]: string | number | undefined;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  specs?: ProductSpecs;
  category_id?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
