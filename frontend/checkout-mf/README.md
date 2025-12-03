# Checkout Microfrontend

A React-based checkout microfrontend built with Vite for the e-commerce application.

## Features

- Multi-step checkout process (Shipping → Payment → Review)
- Address validation and management
- Payment form with card validation
- Order summary with real-time calculations
- Responsive design
- Redux state management
- Order confirmation page

## Tech Stack

- React 18
- Vite
- Redux Toolkit
- React Router DOM
- Axios
- Styled Components

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3003`

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AddressForm.jsx
│   ├── CheckoutSteps.jsx
│   ├── OrderSummary.jsx
│   ├── PaymentForm.jsx
│   └── ShippingForm.jsx
├── pages/              # Page components
│   ├── CheckoutPage.jsx
│   └── OrderConfirmationPage.jsx
├── store/              # Redux store
│   ├── checkoutSlice.js
│   └── store.js
├── styles/             # CSS files
├── utils/              # Utilities
│   └── api.js
├── App.jsx
└── main.jsx
```

## API Integration

The microfrontend integrates with the backend API for:

- Payment processing
- Order creation
- Address validation
- Shipping calculations
- Tax calculations

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Routes

- `/` - Checkout page (redirects to shipping step)
- `/checkout` - Checkout page
- `/confirmation/:orderId` - Order confirmation page