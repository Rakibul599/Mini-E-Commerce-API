#  Mini E-Commerce API

The **Mini E-Commerce API** is a robust backend system simulating a basic online shopping platform. It features JWT-based authentication, Role-Based Access Control, product management, cart operations, and order processing with strict business rules and transaction handling.

---

## Live Demo & API Documentation

- Live API Base URL: https://mini-e-commerce-api-lj0k.onrender.com
- Swagger Documentation: https://mini-e-commerce-api-lj0k.onrender.com/api-docs

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT 
- **Security**: Bcrypt 
- **Validation**: Express-validator

---

## Database Schema Diagram

![Database Schema](./Database%20Schema%20Diagram.png)

## Setup Instructions

### 1. Prerequisites
- Node.js 
- MongoDB (Local or Atlas)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd "Mini E-Commerce API"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URL=mongodb://localhost:27017/mini-ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

### 5. Running the API
- **Dev Mode**: `npm run dev`
- **Prod Mode**: `npm start`

---

## Business Rules & Decisions

1.  **RBAC**: Two roles exist: `admin` and `customer`. 
    - Admins can manage products and stock.
    - Customers can shop, manage their cart, and place orders.
2.  **Order Logic**:
    - **Stock Check**: Orders are blocked if any item exceeds available stock.
    - **Fraud Prevention**: Users with more than 5 order cancellations are suspended from placing new orders.
    - **Transactions**: MongoDB transactions ensure that stock deduction and order creation happen atomically.
3.  **Inventory**: Negative stock is prevented. Stock is deducted only upon successful order placement.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |

### Product Management
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/admin/products` | Get all products | Public |
| POST | `/api/admin/products` | Add new product | Admin |
| PUT | `/api/admin/products/:id` | Update product | Admin |
| DELETE | `/api/admin/products/:id` | Delete product | Admin |
| PATCH | `/api/admin/products/:id/stock` | Update product stock | Admin |

### Cart Operations
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/cart/mycart` | View personal cart | Customer |
| POST | `/api/cart/add` | Add product to cart | Customer |
| DELETE | `/api/cart/remove/:productId` | Remove item from cart | Customer |

### Order Processing
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/order` | Place an order | Customer |
| GET | `/api/order` | List my orders | Customer |
| GET | `/api/order/:id` | Get order details | Customer |
| DELETE | `/api/order/:id/cancel` | Cancel order | Customer |
| PUT | `/api/order/:id/status` | Update order status | Admin |

---

## API Usage Examples

### 1. Register a User
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "customer"
}
```

### 2. Login
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
*Returns: `Bearer <token>`*

### 3. Add to Cart
**POST** `/api/cart/add` (Headers: `Authorization: Bearer <token>`)
```json
{
  "items": [
    {
      "productId": "65cb...",
      "quantity": 2
    }
  ]
}
```

### 4. Place Order
**POST** `/api/order` (Headers: `Authorization: Bearer <token>`)
*No body required; uses items from the active cart.*

---

## Architectural Decisions
- **Controllers/Routes Pattern**: Clean separation of concerns.
- **Middleware**: Centralized auth and RBAC logic.
- **Atomicity**: Used MongoDB `session` for data integrity during critical operations.
