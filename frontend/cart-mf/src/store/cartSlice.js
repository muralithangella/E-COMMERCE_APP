export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity = 1, variant = null }, { rejectWithValue }) => {
    try {
      // Ensure we have the product details
      if (!product || !product._id) {
        throw new Error('Invalid product data');
      }

      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          name: product.name || 'Unknown Product',
          price: product.price?.sale || product.price?.regular || product.price || 0,
          image: product.images?.[0]?.url || 'https://via.placeholder.com/300x200',
          quantity: parseInt(quantity, 10),
          variant,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add item to cart');
      }

      const data = await response.json();
      console.log('Add to cart response:', data);
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);