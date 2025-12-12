import { apiSlice } from '../store/api/apiSlice';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

export class ProductService {
  static async getProducts(params = {}) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, { params });
      return response.data;
    } catch (error) {
      console.error('ProductService.getProducts error:', error);
      throw error;
    }
  }

  static async getProduct(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('ProductService.getProduct error:', error);
      throw error;
    }
  }

  static formatPrice(price) {
    if (price === null || price === undefined || isNaN(price)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price).replace('₹', '₹');
  }

  static getCategoryColor(category) {
    const colors = {
      'mobiles': '#4A90E2',
      'electronics': '#6C5CE7', 
      'fashion': '#E74C3C',
      'home': '#F39C12',
      'home & kitchen': '#F39C12',
      'books': '#27AE60',
      'sports': '#BD10E0',
      'beauty': '#FF69B4',
      'toys': '#FFD700',
      'grocery': '#45B7D1',
      'health': '#4ECDC4',
      'car': '#96CEB4',
      'baby': '#FF6B6B',
      'prime': '#FF9900',
      'today\'s deals': '#CC0C39'
    };
    return colors[category?.toLowerCase()] || '#9013FE';
  }

  static getCategoryIcon(category) {
    const icons = {
      'mobiles': '📱',
      'electronics': '💻', 
      'fashion': '👕',
      'home': '🏠',
      'home & kitchen': '🏠',
      'books': '📚',
      'sports': '⚽',
      'beauty': '💄',
      'toys': '🧸',
      'grocery': '🛒',
      'health': '💊',
      'car': '🚗',
      'baby': '👶'
    };
    return icons[category?.toLowerCase()] || '📦';
  }

  static getProductImage(product) {
    // Return actual product image if available, otherwise generate a styled placeholder
    if (product?.image && !product.image.includes('placeholder')) {
      return product.image;
    }
    
    // Generate a styled CSS-based image placeholder
    const color = this.getCategoryColor(product?.category);
    const icon = this.getCategoryIcon(product?.category);
    
    return {
      type: 'placeholder',
      backgroundColor: color,
      icon: icon,
      text: product?.name?.split(' ').slice(0, 2).join(' ') || 'Product'
    };
  }
}

export default ProductService;