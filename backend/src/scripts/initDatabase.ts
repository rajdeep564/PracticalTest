import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dashboard_app'
};

const DB_CONFIG_WITHOUT_DB = {
  host: DB_CONFIG.host,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password
};

export async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 Initializing database...');
    
    // Connect without specifying database
    connection = await mysql.createConnection(DB_CONFIG_WITHOUT_DB);
    
    // Drop database if it exists and create fresh
    // await connection.execute(`DROP DATABASE IF EXISTS \`${DB_CONFIG.database}\``);
    // console.log(`🗑️ Dropped existing database '${DB_CONFIG.database}' if it existed`);

    // Create fresh database
    await connection.execute(`CREATE DATABASE \`${DB_CONFIG.database}\``);
    console.log(`✅ Created fresh database '${DB_CONFIG.database}'`);

    // Close connection and reconnect with database specified
    await connection.end();
    connection = await mysql.createConnection(DB_CONFIG);
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created or already exists');
    
    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Categories table created or already exists');
    
    // Create products table with colors field (as per requirements)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        colors JSON NOT NULL,
        tags JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Products table created or already exists');
    
    await connection.end();
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

// Function to seed initial data
export async function seedInitialData() {
  let connection;
  
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    
    // Check if data already exists
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const [categoryCount] = await connection.execute('SELECT COUNT(*) as count FROM categories');
    
    if ((userCount as any[])[0].count === 0) {
      console.log('🌱 Seeding initial users...');
      
      // Insert default users with bcrypt hash for password "123456"
      const defaultPasswordHash = '$2a$10$OqauvJcUgmYYmYtWpEMpieDz8yzRyqmu5vQKr.C3d7strU9Lkk44C';
      
      await connection.execute(`
        INSERT INTO users (email, password, role) VALUES 
        ('admin@gmail.com', ?, 'admin'),
        ('user@gmail.com', ?, 'user')
      `, [defaultPasswordHash, defaultPasswordHash]);
      
      console.log('✅ Default users created');
    }
    
    if ((categoryCount as any[])[0].count === 0) {
      console.log('🌱 Seeding initial categories...');
      
      await connection.execute(`
        INSERT INTO categories (name) VALUES 
        ('Electronics'),
        ('Clothing'),
        ('Books'),
        ('Home & Garden'),
        ('Sports')
      `);
      
      console.log('✅ Default categories created');
      
      // Add sample products
      console.log('🌱 Seeding initial products...');
      
      await connection.execute(`
        INSERT INTO products (category_id, name, price, colors, tags) VALUES
        (1, 'Smartphone', 25000.00, ?, ?),
        (1, 'Laptop', 55000.00, ?, ?),
        (2, 'T-Shirt', 899.00, ?, ?),
        (3, 'Programming Book', 1299.00, ?, ?)
      `, [
        JSON.stringify(['Black', 'White']),
        JSON.stringify(['mobile', 'android', 'smartphone']),
        JSON.stringify(['Black', 'Blue']),
        JSON.stringify(['computer', 'laptop', 'work']),
        JSON.stringify(['Red', 'Green', 'Yellow']),
        JSON.stringify(['casual', 'cotton', 'summer']),
        JSON.stringify(['Black']),
        JSON.stringify(['education', 'programming', 'tech'])
      ]);
      
      console.log('✅ Default products created');
    }
    
    await connection.end();
    console.log('🎉 Data seeding completed!');
    
  } catch (error) {
    console.error('❌ Data seeding failed:', error);
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}
