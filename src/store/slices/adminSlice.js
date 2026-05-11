import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getPendingVendors = createAsyncThunk('admin/getPendingVendors', async (_, thunkAPI) => {
  try {
    const res = await api.get('/admin/vendors/pending');
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const verifyVendor = createAsyncThunk('admin/verifyVendor', async (id, thunkAPI) => {
  try {
    const res = await api.put(`/admin/vendors/${id}/verify`);
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const removeVendor = createAsyncThunk('admin/removeVendor', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/vendors/${id}`);
    return id;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const getPendingProducts = createAsyncThunk('admin/getPendingProducts', async (_, thunkAPI) => {
  try {
    const res = await api.get('/admin/products/pending');
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const approveProduct = createAsyncThunk('admin/approveProduct', async (id, thunkAPI) => {
  try {
    const res = await api.put(`/admin/products/${id}/approve`);
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const rejectProduct = createAsyncThunk('admin/rejectProduct', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/products/${id}`);
    return id;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const getDisputes = createAsyncThunk('admin/getDisputes', async (_, thunkAPI) => {
  try {
    const res = await api.get('/admin/disputes');
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

export const resolveDispute = createAsyncThunk('admin/resolveDispute', async ({ id, resolution }, thunkAPI) => {
  try {
    const res = await api.put(`/admin/disputes/${id}/resolve`, { resolution });
    return res.data;
  } catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed'); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingVendors: [],
    pendingProducts: [],
    disputes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingVendors.fulfilled, (state, action) => { state.pendingVendors = action.payload.vendors; })
      .addCase(verifyVendor.fulfilled, (state, action) => {
        state.pendingVendors = state.pendingVendors.filter(v => v._id !== action.payload.vendor._id);
      })
      .addCase(removeVendor.fulfilled, (state, action) => {
        state.pendingVendors = state.pendingVendors.filter(v => v._id !== action.payload);
      })
      .addCase(getPendingProducts.fulfilled, (state, action) => { state.pendingProducts = action.payload.products; })
      .addCase(approveProduct.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter(p => p._id !== action.payload.product._id);
      })
      .addCase(rejectProduct.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter(p => p._id !== action.payload);
      })
      .addCase(getDisputes.fulfilled, (state, action) => { state.disputes = action.payload.disputes; })
      .addCase(resolveDispute.fulfilled, (state, action) => {
        state.disputes = state.disputes.filter(d => d._id !== action.payload.dispute._id);
      });
  },
});

export default adminSlice.reducer;