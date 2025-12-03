# Products Microfrontend

A React-based microfrontend for managing and displaying products in an e-commerce application.

## Features

- Product listing with grid layout
- Product search functionality
- Category and price filtering
- Product detail view
- Responsive design
- Loading states with skeletons
- Error boundary for error handling
- Redux state management

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS (available)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Products Microfrontend
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProductCard.jsx
│   ├── ProductFilter.jsx
│   ├── ProductList.jsx
│   ├── ProductSearch.jsx
│   └── ProductSkeleton.jsx
├── pages/              # Page components
│   ├── ProductDetailPage.jsx
│   └── ProductsPage.jsx
├── store/              # Redux store and slices
│   ├── productsSlice.js
│   └── store.js
├── styles/             # CSS files
│   ├── App.css
│   └── index.css
├── utils/              # Utility functions
│   └── api.js
├── App.jsx             # Main app component
└── main.jsx           # Entry point
```

## API Integration

The microfrontend expects a REST API with the following endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products

## Development

The application runs on port 3002 by default and is configured to work as a microfrontend in a larger application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

The application is built using Vite and can be deployed to any static hosting service or integrated into a microfrontend architecture.