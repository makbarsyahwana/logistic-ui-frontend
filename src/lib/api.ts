import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Order {
  id: string;
  trackingNumber: string;
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELED';
  user?: {
    id: string;
    email: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  senderName: string;
  recipientName: string;
  origin: string;
  destination: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    statusCode: number;
    message: string | string[];
    error: string;
    path: string;
    timestamp: string;
  };
}

export function getApiErrorMessage(err: unknown): string | undefined {
  const anyErr = err as any;
  const message =
    anyErr?.response?.data?.error?.message ??
    anyErr?.response?.data?.message ??
    anyErr?.message;

  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return undefined;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Auth APIs
export const authApi = {
  login: (data: LoginDto) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  register: (data: RegisterDto) => api.post<ApiResponse<AuthResponse>>('/auth/register', data),
};

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedOrders {
  data: Order[];
  meta: PaginationMeta;
}

// Orders APIs
export const ordersApi = {
  create: (data: CreateOrderDto) => api.post<ApiResponse<Order>>('/orders', data),
  getAll: (page = 1, limit = 10) =>
    api.get<ApiResponse<PaginatedOrders>>('/orders', { params: { page, limit } }),
  getById: (id: string) => api.get<ApiResponse<Order>>(`/orders/${id}`),
  track: (trackingNumber: string) => api.get<ApiResponse<Order>>(`/orders/track/${trackingNumber}`),
  updateStatus: (id: string, status: Order['status']) =>
    api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  cancel: (id: string) => api.patch<ApiResponse<Order>>(`/orders/${id}/cancel`),
};

export default api;
