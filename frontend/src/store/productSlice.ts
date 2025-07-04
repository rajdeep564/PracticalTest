import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ProductState, CreateProductData } from '../types/product';
import { PaginationParams } from '../types/pagination';
import { getProductsApi, createProductApi, updateProductApi, deleteProductApi } from '../utils/api';

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    loading: false,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductsApi();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductsPaginated = createAsyncThunk(
  'products/fetchProductsPaginated',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await getProductsApi(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch paginated products');
    }
  }
);

export const fetchProductsAuto = createAsyncThunk(
  'products/fetchProductsAuto',
  async (threshold: number = 12, { rejectWithValue }) => {
    try {
      // First, try to get a small paginated response to check total count
      const response = await getProductsApi({ page: 1, limit: threshold });
      const data = response.data.data;

      if (data.pagination && data.pagination.totalItems > threshold) {
        // Use paginated response
        return { usePagination: true, result: data };
      } else {
        // Fetch all products if total is within threshold
        const allResponse = await getProductsApi();
        return { usePagination: false, result: allResponse.data.data };
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductData, { rejectWithValue }) => {
    try {
      const response = await createProductApi(productData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: number; data: CreateProductData }, { rejectWithValue }) => {
    try {
      const response = await updateProductApi(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(prod => prod.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(prod => prod.id !== action.payload);
      })
      // Fetch products paginated
      .addCase(fetchProductsPaginated.pending, (state) => {
        state.pagination.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsPaginated.fulfilled, (state, action) => {
        state.pagination.loading = false;
        if (action.payload.data) {
          // Paginated response
          state.products = action.payload.data;
          state.pagination = {
            ...state.pagination,
            currentPage: action.payload.pagination.currentPage,
            totalPages: action.payload.pagination.totalPages,
            totalItems: action.payload.pagination.totalItems,
            itemsPerPage: action.payload.pagination.itemsPerPage,
            hasNextPage: action.payload.pagination.hasNextPage,
            hasPrevPage: action.payload.pagination.hasPrevPage,
            loading: false,
          };
        } else {
          // Non-paginated response (fallback)
          state.products = action.payload;
        }
      })
      .addCase(fetchProductsPaginated.rejected, (state, action) => {
        state.pagination.loading = false;
        state.error = action.payload as string;
      })
      // Fetch products auto
      .addCase(fetchProductsAuto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAuto.fulfilled, (state, action) => {
        state.loading = false;
        const { usePagination, result } = action.payload;

        if (usePagination && result.data) {
          // Paginated response
          state.products = result.data;
          state.pagination = {
            ...state.pagination,
            currentPage: result.pagination.currentPage,
            totalPages: result.pagination.totalPages,
            totalItems: result.pagination.totalItems,
            itemsPerPage: result.pagination.itemsPerPage,
            hasNextPage: result.pagination.hasNextPage,
            hasPrevPage: result.pagination.hasPrevPage,
            loading: false,
          };
        } else {
          // Non-paginated response
          state.products = result;
          state.pagination = {
            ...state.pagination,
            currentPage: 1,
            totalPages: 1,
            totalItems: result.length,
            itemsPerPage: result.length,
            hasNextPage: false,
            hasPrevPage: false,
            loading: false,
          };
        }
      })
      .addCase(fetchProductsAuto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const { clearError } = productSlice.actions;

const productExports = {
  fetchProducts,
  fetchProductsPaginated,
  fetchProductsAuto,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
  reducer: productSlice.reducer,
};

export default productExports;
