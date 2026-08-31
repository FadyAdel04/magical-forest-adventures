import { useSyncExternalStore, useCallback } from "react";
import {
  getStoreSnapshot,
  subscribe,
  type StoreSnapshot,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartItemCount,
  getCartTotal
} from "@/lib/store";

export type StoreState = StoreSnapshot & {
  addToCart: typeof addToCart;
  removeFromCart: typeof removeFromCart;
  updateCartQuantity: typeof updateCartQuantity;
  clearCart: typeof clearCart;
  getCartItemCount: typeof getCartItemCount;
  getCartTotal: typeof getCartTotal;
};

export function useStore(): StoreState {
  const snapshot = useSyncExternalStore(subscribe, getStoreSnapshot, getStoreSnapshot);

  // Use useCallback to ensure stable function references
  const boundAddToCart = useCallback(addToCart, []);
  const boundRemoveFromCart = useCallback(removeFromCart, []);
  const boundUpdateCartQuantity = useCallback(updateCartQuantity, []);
  const boundClearCart = useCallback(clearCart, []);
  const boundGetCartItemCount = useCallback(getCartItemCount, []);
  const boundGetCartTotal = useCallback(getCartTotal, []);

  return {
    ...snapshot,
    addToCart: boundAddToCart,
    removeFromCart: boundRemoveFromCart,
    updateCartQuantity: boundUpdateCartQuantity,
    clearCart: boundClearCart,
    getCartItemCount: boundGetCartItemCount,
    getCartTotal: boundGetCartTotal,
  };
}
