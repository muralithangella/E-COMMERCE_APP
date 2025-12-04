import { useGetCartQuery, useAddToCartMutation, useUpdateCartItemMutation, useRemoveFromCartMutation, useClearCartMutation } from '../services/cartApi';
import { useToast } from './useToast';

export const useCart = () => {
  const { data: cart, isLoading, error, refetch } = useGetCartQuery();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const { showToast } = useToast();

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart({ productId, quantity }).unwrap();
      showToast('Added to cart!', 'success');
    } catch (error) {
      showToast('Failed to add to cart', 'error');
    }
  };

  const handleUpdateItem = async (itemId, quantity) => {
    try {
      await updateItem({ itemId, quantity }).unwrap();
    } catch (error) {
      showToast('Failed to update item', 'error');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItem(itemId).unwrap();
      showToast('Item removed', 'success');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      showToast('Cart cleared', 'success');
    } catch (error) {
      showToast('Failed to clear cart', 'error');
    }
  };

  return {
    cart,
    items: cart?.items || [],
    total: cart?.total || 0,
    isLoading,
    error,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    addToCart: handleAddToCart,
    updateItem: handleUpdateItem,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
    refetch,
  };
};