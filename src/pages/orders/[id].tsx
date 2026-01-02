import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { getApiErrorMessage, ordersApi, Order } from '@/lib/api';

export default function OrderDetailPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const router = useRouter();
  const { id } = router.query;
  const isValidId = typeof id === 'string' && id.length > 0;

  const orderQuery = useQuery<Order>({
    queryKey: ['order', id],
    enabled: !!user && isValidId,
    queryFn: async () => {
      const response = await ordersApi.getById(id as string);
      return response.data.data;
    },
  });

  const order = orderQuery.data ?? null;
  const error = orderQuery.error ? getApiErrorMessage(orderQuery.error) || 'Order not found' : '';
  const isLoading = orderQuery.isLoading;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
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
        ) : order ? (
          <OrderCard order={order} />
        ) : null}
      </div>
    </Layout>
  );
}
