# 🚀 Full-Stack Dashboard Application

A modern, responsive dashboard application built with React, TypeScript, Node.js, Express, and MySQL. Features **automatic pagination**, JWT authentication, and a clean modular architecture.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with token persistence
- Role-based access control (Admin/User)
- Protected routes and middleware
- Automatic token refresh handling
- Dynamic panel title based on user role

### 📊 Product Management
- Complete CRUD operations for products
- Category-based organization
- Color selection with checkboxes (Black, White, Yellow, Green, Blue, Red)
- Tag management system
- Price formatting with proper validation
- **Automatic pagination** (activates when >12 products)

### 🗂️ Category Management
- Full category CRUD operations
- Product count tracking per category
- Modal-based category creation/editing
- **Automatic pagination** (activates when >10 categories)

### 🎨 User Interface
- Modern, responsive design with Tailwind CSS
- Clean modular component architecture
- Smart pagination that appears only when needed
- Real-time data updates
- Mobile-friendly responsive layout

### 🔄 Smart Pagination System
- **Automatic Detection**: Pagination activates automatically based on item count
- **No Manual Controls**: Users don't need to toggle pagination on/off
- **Efficient Loading**: Only loads required data
- **Seamless UX**: Pagination controls appear only when necessary

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** with createBrowserRouter
- **Tailwind CSS** for styling
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MySQL** database with mysql2
- **JWT** for authentication
- **Express-validator** for input validation
- **CORS** enabled for cross-origin requests

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PracticalTest2
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE dashboard_app;
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=dashboard_app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Initialize Database Schema and Seed Data
```bash
cd backend
npm run init-db
```

This command will:
- Create all necessary tables (users, categories, products)
- Insert sample categories (Electronics, Clothing, Books, Home & Garden, Sports)
- Insert sample products with realistic data
- Create default admin user: `admin@gmail.com` / `admin123`
- Create default regular user: `user@gmail.com` / `user123`

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run build    # Build TypeScript
npm start        # Start the server
```
The backend will run on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
cd frontend
npm start        # Start React development server
```
The frontend will run on `http://localhost:3000`

### 3. Access the Application
- Open your browser and navigate to `http://localhost:3000`
- Login with default credentials:
  - **Admin**: `admin@gmail.com` / `admin123`
  - **User**: `user@gmail.com` / `user123`

## 📁 Project Structure

```
PracticalTest2/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, CORS
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helper functions
│   │   └── app.ts           # Express app setup
│   ├── scripts/
│   │   └── init-db.js       # Database initialization
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── categories/  # Category management
│   │   │   ├── common/      # Reusable components
│   │   │   ├── layout/      # Layout components
│   │   │   └── products/    # Product management
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store & slices
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helper functions
│   └── package.json
└── README.md
```

## 🔑 Default User Accounts

The application comes with pre-configured test accounts:

### Admin Account
- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Permissions**: Full access to all features including category and product management

### User Account
- **Email**: `user@gmail.com`
- **Password**: `user123`
- **Permissions**: Read-only access to dashboard and products

## 📚 API Documentation

### Authentication
- `POST /api/users/login` - User login

### Categories
- `GET /api/categories` - Get all categories (auto-pagination)
- `GET /api/categories?page=1&limit=10` - Get paginated categories
- `POST /api/categories` - Create new category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products
- `GET /api/products` - Get all products (auto-pagination)
- `GET /api/products?page=1&limit=12` - Get paginated products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## 🎨 Frontend Features

### Smart Pagination System
- **Automatic Detection**: No manual pagination toggles
- **Threshold-Based**: Categories (10 items), Products (12 items)
- **Seamless UX**: Pagination appears only when needed
- **Efficient Loading**: Loads only required data

### Component Architecture
- **Modular Design**: Reusable components with single responsibility
- **Route Management**: Centralized routing with createBrowserRouter
- **State Management**: Redux Toolkit with async thunks
- **Type Safety**: Full TypeScript integration

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Role-Based UI**: Dynamic content based on user permissions
- **Real-Time Updates**: Instant feedback for all operations
- **Loading States**: Smooth loading indicators and error handling

## 🔧 Key Implementation Details

### Authentication & Authorization
- JWT tokens stored in localStorage with automatic refresh
- Role-based route protection and UI rendering
- Secure password hashing with bcrypt
- Protected API endpoints with middleware validation

### Database Design
- **Connection Pooling**: Efficient MySQL connection management
- **Prepared Statements**: SQL injection prevention
- **Foreign Key Constraints**: Data integrity maintenance
- **Optimized Queries**: Efficient pagination with LIMIT/OFFSET

### State Management
- **Redux Toolkit**: Centralized state with slices
- **Async Thunks**: API call management with loading states
- **Error Handling**: Comprehensive error management
- **Data Normalization**: Efficient data structure organization

### Code Quality
- **TypeScript**: Full type safety across frontend and backend
- **Modular Architecture**: Clean separation of concerns
- **Single Default Exports**: Consistent export patterns
- **Validation**: Express-validator for backend, form validation for frontend

## 🚀 Production Ready Features

### Performance Optimizations
- **Automatic Pagination**: Reduces initial load time
- **Connection Pooling**: Efficient database connections
- **Build Optimization**: Minified production builds
- **Lazy Loading**: Component-level code splitting

### Security Measures
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation on both ends
- **CORS Configuration**: Proper cross-origin request handling
- **SQL Injection Prevention**: Prepared statements and validation

### Scalability
- **Modular Architecture**: Easy to extend and maintain
- **Type Safety**: Reduces runtime errors
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Works on all device sizes


**Built with ❤️ using React, TypeScript, Node.js, and MySQL**
