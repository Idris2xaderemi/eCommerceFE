// Cart is primarily managed in Redux/localStorage
// This service is for any server-side cart operations if needed

import api from './api';

const cartService = {
  validateCart: async (cartItems) => {
    const response = await api.post('/cart/validate', { items: cartItems });
    return response.data;
  },

  calculateShipping: async (address) => {
    const response = await api.post('/cart/shipping', address);
    return response.data;
  },
};

export default cartService;