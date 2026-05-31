import type { CartItem } from '../slices/cartSlice';
import type { Product } from '../slices/productsSlice';

export const CART_BACKUP_KEY = 'cart_backup';

export const getProductFromCartItem = (item: CartItem): Product =>
  typeof item.product === 'string' ? ({} as Product) : item.product;

export const calcCartSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, i) => {
    const p = getProductFromCartItem(i);
    return sum + (p.price || 0) * i.quantity;
  }, 0);

export const loadCartBackup = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_BACKUP_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveCartBackup = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_BACKUP_KEY, JSON.stringify(items));
  }
};
