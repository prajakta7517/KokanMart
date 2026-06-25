# KokanMart Frontend

Premium e-commerce frontend for authentic Konkan products, built with React 19, Vite, TypeScript, and Tailwind CSS.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The dev server runs on **http://localhost:5173** (matches backend CORS).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8000` | FastAPI backend URL |

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Pages

- **Public:** Home, Products, Product Detail, Cart
- **Auth:** Login, Signup, Forgot/Reset Password
- **Customer:** Checkout, Payment (Razorpay), Orders, Profile
- **Admin:** Dashboard, Product CRUD, Image Upload, Order Management
