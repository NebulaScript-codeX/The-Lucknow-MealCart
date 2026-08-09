# The Lucknow Meal Cart 🍱

> Connecting Home Chefs, Tiffin Services, and Small Food Providers with customers seeking fresh, affordable, and home-style meals across Lucknow.

---

## Overview

The Lucknow Meal Cart is a **MERN Stack**-based web application that bridges the gap between local food providers and customers. The platform enables users to discover homemade meals, explore kitchens, subscribe to meal plans, place orders, manage favorites, and track orders conveniently — while allowing food providers to efficiently manage their kitchens, meals, subscription plans, and orders.

The application is built around three primary user roles:

- **Admin**
- **Customer**
- **Food Provider**

---

## Tech Stack

| Category          | Technologies                                   |
| ----------------- | ---------------------------------------------- |
| Frontend          | React.js, React Router DOM, Axios, React Icons |
| Backend           | Node.js, Express.js, MongoDB, Mongoose         |
| Authentication    | JWT, Bcrypt, Cookie Parser                     |
| File Handling     | Multer                                         |
| Development Tools | Nodemon, Dotenv, Git, GitHub, Postman          |

---

## Key Features

### Authentication & Security

- User Registration & Login
- JWT Authentication
- Password Encryption
- Cookie-Based Authentication
- Role-Based Access Control (RBAC)
- Profile Management
- Change Password
- Change Email

### Customer Features

- Browse Kitchens
- Browse Meals
- Search Meals and Kitchens
- Filter Meals
- View Single Kitchen
- View Single Meal
- Add Meals to Cart
- Update Cart Quantity
- Remove Meals from Cart
- Place Orders
- Track Orders
- View Order History
- Subscribe to Weekly/Monthly Plans
- Manage Favorites
- Review & Rate Kitchens
- View Notifications
- Manage Profile

### Food Provider Features

- Provider Dashboard
- Complete/Edit Kitchen Profile
- Manage Kitchen Gallery
- Open/Close Kitchen
- Add/Edit/Delete Meals
- Manage Orders
- Accept/Reject Orders
- Update Order Status
- Create/Edit/Delete Subscription Plans
- Manage Subscribers
- View Analytics
- View Earnings
- Manage Provider Profile
- Change Password / Email

### Admin Features

- View Dashboard Statistics
- View Customers
- View Providers
- View Kitchens
- View Meals
- View Subscriptions

### Platform Features

- Notifications
- Featured Meals
- Recently Added Meals
- Top Rated Kitchens
- Kitchen Gallery
- Kitchen Timings
- Delivery Areas
- Veg/Non-Veg Filter
- Favorites
- Reviews & Ratings
- Minimum Order Amount
- Estimated Delivery Time
- Weekly/Monthly Subscriptions
- Toast Notifications
- Role-Based Navigation

---

## System Overview

| Module                    | Description                                                                      |
| ------------------------- | -------------------------------------------------------------------------------- |
| **Authentication Module** | Handles registration, login, profile management, and authorization.              |
| **Kitchen Module**        | Handles kitchen creation, profile, gallery, timings, delivery areas, and status. |
| **Meal Module**           | Stores meal information, pricing, categories, and availability.                  |
| **Order Module**          | Handles order creation, processing, status updates, and tracking.                |
| **Plan Module**           | Manages weekly and monthly meal subscription plans.                              |
| **Subscription Module**   | Handles customer subscriptions and subscription status.                          |
| **Cart Module**           | Manages cart items, quantities, and billing information.                         |
| **Favorite Module**       | Stores and manages favorite meals.                                               |
| **Review Module**         | Stores customer ratings, reviews, and kitchen feedback.                          |
| **Notification Module**   | Sends and manages important user notifications.                                  |
| **Contact Module**        | Handles customer contact form submissions.                                       |
| **Admin Module**          | Provides centralized platform management and statistics.                         |
| **Provider Module**       | Provides provider dashboard, analytics, earnings, and profile management.        |

