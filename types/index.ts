export interface CartItem {
  id: string | number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  discountPrice: number | null;
  sku?: string;
}

export interface CartStoreStateType {
  cart: CartItem[];
  hasHydrated: boolean;
}