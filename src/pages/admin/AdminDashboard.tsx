import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { LoadingSpinner } from '../../components/ui/Loading';
import { adminService } from '../../services';
import type { DashboardAnalytics } from '../../services/adminService';
import { handleApiError } from '../../utils/errorHandler';

const currencyFormatter = new Intl.NumberFormat('az-Latn-AZ', {
  style: 'currency',
  currency: 'AZN',
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('az-Latn-AZ');

const formatCurrency = (value: number) => currencyFormatter.format(value);
const formatNumber = (value: number) => numberFormatter.format(value);

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Naməlum tarix';
  }

  return date.toLocaleString('az-Latn-AZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getAvatarFallback = (name: string) => {
  if (!name) {
    return '??';
  }

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminService.getDashboard();
        if (isMounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(handleApiError(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        key: 'totalRevenue',
        title: 'Ümumi Gəlir',
        value: formatCurrency(dashboard?.totalRevenue ?? 0),
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        key: 'todayOrders',
        title: 'Bugünkü Sifarişlər',
        value: formatNumber(dashboard?.todayOrders ?? 0),
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      },
      {
        key: 'totalCustomers',
        title: 'Müştərilər',
        value: formatNumber(dashboard?.totalCustomers ?? 0),
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
      },
      {
        key: 'totalProducts',
        title: 'Məhsullar',
        value: formatNumber(dashboard?.totalProducts ?? 0),
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      },
    ],
    [dashboard]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'processing':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
      case 'shipped':
        return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
      case 'pending':
      case 'created':
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'cancelled':
      case 'refunded':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-100 dark:border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
        return 'Çatdırılıb';
      case 'processing':
        return 'İşlənir';
      case 'shipped':
        return 'Göndərilib';
      case 'pending':
      case 'created':
        return 'Gözləyir';
      case 'cancelled':
        return 'Ləğv edilib';
      case 'refunded':
        return 'Geri ödəniş';
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İdarə Paneli</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Biznesinizin ümumi vəziyyəti və statistikası</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/20 dark:text-rose-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Son Sifarişlər</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sifariş №</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Müştəri</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Məbləğ</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tarix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {(dashboard?.recentOrders?.length ?? 0) === 0 ? (
                        <tr>
                          <td className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400" colSpan={5}>
                            Hələ sifariş daxil olmayıb
                          </td>
                        </tr>
                      ) : (
                        dashboard?.recentOrders?.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.orderNumber}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
                                  {getAvatarFallback(order.customerName)}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{order.customerName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">{formatDateTime(order.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden h-full">
                <div className="p-6 border-b border-gray-50 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Məhsullar</h2>
                </div>
                <div className="p-6 space-y-6">
                  {(dashboard?.topProducts?.length ?? 0) === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hələ top məhsul statistikası yoxdur</p>
                  ) : (
                    dashboard?.topProducts?.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4 group">
                        <div className="relative">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-100 dark:ring-gray-700 group-hover:ring-primary-100 dark:group-hover:ring-primary-900 transition-all"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {getAvatarFallback(product.name)}
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(product.salesCount)} satış</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
