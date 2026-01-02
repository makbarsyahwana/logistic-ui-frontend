import React, { useState } from 'react';
import { Search, Loader2, Package } from 'lucide-react';
import Layout from '@/components/Layout';
import OrderCard from '@/components/OrderCard';
import { getApiErrorMessage, ordersApi, Order } from '@/lib/api';

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError('');
    setOrder(null);
    setSearched(true);

    try {
      const response = await ordersApi.track(trackingNumber.trim());
      setOrder(response.data.data);
    } catch (err: any) {
      setError(getApiErrorMessage(err) || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!trackingNumber.trim()) return;
    setIsLoading(true);
    try {
      const response = await ordersApi.track(trackingNumber.trim());
      setOrder(response.data.data);
    } catch (err: any) {
      setError(getApiErrorMessage(err) || 'Order not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Track Your Shipment</h1>
          <p className="mt-2 text-gray-600">Enter your tracking number to see the current status</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g., TRK-XXXXXXXX)"
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !trackingNumber.trim()}
              className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {searched && !isLoading && !order && !error && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No order found</h3>
            <p className="text-gray-500">Please check your tracking number and try again</p>
          </div>
        )}

        {order && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Tracking Result</h2>
            <OrderCard order={order} onUpdate={handleRefresh} />
          </div>
        )}
      </div>
    </Layout>
  );
}
