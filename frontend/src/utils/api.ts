import axios from 'axios';
import { LoginData } from '../types/auth';
import { CreateCategoryData } from '../types/category';
import { CreateProductData } from '../types/product';
import { PaginationParams } from '../types/pagination';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginApi = (data: LoginData) => 
  api.post('/users/login', data);

// Category APIs
export const getCategoriesApi = (params?: PaginationParams) => {
  if (params) {
    return api.get('/categories', { params });
  }
  return api.get('/categories');
};

export const createCategoryApi = (data: CreateCategoryData) =>
  api.post('/categories', data);

export const updateCategoryApi = (id: number, data: CreateCategoryData) =>
  api.put(`/categories/${id}`, data);

export const deleteCategoryApi = (id: number) =>
  api.delete(`/categories/${id}`);

// Product APIs
export const getProductsApi = (params?: PaginationParams) => {
  if (params) {
    return api.get('/products', { params });
  }
  return api.get('/products');
};

export const getProductApi = (id: number) =>
  api.get(`/products/${id}`);

export const createProductApi = (data: CreateProductData) =>
  api.post('/products', data);

export const updateProductApi = (id: number, data: CreateProductData) =>
  api.put(`/products/${id}`, data);

export const deleteProductApi = (id: number) =>
  api.delete(`/products/${id}`);
