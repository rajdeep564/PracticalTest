import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import storeExports from '../../store';
import formatterExports from '../../utils/formatters';
import { Product } from '../../types/product';
import AddProductModal from './AddProductModal';
import { showDeleteConfirm, showSuccess, showError, showLoading, hideLoading } from '../../utils/sweetAlert';
import { useAuth } from '../../hooks/useAuth';
import paginationExports from '../common/Pagination';

const { formatIndianCurrency } = formatterExports;
const { productActions, categoryActions } = storeExports;
const { fetchProductsPaginated, fetchProductsAuto, deleteProduct } = productActions;
const { fetchCategories } = categoryActions;
const { Pagination } = paginationExports;

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { products, loading, error, pagination } = useSelector((state: RootState) => state.products);
  console.log('products: ', products);
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState<number | null>(null);

  // Auto-pagination threshold
  const PAGINATION_THRESHOLD = 12; // Higher threshold for products since they're in a grid

  useEffect(() => {
    // Use auto-fetch which will determine if pagination is needed
    dispatch(fetchProductsAuto(PAGINATION_THRESHOLD));
    dispatch(fetchCategories());

    // Check if we came from category page with a pre-selected category
    const state = location.state as { addProductForCategory?: number } | null;
    if (state?.addProductForCategory) {
      setPreSelectedCategoryId(state.addProductForCategory);
      setShowModal(true);
      // Clear the state to prevent reopening modal on refresh
      window.history.replaceState({}, document.title);
    }
  }, [dispatch, location.state]);

  const handlePageChange = (page: number) => {
    dispatch(fetchProductsPaginated({ page, limit: pagination.itemsPerPage }));
  };

  // Determine if pagination is being used
  const shouldUsePagination = pagination.totalPages > 1;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: number, productName: string) => {
    try {
      const confirmed = await showDeleteConfirm(`product "${productName}"`);
      if (confirmed) {
        showLoading('Deleting product...');
        await dispatch(deleteProduct(id)).unwrap();
        // Refresh both products and categories
        dispatch(fetchProductsAuto(PAGINATION_THRESHOLD));
        dispatch(fetchCategories());
        hideLoading();
        showSuccess('Product deleted successfully!');
      }
    } catch (error) {
      hideLoading();
      showError('Failed to delete product. Please try again.');
    }
  };

  const closeModal = () => {
    setEditingProduct(null);
    setShowModal(false);
    setPreSelectedCategoryId(null);
    // Refetch products to ensure the list is up-to-date after create/update
    setTimeout(() => {
      dispatch(fetchProductsAuto(PAGINATION_THRESHOLD));
    }, 100);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          {shouldUsePagination && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {pagination.totalItems} products with pagination
            </p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category_name}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-green-600">
                    {formatIndianCurrency(product.price)}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Colors:</h4>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-1 border border-gray-300"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {product.tags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isAdmin && (
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(product)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(product.id, product.name);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isAdmin ? 'Get started by creating a new product.' : 'No products available to display.'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {shouldUsePagination && !loading && products.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={pagination.loading}
        />
      )}

      <AddProductModal
        isOpen={showModal}
        onClose={closeModal}
        editingProduct={editingProduct}
        preSelectedCategoryId={preSelectedCategoryId}
      />
    </div>
  );
};

export default ProductList;
