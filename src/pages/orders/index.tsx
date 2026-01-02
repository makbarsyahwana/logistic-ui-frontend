import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getApiErrorMessage, ordersApi, Order, PaginatedOrders } from '@/lib/api';

const STATUS_OPTIONS: Array<{ label: string; value: '' | Order['status'] }> = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Canceled', value: 'CANCELED' },
];

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useRequireAuth();

  const [status, setStatus] = useState<'' | Order['status']>('');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const ordersQuery = useQuery<PaginatedOrders>({
    queryKey: ['orders', page, limit, status, senderName, recipientName],
    enabled: !!user,
    queryFn: async () => {
      const response = await ordersApi.getAll({
        page,
        limit,
        status: status || undefined,
        senderName: senderName.trim() || undefined,
        recipientName: recipientName.trim() || undefined,
      });
      return response.data.data;
    },
  });

  const orders: Order[] = ordersQuery.data?.data || [];
  const meta = ordersQuery.data?.meta;
  const error = ordersQuery.error ? getApiErrorMessage(ordersQuery.error) || 'Failed to load orders' : '';
  const isLoading = ordersQuery.isLoading;

  useEffect(() => {
    setPage(1);
  }, [status, senderName, recipientName, limit]);

  useEffect(() => {
    if (!meta) return;
    if (page > meta.totalPages) {
      setPage(meta.totalPages || 1);
    }
  }, [meta, page]);

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

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as '' | Order['status'])}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || 'ALL'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name</label>
              <input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Search sender"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
              <input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Search recipient"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
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

        {meta && meta.totalPages > 0 && (
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-gray-600">
              {`Showing page ${meta.page} of ${meta.totalPages} (${meta.total} total)`}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={ordersQuery.isFetching || meta.page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-gray-700 min-w-[120px] text-center">
                Page {meta.page} / {meta.totalPages}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={ordersQuery.isFetching || meta.page >= meta.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
