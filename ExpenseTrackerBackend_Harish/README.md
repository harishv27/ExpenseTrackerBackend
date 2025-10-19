# Expense Tracker Backend

A robust RESTful API backend for expense tracking built with Express.js, MongoDB, and Firebase Authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Brownie Points Implementation](#brownie-points-implementation)

## ✨ Features

- 🔐 **Firebase Authentication** - Secure user registration and login
- 💰 **Expense Management** - Complete CRUD operations for expenses
- 📊 **Reports & Analytics** - Monthly summaries and category-wise reports
- ✅ **Input Validation** - Robust validation using express-validator
- 🛡️ **Error Handling** - Custom error handling middleware
- 🔍 **Advanced Filtering** - Filter and sort expenses by multiple criteria
- 📈 **Aggregation Pipeline** - MongoDB aggregation for monthly reports

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Authentication
- **Validation**: express-validator
- **Testing**: Postman

## 📁 Project Structure

```
ExpenseTrackerBackend_YourName/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── expenseController.js # Expense CRUD operations
│   │   └── reportController.js  # Report generation
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validators.js        # Input validation rules
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Expense.js           # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── expenseRoutes.js     # Expense endpoints
│   │   └── reportRoutes.js      # Report endpoints
│   ├── firebase/
│   │   ├── firebaseAdmin.js     # Firebase Admin SDK setup
│   │   └── serviceAccountKey.json # Firebase credentials (gitignored)
│   └── server.js                # Main application entry point
├── .env                          # Environment variables (gitignored)
├── .gitignore
├── package.json
├── README.md
├── postman_collection.json
└── API_Documentation.pdf
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) - Local installation or MongoDB Atlas account
- **Firebase Account** - For authentication setup
- **Postman** - For API testing

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ExpenseTrackerBackend_Harish.git
cd ExpenseTrackerBackend_YourName
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** → Select **Email/Password** sign-in method
4. Navigate to **Project Settings** → **Service Accounts**
5. Click **Generate New Private Key** and download the JSON file
6. Save the JSON file as `src/firebase/serviceAccountKey.json`

### Step 4: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod --dbpath /path/to/your/data/directory
```


## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/expense-tracker

```

## 🏃 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

### Verify Server is Running

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "uid": "firebase_user_id"
}
```

---

#### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "firebase_custom_token",
  "uid": "firebase_user_id"
}
```

**Note:** Save the `token` for authenticated requests

---

#### 3. Logout User
**POST** `/api/logout`

**Headers:**
```
Authorization: Bearer <your_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Expense Management Endpoints

All expense endpoints require authentication. Include the token in headers:
```
Authorization: Bearer <your_token>
```

#### 4. Create Expense
**POST** `/api/expenses`

**Request Body:**
```json
{
  "title": "Lunch at Restaurant",
  "amount": 250,
  "category": "Food",
  "date": "2025-10-12"
}
```

**Valid Categories:**
- Food
- Travel
- Shopping
- Entertainment
- Bills
- Healthcare
- Education
- Other

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Expense added successfully",
  "id": "expense_id_here"
}
```

---

#### 5. Get All Expenses
**GET** `/api/expenses`

**Optional Query Parameters:**
- `category` - Filter by category (e.g., `?category=Food`)
- `startDate` - Filter from date (e.g., `?startDate=2025-10-01`)
- `endDate` - Filter until date (e.g., `?endDate=2025-10-31`)
- `sortBy` - Sort field (e.g., `?sortBy=amount`)
- `order` - Sort order: `asc` or `desc` (e.g., `?order=desc`)

**Example:**
```
GET /api/expenses?category=Food&sortBy=date&order=desc
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "expense_id",
      "title": "Lunch",
      "amount": 250,
      "category": "Food",
      "date": "2025-10-12T00:00:00.000Z"
    }
  ]
}
```

---

#### 6. Get Single Expense
**GET** `/api/expenses/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "expense_id",
    "title": "Lunch",
    "amount": 250,
    "category": "Food",
    "date": "2025-10-12T00:00:00.000Z"
  }
}
```

---

#### 7. Update Expense
**PUT** `/api/expenses/:id`

**Request Body:** (all fields optional)
```json
{
  "title": "Dinner at Restaurant",
  "amount": 500,
  "category": "Food",
  "date": "2025-10-12"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Expense updated successfully"
}
```

---

#### 8. Delete Expense
**DELETE** `/api/expenses/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

### Report Endpoints

#### 9. Monthly Report
**GET** `/api/reports/monthly`

**Query Parameters:**
- `month` - Month number (1-12)
- `year` - Year (e.g., 2025)

**Example:**
```
GET /api/reports/monthly?month=10&year=2025
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 4400,
    "categories": {
      "Bills": 2000,
      "Shopping": 1200,
      "Entertainment": 500,
      "Travel": 300,
      "Food": 400
    }
  }
}
```

---

#### 10. Category Report
**GET** `/api/reports/category`

**Query Parameters:**
- `category` - Category name (e.g., Food, Travel)

**Example:**
```
GET /api/reports/category?category=Food
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "expense_id",
      "title": "Lunch",
      "amount": 250,
      "date": "2025-10-12T00:00:00.000Z"
    }
  ]
}
```

---

### Error Responses

The API uses standard HTTP status codes:

**400 Bad Request** - Validation error or missing required fields
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

**401 Unauthorized** - Invalid or missing authentication token
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or expired token"
}
```

**404 Not Found** - Resource not found
```json
{
  "success": false,
  "message": "Expense not found"
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## 🧪 Testing

### Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json` from the project root
4. The collection will be imported with all endpoints

### Testing Flow

1. **Register a new user** - Save the `uid`
2. **Login** - Save the returned `token`
3. **Create multiple expenses** with different categories
4. **Test all CRUD operations**
5. **Test filtering and sorting**
6. **Generate reports**
7. **Test error scenarios** (invalid token, missing fields, etc.)

### Automated Tests with Postman

The collection includes test scripts that automatically:
- Save tokens and IDs as variables
- Validate response structure
- Check status codes
- Verify data integrity

Run the entire collection:
1. Click on the collection name
2. Click **Run** button
3. Select all requests
4. Click **Run Expense Tracker API**




## 🔒 Security Best Practices

1. **Environment Variables** - Sensitive data stored in .env
2. **Firebase Admin SDK** - Secure server-side authentication
3. **Token Verification** - All protected routes verify JWT tokens
4. **Input Sanitization** - express-validator sanitizes all inputs
5. **Error Handling** - No sensitive data leaked in error messages
6. **CORS Configuration** - Controlled cross-origin requests




## 📄 License

This project is part of a technical assessment for KonnichiWow Backend Developer Intern position.

## 👤 Author

**Your Name**
- GitHub: [@harish](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Express.js Documentation
- MongoDB Documentation
- Firebase Documentation
- express-validator Documentation

---

**Last Updated:** October 19, 2025

**Version:** 1.0.0