import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import storeExports from '../../store';
import { CreateCategoryData } from '../../types/category';
import { showDeleteConfirm, showSuccess, showError, showLoading, hideLoading } from '../../utils/sweetAlert';
import paginationExports from '../common/Pagination';

const { categoryActions } = storeExports;
const { fetchCategoriesPaginated, fetchCategoriesAuto, createCategory, updateCategory, deleteCategory } = categoryActions;
const { Pagination } = paginationExports;

const CategoryList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, loading, error, pagination } = useSelector((state: RootState) => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Auto-pagination threshold
  const PAGINATION_THRESHOLD = 10;

  useEffect(() => {
    // Use auto-fetch which will determine if pagination is needed
    dispatch(fetchCategoriesAuto(PAGINATION_THRESHOLD));
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(fetchCategoriesPaginated({ page, limit: pagination.itemsPerPage }));
  };

  // Determine if pagination is being used
  const shouldUsePagination = pagination.totalPages > 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!categoryName.trim()) {
      showError('Please enter a category name');
      return;
    }

    const categoryData: CreateCategoryData = { name: categoryName.trim() };

    showLoading(editingCategory ? 'Updating category...' : 'Creating category...');

    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory, data: categoryData })).unwrap();
        hideLoading();
        await showSuccess('Category updated successfully!');
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
        hideLoading();
        await showSuccess('Category created successfully!');
      }

      setCategoryName('');
      setEditingCategory(null);
      setShowModal(false);
    } catch (error) {
      hideLoading();
      showError(editingCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleEdit = (id: number, name: string) => {
    setEditingCategory(id);
    setCategoryName(name);
    setShowModal(true);
  };

  const handleDelete = async (id: number, categoryName: string) => {
    try {
      const confirmed = await showDeleteConfirm(`category "${categoryName}"`);
      if (confirmed) {
        showLoading('Deleting category...');
        await dispatch(deleteCategory(id)).unwrap();
        hideLoading();
        showSuccess('Category deleted successfully!');
      }
    } catch (error) {
      hideLoading();
      showError('Failed to delete category. Please try again.');
    }
  };

  const resetModal = () => {
    setCategoryName('');
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleAddProduct = (categoryId: number) => {
    // Navigate to products page with category pre-selected for adding product
    navigate('/products', { state: { addProductForCategory: categoryId } });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          {shouldUsePagination && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {pagination.totalItems} categories with pagination
            </p>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
              <li key={category.id}>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.product_count || 0} product{(category.product_count || 0) !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAddProduct(category.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => handleEdit(category.id, category.name)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(category.id, category.name);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {categories.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {shouldUsePagination && !loading && categories.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={pagination.loading}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
