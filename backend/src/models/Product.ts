import { PoolConnection } from 'mysql2/promise';
import { PaginationParams, PaginatedResponse } from './Category';

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  colors: string[];
  tags: string[];
  category_name?: string;
}

interface CreateProductData {
  category_id: number;
  name: string;
  price: number;
  colors: string[];
  tags: string[];
}

class ProductModel {
  static async findAll(connection: PoolConnection): Promise<Product[]> {
    try {
      const [rows] = await connection.execute(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.name
      `);
      const products = rows as any[];
      return products.map(product => ({
        ...product,
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
      }));
    } catch (error) {
      console.error('Product findAll error:', error);
      throw new Error(`Database error while fetching products: ${error}`);
    }
  }

  static async findAllPaginated(connection: PoolConnection, params: PaginationParams): Promise<PaginatedResponse<Product>> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Get total count
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total FROM products
      `);
      const totalItems = (countResult as any[])[0].total;

      // Get paginated data
      const [rows] = await connection.execute(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.name
        LIMIT ${offset}, ${limit}
      `);

      const products = (rows as any[]).map(product => ({
        ...product,
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
      }));

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      console.error('Product findAllPaginated error:', error);
      throw new Error(`Database error while fetching paginated products: ${error}`);
    }
  }

  static async findById(connection: PoolConnection, id: number): Promise<Product | null> {
    try {
      const [rows] = await connection.execute(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
      `, [id]);
      const products = rows as any[];
      if (products.length === 0) return null;
      
      const product = products[0];
      return {
        ...product,
        colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors,
        tags: typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags
      };
    } catch (error) {
      throw new Error('Database error while finding product');
    }
  }

  static async create(connection: PoolConnection, productData: CreateProductData): Promise<Product> {
    try {
      const { category_id, name, price, colors, tags } = productData;
      const [result] = await connection.execute(
        'INSERT INTO products (category_id, name, price, colors, tags) VALUES (?, ?, ?, ?, ?)',
        [category_id, name, price, JSON.stringify(colors), JSON.stringify(tags)]
      );
      const insertResult = result as any;
      return {
        id: insertResult.insertId,
        category_id,
        name,
        price,
        colors,
        tags
      };
    } catch (error) {
      throw new Error('Database error while creating product');
    }
  }

  static async update(connection: PoolConnection, id: number, productData: CreateProductData): Promise<boolean> {
    try {
      const { category_id, name, price, colors, tags } = productData;
      const [result] = await connection.execute(
        'UPDATE products SET category_id = ?, name = ?, price = ?, colors = ?, tags = ? WHERE id = ?',
        [category_id, name, price, JSON.stringify(colors), JSON.stringify(tags), id]
      );
      const updateResult = result as any;
      return updateResult.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error while updating product');
    }
  }

  static async delete(connection: PoolConnection, id: number): Promise<boolean> {
    try {
      const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);
      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error while deleting product');
    }
  }
}

const productExports = {
  ProductModel,
};

export default productExports;
export type { Product, CreateProductData };
