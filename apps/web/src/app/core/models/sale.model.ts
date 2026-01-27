import { Product } from './product.model';

export interface SaleItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalCents: number;
  createdAt: Date;
  reference: string;
  confirmed: boolean;
}
