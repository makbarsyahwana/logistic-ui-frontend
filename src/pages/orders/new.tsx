import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import OrderForm from '@/components/OrderForm';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function NewOrderPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) {
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
              <p className="text-gray-600">Fill in the shipment details below</p>
            </div>
          </div>

          <OrderForm />
        </div>
      </div>
    </Layout>
  );
}
