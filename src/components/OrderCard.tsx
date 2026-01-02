import React, { useState } from 'react';
import { MapPin, User, Calendar, Hash, Truck, XCircle, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage, Order, ordersApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { cn, formatDate, getStatusColor } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onUpdate?: () => void;
}

const STATUS_OPTIONS: Order['status'][] = ['PENDING', 'IN_TRANSIT', 'DELIVERED'];

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: Order['status']) => {
      await ordersApi.updateStatus(order.id, newStatus);
    },
    onSuccess: async () => {
      setActionError('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
        queryClient.invalidateQueries({ queryKey: ['order', order.id] }),
      ]);
      onUpdate?.();
    },
    onError: (err: unknown) => {
      setActionError(getApiErrorMessage(err) || 'Failed to update status');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await ordersApi.cancel(order.id);
    },
    onSuccess: async () => {
      setActionError('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
        queryClient.invalidateQueries({ queryKey: ['order', order.id] }),
      ]);
      onUpdate?.();
    },
    onError: (err: unknown) => {
      setActionError(getApiErrorMessage(err) || 'Failed to cancel order');
    },
  });

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (newStatus === order.status) return;
    updateStatusMutation.mutate(newStatus);
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    cancelMutation.mutate();
  };

  const canCancel = !!user && order.status === 'PENDING';
  const canUpdateStatus =
    !!user &&
    isAdmin &&
    order.status !== 'CANCELED' &&
    order.status !== 'DELIVERED';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {actionError && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {actionError}
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Hash className="w-4 h-4" />
            <span className="font-mono">{order.trackingNumber}</span>
          </div>
          <span className={cn('px-3 py-1 text-xs font-medium rounded-full', getStatusColor(order.status))}>
            {order.status.replace('_', ' ')}
          </span>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(order.createdAt)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sender</div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{order.senderName}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recipient</div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{order.recipientName}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Origin</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span>{order.origin}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Destination</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>{order.destination}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {canUpdateStatus && (
          <div className="flex items-center gap-2 flex-1">
            <Truck className="w-4 h-4 text-gray-400" />
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              disabled={updateStatusMutation.isPending}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
            {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
          </div>
        )}

        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            {cancelMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