---

## System Architecture

```
┌───────────────────────────────┐
│  Customer / Provider / Admin  │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│         React Frontend        │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│         Axios Requests        │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Express APIs         │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│   Authentication Middleware   │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Controllers / Logic      │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│        MongoDB Database       │
└───────────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│   Notifications / Responses   │
└───────────────────────────────┘
```

---

## Project Structure

### Backend

```bash
backend/
│
├── src/
│   ├── config/
│   │   └── Database configuration
│   │
│   ├── controllers/
│   │   └── Business logic for API endpoints
│   │
│   ├── middlewares/
│   │   └── Authentication, authorization and request middleware
│   │
│   ├── models/
│   │   └── MongoDB / Mongoose models
│   │
│   ├── routes/
│   │   └── API route definitions
│   │
│   └── utils/
│       └── Reusable backend utilities
│
├── uploads/
│   └── Uploaded images and other media files
│
├── .env
├── env.example
├── package.json
├── package-lock.json
└── server.js
```

### Frontend

```bash
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── style.vars.css
│
├── .env
├── env.example
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## Database Models

| Model        | Purpose                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------- |
| User         | Stores Admin, Customer, and Provider information.                                              |
| Kitchen      | Stores kitchen details, ownership, gallery, timings, delivery areas, and operational settings. |
| Meal         | Stores meal details, category, pricing, quantity, and availability.                            |
| Order        | Stores customer orders, items, billing, delivery address, payment, and order status.           |
| Plan         | Stores provider-created weekly/monthly subscription plans.                                     |
| Subscription | Stores customer subscriptions, payment information, dates, and subscription status.            |
| Cart         | Stores customer cart items, quantities, prices, and totals.                                    |
| Favorite     | Stores customer favorite meals.                                                                |
| Review       | Stores customer ratings and kitchen reviews.                                                   |
| Notification | Stores user notifications and read/unread status.                                              |

---

## User Roles

| Admin                | Customer              | Food Provider             |
| -------------------- | --------------------- | ------------------------- |
| Dashboard Statistics | Browse Kitchens       | Manage Kitchen            |
| View Customers       | Browse Meals          | Manage Meals              |
| View Providers       | Search & Filter Meals | Manage Orders             |
| View Kitchens        | Place Orders          | Accept/Reject Orders      |
| View Meals           | Manage Cart           | Update Order Status       |
| View Subscriptions   | Manage Favorites      | Manage Plans              |
| –                    | Track Orders          | Manage Subscribers        |
| –                    | Manage Subscriptions  | View Analytics & Earnings |
| –                    | Reviews & Ratings     | Manage Profile            |

---

## Search Functionality

Users can search using:

- Meal Name
- Kitchen Name

---

## Order Lifecycle

```
┌──────────┐         ┌────────────┐         ┌─────────────┐         ┌────────────────────┐         ┌─────────────┐
│  Placed  │   ──▶   │  Accepted  │   ──▶   │  Preparing  │   ──▶   │  Out For Delivery  │   ──▶   │  Delivered  │
└──────────┘         └──────┬─────┘         └─────────────┘         └────────────────────┘         └─────────────┘
                             │
                             │  (Provider Rejects)
                             ▼
                      ┌────────────┐
                      │ Cancelled  │
                      └────────────┘
```

> A provider can also reject an order, which changes its status to `cancelled`.

---

## Subscription Lifecycle

```
┌─────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐         ┌─────────────────┐         ┌──────────────────────────────────┐
│  Provider Creates Plan  │   ──▶   │  Customer Subscribes   │   ──▶   │  Subscription Active   │   ──▶   │  Meal Delivery  │   ──▶   │  Subscription Ends / Cancelled   │
└─────────────────────────┘         └────────────────────────┘         └────────────────────────┘         └─────────────────┘         └──────────────────────────────────┘
```

---

## API Endpoints

### Authentication Routes

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/api/v1/auth/register`        |
| POST   | `/api/v1/auth/login`           |
| GET    | `/api/v1/auth/me`              |
| GET    | `/api/v1/auth/logout`          |
| PUT    | `/api/v1/auth/update-profile`  |
| PUT    | `/api/v1/auth/change-password` |

