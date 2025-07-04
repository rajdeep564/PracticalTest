-- Create database
CREATE DATABASE IF NOT EXISTS dashboard_app;
USE dashboard_app;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    colors JSON NOT NULL,
    tags JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert test users (passwords are hashed for '123456')
INSERT INTO users (email, password, role) VALUES
('admin@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('user@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert test categories
INSERT INTO categories (name) VALUES
('Electronics'),
('Clothing'),
('Books'),
('Home & Garden'),
('Sports');

-- Insert test products
INSERT INTO products (category_id, name, price, colors, tags) VALUES
(1, 'Smartphone', 25000.00, '["Black", "White", "Blue"]', '["mobile", "android", "smartphone"]'),
(1, 'Laptop', 55000.00, '["Silver", "Black"]', '["computer", "laptop", "work"]'),
(1, 'Headphones', 3500.00, '["Black", "Red", "White"]', '["audio", "music", "wireless"]'),
(2, 'T-Shirt', 899.00, '["Red", "Blue", "Green", "Black"]', '["casual", "cotton", "summer"]'),
(2, 'Jeans', 2499.00, '["Blue", "Black"]', '["denim", "casual", "pants"]'),
(2, 'Sneakers', 4999.00, '["White", "Black", "Red"]', '["shoes", "sports", "casual"]'),
(3, 'Programming Book', 1299.00, '["Blue", "Red"]', '["education", "programming", "tech"]'),
(3, 'Novel', 599.00, '["Green", "Brown"]', '["fiction", "reading", "entertainment"]'),
(4, 'Plant Pot', 799.00, '["Brown", "White", "Green"]', '["garden", "decoration", "plants"]'),
(4, 'Garden Tools Set', 2999.00, '["Green", "Black"]', '["tools", "gardening", "outdoor"]'),
(5, 'Football', 1499.00, '["White", "Black"]', '["sports", "football", "outdoor"]'),
(5, 'Cricket Bat', 3499.00, '["Brown", "Natural"]', '["cricket", "sports", "bat"]);
