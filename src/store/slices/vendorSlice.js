import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import vendorService from '../../services/vendorServices';

export const getVendors = createAsyncThunk(
  'vendors/getVendors',
  async (_, { rejectWithValue }) => {
    try {
      return await vendorService.getVendors();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load vendors');
    }
  }
);

export const getVendor = createAsyncThunk(
  'vendors/getVendor',
  async (id, { rejectWithValue }) => {
    try {
      return await vendorService.getVendor(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load vendor');
    }
  }
);

export const getVendorProducts = createAsyncThunk(
  'vendors/getVendorProducts',
  async ({ vendorId, params }, { rejectWithValue }) => {
    try {
      return await vendorService.getVendorProducts(vendorId, params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load vendor products');
    }
  }
);

export const getVendorAllProducts = createAsyncThunk(
  'vendors/getVendorAllProducts',
  async ({ vendorId }, { rejectWithValue }) => {
    try {
      console.log('thunk called with vendorId:', vendorId);
      const result = await vendorService.getVendorAllProducts(vendorId);
      console.log('service returned:', result);
      return result;
    } catch (error) {
      console.log('thunk error:', error);
      return rejectWithValue(error.message || 'Failed to load all products');
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    vendor: null,
    vendorProducts: [],
    allVendorProducts: [],
    isLoading: false,
    isLoadingAllProducts: false,
    error: null,
  },
  reducers: {
    clearVendor: (state) => {
      state.vendor = null;
      state.vendorProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVendors.pending, (state) => { state.isLoading = true; })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload.vendors;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getVendor.pending, (state) => { state.isLoading = true; })
      .addCase(getVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendor = action.payload.vendor;
      })
      .addCase(getVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getVendorProducts.pending, (state) => { state.isLoading = true; })
      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendorProducts = action.payload.products;
      })
      .addCase(getVendorProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getVendorAllProducts.pending, (state) => {
        state.isLoadingAllProducts = true;
      })
      .addCase(getVendorAllProducts.fulfilled, (state, action) => {
        state.isLoadingAllProducts = false;
        console.log('getVendorAllProducts payload:', action.payload);
        state.allVendorProducts = action.payload.products;
      })
      .addCase(getVendorAllProducts.rejected, (state, action) => {
        state.isLoadingAllProducts = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendor } = vendorSlice.actions;
export default vendorSlice.reducer;