### Kitchen Routes

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | `/api/v1/kitchen/create`     |
| GET    | `/api/v1/kitchen/my-kitchen` |
| PUT    | `/api/v1/kitchen/update`     |
| DELETE | `/api/v1/kitchen/delete`     |
| GET    | `/api/v1/kitchen/:kitchenId` |
| GET    | `/api/v1/kitchen/all`        |

### Meal Routes

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| POST   | `/api/v1/meal/add-meal`            |
| GET    | `/api/v1/meal/my-meals`            |
| PUT    | `/api/v1/meal/update-meal/:mealId` |
| DELETE | `/api/v1/meal/delete-meal/:mealId` |
| GET    | `/api/v1/meal/:mealId`             |
| GET    | `/api/v1/meal/kitchen/:kitchenId`  |
| GET    | `/api/v1/meal/all`                 |
| GET    | `/api/v1/customer/dashboard`       |

> **Note:**
>
> - Food Providers can add, update, and delete their own meals.
> - Customers can view meal details and browse meals available in a particular kitchen.

### Order Routes

| Method | Endpoint                               | Access            | Purpose                         |
| ------ | -------------------------------------- | ----------------- | ------------------------------- |
| POST   | `/api/v1/order/create-order`           | Customer          | Create a new order              |
| GET    | `/api/v1/order/my-orders`              | Customer          | Get logged-in customer's orders |
| GET    | `/api/v1/order/:orderId`               | Customer/Provider | Get order details by ID         |
| GET    | `/api/v1/order/provider-orders`        | Provider          | Get orders received by provider |
| PUT    | `/api/v1/order/accept/:orderId`        | Provider          | Accept an order                 |
| PUT    | `/api/v1/order/reject/:orderId`        | Provider          | Reject an order                 |
| PUT    | `/api/v1/order/update-status/:orderId` | Provider          | Update order status             |

### Plan & Subscription Routes

| Method | Endpoint                              | Access   |
| ------ | ------------------------------------- | -------- |
| POST   | `/api/v1/plan/create`                 | Provider |
| GET    | `/api/v1/plan/my-plans`               | Provider |
| GET    | `/api/v1/plan/all`                    | Customer |
| PUT    | `/api/v1/plan/update/:planId`         | Provider |
| DELETE | `/api/v1/plan/delete/:planId`         | Provider |
| POST   | `/api/v1/plan/subscribe/:planId`      | Customer |
| GET    | `/api/v1/plan/my-subscriptions`       | Customer |
| DELETE | `/api/v1/plan/cancel/:subscriptionId` | Customer |

### Cart Routes

| Method | Endpoint                      |
| ------ | ----------------------------- |
| POST   | `/api/v1/cart/add`            |
| GET    | `/api/v1/cart/my-cart`        |
| PUT    | `/api/v1/cart/update/:mealId` |
| DELETE | `/api/v1/cart/remove/:mealId` |
| DELETE | `/api/v1/cart/clear`          |

### Favorite Routes

| Method | Endpoint                         |
| ------ | -------------------------------- |
| POST   | `/api/v1/favorite/add`           |
| GET    | `/api/v1/favorite/my-favorites`  |
| DELETE | `/api/v1/favorite/remove/:id`    |
| GET    | `/api/v1/favorite/check/:mealId` |
| POST   | `/api/v1/favorite/toggle`        |

### Review Routes

| Method | Endpoint                            | Access   | Purpose                      |
| ------ | ----------------------------------- | -------- | ---------------------------- |
| POST   | `/api/v1/review/add`                | Customer | Add a review for a kitchen   |
| GET    | `/api/v1/review/my-reviews`         | Customer | Get customer's reviews       |
| GET    | `/api/v1/review/kitchen/:kitchenId` | Public   | Get all reviews of a kitchen |
| GET    | `/api/v1/review/home-testimonials`  | Public   | Get home page testimonials   |
| DELETE | `/api/v1/review/delete/:reviewId`   | Customer | Delete a review              |

