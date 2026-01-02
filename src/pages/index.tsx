import React from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Search, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function HomePage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Create Order',
      description: 'Create a new shipment order',
      href: '/orders/new',
      icon: PlusCircle,
      color: 'bg-indigo-500',
    },
    {
      title: 'View Orders',
      description: 'Browse all your orders',
      href: '/orders',
      icon: Package,
      color: 'bg-emerald-500',
    },
    {
      title: 'Track Shipment',
      description: 'Track by tracking number',
      href: '/track',
      icon: Search,
      color: 'bg-amber-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your logistics operations from your dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                <div className="absolute top-6 right-6 text-gray-300 group-hover:text-indigo-400 transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
