import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryState, CreateCategoryData } from '../types/category';
import { PaginationParams } from '../types/pagination';
import { getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi } from '../utils/api';

const initialState: CategoryState = {
  categories: [],
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

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesApi();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoriesPaginated = createAsyncThunk(
  'categories/fetchCategoriesPaginated',
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await getCategoriesApi(params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch paginated categories');
    }
  }
);

export const fetchCategoriesAuto = createAsyncThunk(
  'categories/fetchCategoriesAuto',
  async (threshold: number = 10, { rejectWithValue }) => {
    try {
      // First, try to get a small paginated response to check total count
      const response = await getCategoriesApi({ page: 1, limit: threshold });
      const data = response.data.data;

      if (data.pagination && data.pagination.totalItems > threshold) {
        // Use paginated response
        return { usePagination: true, result: data };
      } else {
        // Fetch all categories if total is within threshold
        const allResponse = await getCategoriesApi();
        return { usePagination: false, result: allResponse.data.data };
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CreateCategoryData, { rejectWithValue }) => {
    try {
      const response = await createCategoryApi(categoryData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data }: { id: number; data: CreateCategoryData }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryApi(id, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCategoryApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      })
      // Fetch categories paginated
      .addCase(fetchCategoriesPaginated.pending, (state) => {
        state.pagination.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesPaginated.fulfilled, (state, action) => {
        state.pagination.loading = false;
        if (action.payload.data) {
          // Paginated response
          state.categories = action.payload.data;
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
          state.categories = action.payload;
        }
      })
      .addCase(fetchCategoriesPaginated.rejected, (state, action) => {
        state.pagination.loading = false;
        state.error = action.payload as string;
      })
      // Fetch categories auto
      .addCase(fetchCategoriesAuto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAuto.fulfilled, (state, action) => {
        state.loading = false;
        const { usePagination, result } = action.payload;

        if (usePagination && result.data) {
          // Paginated response
          state.categories = result.data;
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
          state.categories = result;
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
      .addCase(fetchCategoriesAuto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

const { clearError } = categorySlice.actions;

const categoryExports = {
  fetchCategories,
  fetchCategoriesPaginated,
  fetchCategoriesAuto,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  reducer: categorySlice.reducer,
};

export default categoryExports;
