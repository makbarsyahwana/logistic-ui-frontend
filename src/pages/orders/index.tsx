import React from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getApiErrorMessage, ordersApi, Order, PaginatedOrders } from '@/lib/api';

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const ordersQuery = useQuery<PaginatedOrders>({
    queryKey: ['orders', 1, 50],
    enabled: !!user,
    queryFn: async () => {
      const response = await ordersApi.getAll(1, 50);
      return response.data.data;
    },
  });

  const orders: Order[] = ordersQuery.data?.data || [];
  const error = ordersQuery.error ? getApiErrorMessage(ordersQuery.error) || 'Failed to load orders' : '';
  const isLoading = ordersQuery.isLoading;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              Orders
            </h1>
            <p className="mt-1 text-gray-600">Manage and track all your shipment orders</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => ordersQuery.refetch()}
              disabled={ordersQuery.isFetching}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${ordersQuery.isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              New Order
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Create your first shipment order to get started</p>
            <Link
              href="/orders/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Create Order
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
