import { configureStore } from '@reduxjs/toolkit';
import authExports from './authSlice';
import categoryExports from './categorySlice';
import productExports from './productSlice';

const store = configureStore({
  reducer: {
    auth: authExports.reducer,
    categories: categoryExports.reducer,
    products: productExports.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const storeExports = {
  store,
  authActions: authExports,
  categoryActions: categoryExports,
  productActions: productExports,
};

export default storeExports;
