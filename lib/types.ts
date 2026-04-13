export interface ProductSpecs {
  socket?: string;
  cores?: number;
  type?: string; // RAM type (DDR4, DDR5, etc.)
  ram_type?: string; // Motherboard RAM type
  power_consumption?: number; // Power consumption in Watts (for CPU, GPU, etc.)
  max_power?: number; // Maximum power output in Watts (for PSU)
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
  slug?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
