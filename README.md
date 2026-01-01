# Shobha Sarees Admin Panel

Admin panel for managing the Shobha Sarees e-commerce platform built with React, TypeScript, and Tailwind CSS.

## Features

- Saree management (CRUD operations)
- Category management
- Collection management
- Catalog management
- Admin authentication
- Dashboard with statistics
- Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd shobha-sarees-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
VITE_BASE_URL=http://localhost:5000/api
```

### Environment Variables Explained:

- `VITE_BASE_URL`: Base URL for the API backend (default: http://localhost:5000/api)

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Integration

The admin panel connects to the backend API at the URL specified in `VITE_BASE_URL`. Make sure your backend server is running before starting the admin panel.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service functions
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── context/       # React context providers
└── lib/          # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run build:dev` - Create development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Create a new Pull Request
