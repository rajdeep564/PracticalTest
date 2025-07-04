import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import storeExports from '../../store';
import { CreateProductData, Product } from '../../types/product';
import { showSuccess, showError, showLoading, hideLoading } from '../../utils/sweetAlert';

const { productActions, categoryActions } = storeExports;
const { createProduct, updateProduct } = productActions;
const { fetchCategories } = categoryActions;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
  preSelectedCategoryId?: number | null;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, editingProduct, preSelectedCategoryId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<CreateProductData>({
    category_id: 0,
    name: '',
    price: 0,
    colors: [],
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Available colors as per requirements
  const availableColors = ['Black', 'White', 'Yellow', 'Green', 'Blue', 'Red'];

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        category_id: editingProduct.category_id,
        name: editingProduct.name,
        price: editingProduct.price,
        colors: editingProduct.colors,
        tags: editingProduct.tags
      });
      setPriceInput(editingProduct.price.toString());
    } else {
      setFormData({
        category_id: preSelectedCategoryId || 0,
        name: '',
        price: 0,
        colors: [],
        tags: []
      });
      setPriceInput('');
    }
    setErrors({});
  }, [editingProduct, preSelectedCategoryId]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (formData.category_id === 0) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!priceInput.trim()) {
      newErrors.price = 'Price is required';
    } else {
      // Check if the input contains only valid price characters (digits, decimal point)
      const validPricePattern = /^[0-9]+(\.[0-9]{0,2})?$/;

      if (!validPricePattern.test(priceInput.trim())) {
        newErrors.price = 'Price must contain only numbers and decimal point';
      } else {
        const price = parseFloat(priceInput);
        if (isNaN(price)) {
          newErrors.price = 'Price must be a valid number';
        } else if (price <= 0) {
          newErrors.price = 'Price must be greater than 0';
        } else if (price > 999999.99) {
          newErrors.price = 'Price cannot exceed ₹999,999.99';
        }
      }
    }

    if (formData.colors.length === 0) {
      newErrors.colors = 'At least one color is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriceChange = (value: string) => {
    setPriceInput(value);

    // Real-time validation
    let priceError = '';

    if (!value.trim()) {
      priceError = 'Price is required';
    } else {
      // Check if the input contains only valid price characters (digits, decimal point)
      const validPricePattern = /^[0-9]+(\.[0-9]{0,2})?$/;

      if (!validPricePattern.test(value.trim())) {
        priceError = 'Price must contain only numbers and decimal point';
      } else {
        const price = parseFloat(value);
        if (isNaN(price)) {
          priceError = 'Price must be a valid number';
        } else if (price <= 0) {
          priceError = 'Price must be greater than 0';
        } else if (price > 999999.99) {
          priceError = 'Price cannot exceed ₹999,999.99';
        } else {
          // Valid price, update formData
          setFormData(prev => ({ ...prev, price }));
        }
      }
    }

    // Update error state
    setErrors(prev => ({ ...prev, price: priceError }));
  };

  const handleColorChange = (color: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      colors: checked
        ? [...prev.colors, color]
        : prev.colors.filter(c => c !== color)
    }));

    // Clear colors error when user selects a color
    if (checked && errors.colors) {
      setErrors(prev => ({ ...prev, colors: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return;
    }

    showLoading(editingProduct ? 'Updating product...' : 'Creating product...');

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, data: formData })).unwrap();
        hideLoading();
        await showSuccess('Product updated successfully!');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        hideLoading();
        await showSuccess('Product created successfully!');
      }
      // Refresh both products and categories to update the lists
      dispatch(fetchCategories());
      // Note: ProductList will handle its own refetch via parent component
      onClose();
    } catch (error) {
      hideLoading();
      showError(editingProduct ? 'Failed to update product' : 'Failed to create product');
    }
  };



  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  if (!isOpen) return null;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          
          {!isAdmin && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              You need admin privileges to {editingProduct ? 'edit' : 'add'} products.
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                  required
                  disabled={!isAdmin}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category_id}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }));
                    if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  disabled={!isAdmin}
                >
                  <option value={0}>Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (Rs.) *
              </label>
              <input
                type="text"
                id="price"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter price (e.g., 299.99)"
                required
                disabled={!isAdmin}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              {priceInput && !errors.price && !isNaN(parseFloat(priceInput)) && parseFloat(priceInput) > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  ₹{parseFloat(priceInput).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors * (At least one required)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableColors.map((color) => (
                  <label
                    key={color}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.colors.includes(color)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color)}
                      onChange={(e) => handleColorChange(color, e.target.checked)}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={!isAdmin}
                    />
                    <span className="text-sm font-medium text-gray-700">{color}</span>
                    <div
                      className={`ml-auto w-4 h-4 rounded-full border border-gray-300`}
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                  </label>
                ))}
              </div>
              {errors.colors && <p className="mt-1 text-sm text-red-600">{errors.colors}</p>}
              {formData.colors.length > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  Selected: {formData.colors.join(', ')}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter tag"
                  disabled={!isAdmin}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  disabled={!isAdmin}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {tag}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              {isAdmin && (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
