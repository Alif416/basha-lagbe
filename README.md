# Basha Lagbe — Rental Property Marketplace for Bangladesh

A full-stack web application that connects landlords with tenants across Bangladesh. Browse, search, and list rental properties by division, price, property type, and amenities.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

**Basha Lagbe** (Bengali: "Need a Home") is a rental property marketplace built for the Bangladeshi market. It supports 8 major divisions and allows landlords to list properties with detailed information while tenants can search, filter, and contact landlords directly through the platform.

The platform features two separate user roles — **tenants/landlords** and **admins** — each with dedicated authentication flows and dashboards.

---

## Features

### For Tenants & Landlords

- **Authentication** — Email/password signup & signin, Google OAuth via Firebase
- **Property Search** — Full-text search with filters: location, division, price range, bedrooms, bathrooms, renter type (bachelor / family / any), furnished, parking
- **Property Listings** — Multi-step form to list properties with images, amenities, availability date, and contact info
- **Property Details** — View count tracking, photo gallery, amenities list (Gas, Electricity, Water, Elevator, Security, Generator, CCTV, etc.)
- **User Profile** — Edit username, email, password, avatar, address, age, profession, and mobile number
- **Persistent Sessions** — Redux Persist keeps users logged in across page refreshes

### For Admins

- **Admin Dashboard** — Separate login with tabs for Overview, Users, Properties, and Analytics
- **User Management** — View all registered users, get user count, delete accounts
- **Property Management** — View all listed properties, total and available counts, delete listings

---

## Tech Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Frontend         | React 18, Vite 6, Tailwind CSS 3, React Router v7 |
| State Management | Redux Toolkit 2.5, Redux Persist 6                |
| HTTP Client      | Axios 1.7                                         |
| UI Components    | Swiper 11 (carousels), React Icons 5              |
| Authentication   | JWT, Firebase (Google OAuth), bcryptjs            |
| Backend          | Node.js, Express.js 4                             |
| Database         | MongoDB Atlas, Mongoose 8                         |
| Build Tool       | Vite with SWC compiler                            |

---

## Project Structure

```
basha-lagbe/
├── client/                       # React frontend (Vite)
│   └── src/
│       ├── pages/                # Home, Explore, PropertyDetail, Profile, LandlordPage, etc.
│       ├── Admin/                # Admin dashboard, user & property controls, analytics
│       ├── components/           # Header, Dashboard, PrivateRoute, OAuth, contact form
│       ├── redux/                # Redux store, userSlice, adminSlice
│       ├── App.jsx               # Root router
│       └── firebase.js           # Firebase OAuth config
│
├── server/                       # Express backend
│   ├── models/                   # Mongoose schemas: User, Property, Listing, Admin
│   ├── controllers/              # Auth, user, listing, admin logic
│   ├── routes/                   # auth, user, listing, property, admin routes
│   ├── middleware/               # Admin auth middleware
│   ├── utils/                    # JWT verification, error handler
│   └── index.js                  # Server entry point
│
├── .env                          # Environment variables (not committed)
├── package.json                  # Root scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Firebase project (optional, for Google OAuth)

### 1. Clone the repository

```bash
git clone https://github.com/Alif416/basha-lagbe.git
cd basha-lagbe
```

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables)).

For Google OAuth, update `client/src/firebase.js` with your Firebase project config.

### 4. Run the development servers

```bash
# From the root directory — starts both client and server
npm run dev
```

Or run them separately:

```bash
# Backend (port 5000)
cd server && npm run dev

# Frontend (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=BashaLagbe
JWT_SECRET=your_jwt_secret_key
```

| Variable     | Description                       |
| ------------ | --------------------------------- |
| `MONGO_URL`  | MongoDB Atlas connection string   |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## API Reference

All API routes are prefixed with `/server`.

### Authentication — `/server/auth`

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| POST   | `/signup`  | Register a new user         |
| POST   | `/signin`  | Login with email & password |
| POST   | `/google`  | Login with Google OAuth     |
| GET    | `/signout` | Logout and clear cookie     |

### Users — `/server/user`

| Method | Endpoint       | Description          | Auth     |
| ------ | -------------- | -------------------- | -------- |
| GET    | `/allusers`    | Get all users        | Required |
| GET    | `/total/users` | Get total user count | Required |
| GET    | `/:id`         | Get user by ID       | Required |
| POST   | `/update/:id`  | Update user profile  | Required |
| DELETE | `/delete/:id`  | Delete user account  | Required |

### Properties — `/server/properties`

| Method | Endpoint            | Description                                        |
| ------ | ------------------- | -------------------------------------------------- |
| POST   | `/add`              | Create a new property listing                      |
| GET    | `/all`              | Get properties with search, filters & pagination   |
| GET    | `/recent`           | Get 6 most recent available properties             |
| GET    | `/get/:id`          | Get a single property (auto-increments view count) |
| PUT    | `/update/:id`       | Update a property                                  |
| DELETE | `/delete/:id`       | Delete a property                                  |
| GET    | `/total/properties` | Get total & available property count               |

### Query Parameters for `GET /server/properties/all`

| Parameter    | Type    | Description                                                    |
| ------------ | ------- | -------------------------------------------------------------- |
| `searchTerm` | string  | Full-text search across title, location, district, description |
| `division`   | string  | Filter by division (e.g., Dhaka, Chittagong)                   |
| `renterType` | string  | `bachelor`, `family`, or `any`                                 |
| `minPrice`   | number  | Minimum monthly rent (BDT)                                     |
| `maxPrice`   | number  | Maximum monthly rent (BDT)                                     |
| `bedrooms`   | number  | Minimum number of bedrooms                                     |
| `bathrooms`  | number  | Minimum number of bathrooms                                    |
| `furnished`  | boolean | Furnished properties only                                      |
| `parking`    | boolean | Properties with parking only                                   |
| `sort`       | string  | `createdAt` or `price`                                         |
| `order`      | string  | `asc` or `desc`                                                |
| `startIndex` | number  | Pagination offset (default: 0)                                 |
| `limit`      | number  | Results per page (default: 12)                                 |

### Admin — `/server/admin`

| Method | Endpoint   | Description               |
| ------ | ---------- | ------------------------- |
| POST   | `/signup`  | Register an admin account |
| POST   | `/signin`  | Admin login               |
| GET    | `/signout` | Admin logout              |

---

## Data Models

### Property

```js
{
  title, description, price,         // Core info
  location, district, division,      // Location (8 divisions supported)
  image, images[],                   // Photos
  renterType,                        // "bachelor" | "family" | "any"
  bedrooms, bathrooms, area, floor,  // Property specs
  furnished, parking,                // Boolean flags
  amenities[],                       // Gas, Electricity, Water, Elevator, Security, etc.
  availableMonth, availableYear,     // Availability
  phoneNumber, email,                // Landlord contact
  isAvailable, views,                // Status & analytics
  userRef                            // Landlord user ID
}
```

### User

```js
{
  (username,
    email,
    password(hashed),
    avatar,
    address,
    age,
    profession,
    mobileNumber);
}
```

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

> Built with React, Express, MongoDB, and Tailwind CSS — crafted for Bangladesh's rental market.
