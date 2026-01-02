# LogiTrack - Logistics Management UI

A modern React/Next.js frontend for the logistics service backend.

## Features

- **Order Management**: Create, view, and manage shipment orders
- **Order Tracking**: Search and track orders by tracking number
- **Status Updates**: Update order status (Pending → In Transit → Delivered)
- **Order Cancellation**: Cancel orders that are still in Pending status
- **Authentication**: User login and registration

## Tech Stack

- **Framework**: Next.js 14 (Pages Router - avoiding RSC vulnerability)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18 or Bun
- Backend service running on http://localhost:3000

### Installation

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local

# Start development server
bun dev
```

The app will be available at http://localhost:3001

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000/api/v1` |

## Project Structure

```
ui-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.tsx   # Main layout with navigation
│   │   ├── OrderCard.tsx # Order display with actions
│   │   └── OrderForm.tsx # Create order form
│   ├── contexts/        # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── lib/             # Utilities and API client
│   │   ├── api.ts       # Axios API client
│   │   └── utils.ts     # Helper functions
│   ├── pages/           # Next.js pages
│   │   ├── _app.tsx     # App wrapper
│   │   ├── index.tsx    # Dashboard
│   │   ├── login.tsx    # Login page
│   │   ├── register.tsx # Registration page
│   │   ├── track.tsx    # Order tracking page
│   │   └── orders/      # Order pages
│   │       ├── index.tsx  # Orders list
│   │       ├── new.tsx    # Create order
│   │       └── [id].tsx   # Order detail
│   └── styles/
│       └── globals.css  # Global styles
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with quick actions |
| `/login` | User login |
| `/register` | User registration |
| `/orders` | List all orders |
| `/orders/new` | Create new order |
| `/orders/[id]` | Order details |
| `/track` | Track order by tracking number |

## Security Note

This project uses Next.js 14.2.15 with the **Pages Router** (not App Router) to avoid the [React Server Components security vulnerability](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) disclosed in December 2025.
