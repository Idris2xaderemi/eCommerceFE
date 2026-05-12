

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