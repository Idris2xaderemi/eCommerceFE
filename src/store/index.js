import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import vendorReducer from './slices/vendorSlice';
import orderReducer from './slices/orderSlice';
import reviewReducer from './slices/reviewSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    vendors: vendorReducer,
    orders: orderReducer,
    reviews: reviewReducer,
    admin: adminReducer,
  },
});

export default store;