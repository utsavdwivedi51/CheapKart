# Cheapkart - React + Node.js + MongoDB

A full-stack e-commerce marketplace (Flipkart-inspired) built with:

- **Frontend**: React 18, React Router v6, Context API, localStorage persistence
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT-based authentication with bcrypt password hashing

---

## Project Structure

```
cheapkart/
├── frontend/
│   ├── public/
│   │   └── index.html        # DM Sans + Fraunces fonts, Font Awesome 6.5
│   └── src/
│       ├── api/              # Axios service layer (api.js)
│       ├── context/          # AppContext.js (cart, auth, wishlist, orders, toasts)
│       ├── components/       # Header, Footer, ProductCard, Toast, AuthModal, CategoryNav
│       ├── pages/            # Home, Category, ProductDetail, Cart, Checkout, OtherPages
│       ├── data.js           # 24 products + helpers (formatPrice, discount)
│       ├── App.js            # React Router v6 setup
│       ├── index.js          # ReactDOM entry
│       └── index.css         # Global CSS vars, btn/form/card utilities
│
└── backend/
    ├── .env                  # Environment variables
    └── src/
        ├── models/           # User.js, Order.js (Mongoose schemas)
        ├── routes/           # auth.js, orders.js, wishlist.js, addresses.js
        ├── middleware/       # auth.js (JWT protect + signToken)
        ├── data/             # products.js (static product catalog)
        └── index.js          # Express server entry point
```

---

```
---

## API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Login | — |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update name/mobile/gender/dob |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Query Params | Auth |
|--------|----------|--------------|------|
| GET | `/api/products` | `category`, `q`, `sort`, `minPrice`, `maxPrice`, `page`, `limit` | - |
| GET | `/api/products/:id` | - | - |

**Sort options**: `price_asc`, `price_desc`, `rating`, `newest`

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get user's orders (supports `?page=&limit=&status=`) |
| GET | `/api/orders/:id` | Get single order by id or orderId |
| PUT | `/api/orders/:id/cancel` | Cancel order |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist (array of product IDs) |
| POST | `/api/wishlist/:productId` | Toggle product (add/remove) |

### Addresses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/addresses` | Get all saved addresses |
| POST | `/api/addresses` | Add new address |
| PUT | `/api/addresses/:id` | Update address |
| DELETE | `/api/addresses/:id` | Delete address |
| PATCH | `/api/addresses/:id/default` | Set as default address |

 Requires `Authorization: Bearer <token>` header

---

## Frontend Routes

| Path | Page |
|------|------|
| `/` | Home (hero slider, flash sale, categories) |
| `/category/:cat` | Category / Search results |
| `/product/:id` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | 3-step checkout |
| `/order-success/:orderId` | Order confirmation |
| `/wishlist` | Saved items |
| `/orders` | Order history |
| `/profile` | User profile |
| `/plus` | Cheapkart Plus page |
| `/notifications` | Notifications |

---

## Connecting Frontend to Backend API

The frontend uses localStorage for state by default. To switch to full API mode, updated `AppContext.js` using the `api.js` service layer

---

## MongoDB Schemas

### User
- `name`, `email` (unique), `mobile`, `password` (hashed, select: false), `avatar`
- `gender` (enum), `dob`, `addresses` (subdocument array), `wishlist` (Number[])
- `superCoins`, `isPlus`, `isActive`, timestamps

### Order
- `orderId` (auto-generated: `OD` + timestamp + random)
- `user` (ref), `items[]`, `shippingAddress`
- `pricing` { subtotal, discount, deliveryCharge, total }
- `payment` { method, status, transactionId }
- `status` (Processing → Confirmed → Shipped → Out for Delivery → Delivered)
- `timeline[]` (status history), `estimatedDelivery`, timestamps

---

## Production Deployment

### Frontend → Vercel
### Backend → Render

## Features

- Home page with hero slider (4 slides, auto-advance)
- Flash sale with live countdown timer 
- Live search with autocomplete dropdown 
- Category browsing with filters & sorting 
- Cart with quantity controls & price breakdown 
- Wishlist with move-to-cart 
- 3-step checkout (Address → Summary → Payment) 
- Order history with status tracking 
- User profile with 6 tabs 
- Cheapkart Plus membership page 
- Notifications page 
- JWT auth with bcrypt password hashing 
- Fully responsive (mobile/tablet/desktop) 
- Toast notifications with animations 
- localStorage persistence (offline-first) 
- MongoDB persistence (backend) 
- Addresses CRUD API 
- Password change 
- Order cancellation 
