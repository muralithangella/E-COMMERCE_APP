# Profile Microfrontend

A React-based microfrontend for user profile management in the ecommerce application.

## Features

- User profile viewing and editing
- Order history display
- Responsive design
- Redux state management
- Vite build system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3004`

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
├── components/          # Reusable React components
│   ├── ErrorMessage.jsx
│   ├── LoadingSpinner.jsx
│   ├── OrderItem.jsx
│   ├── OrderList.jsx
│   ├── ProfileCard.jsx
│   └── ProfileForm.jsx
├── pages/              # Page components
│   ├── EditProfilePage.jsx
│   ├── OrderHistoryPage.jsx
│   └── ProfilePage.jsx
├── store/              # Redux store and slices
│   ├── profileSlice.js
│   └── store.js
├── styles/             # CSS styles
│   ├── App.css
│   └── index.css
├── utils/              # Utility functions
│   └── api.js
├── App.jsx            # Main App component
└── main.jsx           # Entry point
```

## API Integration

The microfrontend integrates with the backend API for:

- User profile management (`/api/users/profile`)
- Order history (`/api/orders/user`)

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:5000/api)

## Routes

- `/` - Profile page
- `/edit` - Edit profile page
- `/orders` - Order history page