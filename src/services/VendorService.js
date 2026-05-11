import api from './api';

const vendorService = {
  getVendors: async () => {
    const response = await api.get('/vendors');
    return response.data;
  },

  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },

  getVendorProducts: async (vendorId, params = {}) => {
    const response = await api.get(`/vendors/${vendorId}/products`, { params });
    return response.data;
  },

  getVendorAllProducts: async (vendorId) => {
    console.log('service hitting endpoint:', `/vendors/${vendorId}/all-products`);
    const response = await api.get(`/vendors/${vendorId}/all-products`);
    return response.data;
  },
};

export default vendorService;