> Only customers who have successfully placed an order from a kitchen are allowed to submit reviews for that kitchen.

### Notification Routes

| Method | Endpoint                                      |
| ------ | --------------------------------------------- |
| POST   | `/api/v1/notification/create`                 |
| GET    | `/api/v1/notification/my-notifications`       |
| PUT    | `/api/v1/notification/read/:notificationId`   |
| DELETE | `/api/v1/notification/delete/:notificationId` |

### Admin Routes

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/v1/admin/dashboard`     |
| GET    | `/api/v1/admin/customers`     |
| GET    | `/api/v1/admin/providers`     |
| GET    | `/api/v1/admin/kitchens`      |
| GET    | `/api/v1/admin/subscriptions` |

### Provider Routes

| Method | Endpoint                           |
| ------ | ---------------------------------- |
| GET    | `/api/v1/provider/dashboard`       |
| GET    | `/api/v1/provider/profile`         |
| PUT    | `/api/v1/provider/profile`         |
| GET    | `/api/v1/provider/analytics`       |
| GET    | `/api/v1/provider/earnings`        |
| PUT    | `/api/v1/provider/change-password` |
| PUT    | `/api/v1/provider/change-email`    |

### Contact Routes

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/v1/contact/create` |

### Home Routes

| Method | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/v1/home/stats`          |
| GET    | `/api/v1/home/featured-meals` |
| GET    | `/api/v1/home/testimonials`   |
| GET    | `/api/v1/home/search?q=`      |

---

## API Summary

| Module                | APIs     |
| --------------------- | -------- |
| Authentication        | 6        |
| Kitchen               | 6        |
| Meals                 | 8        |
| Orders                | 7        |
| Plans & Subscriptions | 8        |
| Cart                  | 5        |
| Favorites             | 5        |
| Reviews               | 5        |
| Notifications         | 4        |
| Admin                 | 5        |
| Provider              | 7        |
| Contact               | 1        |
| Home                  | 4        |
| **Total APIs**        | **~75+** |

---

## Application Pages

| Public Pages | Customer Pages | Provider Pages     | Admin Pages   |
| ------------ | -------------- | ------------------ | ------------- |
| Home         | Dashboard      | Dashboard          | Dashboard     |
| Login        | Cart           | Manage Kitchen     | Customers     |
| Register     | Checkout       | Manage Meals       | Providers     |
| Kitchens     | Favorites      | Orders             | Kitchens      |
| Meal Details | Orders         | Subscription Plans | Meals         |
| About        | Notifications  | Subscribers        | Subscriptions |
| Contact      | Profile        | Analytics          | –             |
| 404 Page     | Subscriptions  | Earnings           | –             |
| –            | Reviews        | Profile            | –             |

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/the-lucknow-meal-cart.git
```

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

---

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## Future Enhancements

- Online Payment Gateway Integration
- Real-Time Notifications
- Google Maps Integration
- AI-Based Meal Recommendations
- Delivery Partner Module
- Mobile Application Support
- Multi-City Expansion
- Advanced Analytics and Reporting

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to fork the repository and submit a pull request.

---

## License

This project is developed for educational, learning, and portfolio purposes.

---

## Developed By

| Field          | Details                                         |
| -------------- | ----------------------------------------------- |
| Name           | Shrestha Awasthi                                |
| Degree         | Bachelor of Computer Applications (2024–2027)   |
| College        | Lal Bahadur Shastri Girls College of Management |
| University     | Lucknow University                              |
| Specialization | MERN Stack Development                          |

> _"Building technology solutions that create meaningful real-world impact."_
>
> _"Bringing homemade meals closer to every doorstep in Lucknow."_
