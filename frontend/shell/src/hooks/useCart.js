import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useAddToCartAPIMutation, useRemoveFromCartAPIMutation, useUpdateCartItemMutation } from '../store/api/apiSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  
  const [addToCartAPI] = useAddToCartAPIMutation();
  const [removeFromCartAPI] = useRemoveFromCartAPIMutation();
  const [updateCartItemAPI] = useUpdateCartItemMutation();

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      // Add to local Redux store immediately for better UX
      dispatch(addToCart({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity
      }));

      // Sync with backend API
      try {
        await addToCartAPI({ productId: product.id || product._id, quantity });
      } catch (apiError) {
        console.warn('Failed to sync with backend:', apiError);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      dispatch(removeFromCart(itemId));
      
      try {
        await removeFromCartAPI(itemId);
      } catch (apiError) {
        console.warn('Failed to sync removal with backend:', apiError);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      dispatch(updateQuantity({ id: itemId, quantity }));
      
      try {
        await updateCartItemAPI({ id: itemId, quantity });
      } catch (apiError) {
        console.warn('Failed to sync quantity update with backend:', apiError);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      dispatch(clearCart());
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return {
    cart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    isEmpty: cart.items.length === 0,
    itemCount: cart.count,
    total: cart.total
  };
};

export default useCart;