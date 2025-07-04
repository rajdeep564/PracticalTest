import { PoolConnection } from 'mysql2/promise';

interface Category {
  id: number;
  name: string;
  product_count?: number;
}

interface PaginationParams {
  page: number;
  limit: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

class CategoryModel {
  static async findAll(connection: PoolConnection): Promise<Category[]> {
    try {
      const [rows] = await connection.execute(`
        SELECT
          c.id,
          c.name,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id, c.name
        ORDER BY c.name
      `);
      return rows as Category[];
    } catch (error) {
      throw new Error('Database error while fetching categories');
    }
  }

  static async findAllPaginated(connection: PoolConnection, params: PaginationParams): Promise<PaginatedResponse<Category>> {
    try {
      const { page, limit } = params;
      const offset = (page - 1) * limit;

      // Get total count
      const [countResult] = await connection.execute(`
        SELECT COUNT(*) as total FROM categories
      `);
      const totalItems = (countResult as any[])[0].total;

      // Get paginated data
      const [rows] = await connection.execute(`
        SELECT
          c.id,
          c.name,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id, c.name
        ORDER BY c.name
        LIMIT ${offset}, ${limit}
      `);

      const categories = rows as Category[];
      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: categories,
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
      console.error('Category findAllPaginated error:', error);
      throw new Error(`Database error while fetching paginated categories: ${error}`);
    }
  }

  static async findById(connection: PoolConnection, id: number): Promise<Category | null> {
    try {
      const [rows] = await connection.execute(`
        SELECT
          c.id,
          c.name,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        WHERE c.id = ?
        GROUP BY c.id, c.name
      `, [id]);
      const categories = rows as Category[];
      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      throw new Error('Database error while finding category');
    }
  }

  static async findByName(connection: PoolConnection, name: string, excludeId?: number): Promise<Category | null> {
    try {
      let query = 'SELECT id, name FROM categories WHERE LOWER(name) = LOWER(?)';
      const params: any[] = [name];

      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [rows] = await connection.execute(query, params);
      const categories = rows as Category[];
      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      throw new Error('Database error while finding category by name');
    }
  }

  static async create(connection: PoolConnection, name: string): Promise<Category> {
    try {
      const [result] = await connection.execute('INSERT INTO categories (name) VALUES (?)', [name]);
      const insertResult = result as any;
      return { id: insertResult.insertId, name };
    } catch (error) {
      throw new Error('Database error while creating category');
    }
  }

  static async update(connection: PoolConnection, id: number, name: string): Promise<boolean> {
    try {
      const [result] = await connection.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
      const updateResult = result as any;
      return updateResult.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error while updating category');
    }
  }

  static async delete(connection: PoolConnection, id: number): Promise<boolean> {
    try {
      const [result] = await connection.execute('DELETE FROM categories WHERE id = ?', [id]);
      const deleteResult = result as any;
      return deleteResult.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error while deleting category');
    }
  }
}

const categoryExports = {
  CategoryModel,
};

export default categoryExports;
export type { Category, PaginationParams, PaginatedResponse };
