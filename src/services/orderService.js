import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  confirmDelivery: async (id) => {
    const response = await api.put(`/orders/${id}/confirm-delivery`);
    return response.data;
  },

  createDispute: async (disputeData) => {
    const response = await api.post('/orders/dispute', disputeData);
    return response.data;
  },

  

  updateVendorItemsStatus: async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/items-status`, { status });
  return response.data;
},


};




export default orderService;