# LogiTrack - Logistics Management UI

A React/Next.js frontend for the logistics service backend.

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
