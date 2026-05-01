export interface Dimension {
  key: string;
  name: string;
  values: string[];
}

export interface Sku {
  size: string;
  color: string;
  capacity: string;
  price: number;
  stock: number;
  [k: string]: string | number;
}

export interface DetailSection {
  title: string;
  paragraphs?: string[];
  image?: string;
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  poster?: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  images: string[];
  media?: MediaItem[];
  dimensions: Dimension[];
  skus: Sku[];
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
  detailSections: DetailSection[];
}

export type SkuSelection = Record<string, string>;

export interface CartItem {
  key: string;
  productId: number;
  skuKey: string;
  name: string;
  image: string;
  attrs: SkuSelection;
  price: number;
  stock: number;
  quantity: number;
}

export type CartItemInput = Omit<CartItem, 'key'>;
