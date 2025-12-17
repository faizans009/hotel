# Hotel Booking Platform - Frontend

A modern, responsive hotel booking web application built with React, Vite, and Tailwind CSS. This platform enables users to search for hotels, view detailed information, filter by amenities, and manage their bookings.

## Features

- **Hotel Search**: Search hotels by destination with date and guest filtering
- **Advanced Filtering**: Filter hotels by amenities, room types, and other criteria
- **Hotel Details**: View comprehensive hotel information including gallery, rooms, and amenities
- **Authentication**: Secure login/signup with email OTP verification and social auth (Google, Apple)
- **Responsive Design**: Mobile-first responsive UI using Tailwind CSS
- **State Management**: Global state management with Jotai
- **Data Persistence**: React Query with persistent storage
- **API Integration**: Axios-based API communication

## Tech Stack

### Frontend Framework
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design** - Component library
- **Lucide React** - Icon library
- **React Icons** - Additional icons

### State Management & Data
- **Jotai** - Lightweight state management
- **React Query** - Server state management with caching
- **Axios** - HTTP client

### Utilities
- **Country List** - Country data
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
VITE_API_BASE_URL=your_api_url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APPLE_TEAM_ID=your_apple_team_id
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── common/         # Common components (DestinationSearch, Auth buttons)
│   ├── features/       # Feature-specific components
│   │   ├── home/       # Home page components
│   │   ├── hotels/     # Hotel-related components
│   │   └── searchForm/ # Search form components
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # UI components
├── pages/              # Page components
├── services/           # API services
├── store/              # Jotai atoms and state management
├── hooks/              # Custom React hooks
├── config/             # Configuration files
├── constants/          # Application constants
├── utils/              # Utility functions
├── assets/             # Static assets
├── App.jsx             # Main App component
└── main.jsx            # Application entry point
```

## Key Components

### Pages
- **Home.jsx** - Landing page with popular destinations
- **HotelDetails.jsx** - Detailed hotel information and booking
- **Login.jsx** - User login page
- **Signup.jsx** - User registration page
- **OtpVerification.jsx** - OTP verification for authentication

### Features
- **SearchForm** - Main hotel search interface
- **HotelFilters** - Advanced filtering options
- **HotelGallery** - Hotel image gallery
- **RoomsTable** - Room availability and pricing

## Authentication

The application supports multiple authentication methods:
- Email/Password with OTP verification
- Google OAuth
- Apple Sign In

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://your-api-server.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_APPLE_TEAM_ID=your-apple-team-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
VITE_APPLE_KEY_ID=your-apple-key-id
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.
