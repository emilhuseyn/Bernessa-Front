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
const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

const formatDateLabel = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('az-Latn-AZ', {
    day: '2-digit',
    month: 'short',
  });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('az-Latn-AZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatMonthLabel = (year: number, month: number, fallbackName: string) => {
  if (!year || !month) {
    return fallbackName || 'Naməlum';
  }
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('az-Latn-AZ', {
    month: 'short',
    year: 'numeric',
  });
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await adminService.getDashboard();
        if (active) {
          setAnalytics(data);
        }
      } catch (err) {
        if (active) {
          setError(handleApiError(err));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      active = false;
    };
  }, []);

  const revenueStats = useMemo(
    () => [
      {
        key: 'totalRevenue',
        title: 'Ümumi gəlir',
        value: formatCurrency(analytics?.totalRevenue ?? 0),
        helper: 'İl boyu toplanan məbləğ',
        trend: analytics ? formatPercent(analytics.growthMetrics.revenueGrowthMonth) : undefined,
        bg: 'bg-emerald-50',
        color: 'text-emerald-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        key: 'todayRevenue',
        title: 'Bugünkü gəlir',
        value: formatCurrency(analytics?.todayRevenue ?? 0),
        helper: 'Günün toplam satışları',
        trend: analytics ? formatPercent(analytics.growthMetrics.revenueGrowthWeek) : undefined,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h4l3-3 4 8 3-4h4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 21h8" />
          </svg>
        ),
      },
      {
        key: 'monthRevenue',
        title: 'Aylıq gəlir',
        value: formatCurrency(analytics?.monthRevenue ?? 0),
        helper: 'Cari ay üzrə',
        trend: analytics ? formatPercent(analytics.growthMetrics.revenueGrowthMonth) : undefined,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 11V7a4 4 0 118 0v4M5 9h14l-1 12H6L5 9z" />
          </svg>
        ),
      },
      {
        key: 'averageOrderValue',
        title: 'Orta sifariş dəyəri',
        value: formatCurrency(analytics?.averageOrderValue ?? 0),
        helper: 'Məhsul səbəti göstəricisi',
        trend: analytics ? formatPercent(analytics.growthMetrics.averageOrderValueGrowth) : undefined,
        bg: 'bg-amber-50',
        color: 'text-amber-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M4 6h16" />
          </svg>
        ),
      },
    ],
    [analytics]
  );

  const operationsStats = useMemo(
    () => [
      {
        key: 'totalOrders',
        title: 'Ümumi sifarişlər',
        value: formatNumber(analytics?.totalOrders ?? 0),
        helper: 'Bütün dövr üzrə',
        trend: analytics ? formatPercent(analytics.growthMetrics.ordersGrowthMonth) : undefined,
        bg: 'bg-slate-50',
        color: 'text-slate-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14l-1 9H6l-1-9zM7 7l2-4h6l2 4" />
          </svg>
        ),
      },
      {
        key: 'todayOrders',
        title: 'Bugünkü sifarişlər',
        value: formatNumber(analytics?.todayOrders ?? 0),
        helper: '24 saat ərzində',
        trend: analytics ? formatPercent(analytics.growthMetrics.ordersGrowthWeek) : undefined,
        bg: 'bg-cyan-50',
        color: 'text-cyan-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M4 11h16M5 19h14l1-8H4l1 8z" />
          </svg>
        ),
      },
      {
        key: 'weekOrders',
        title: 'Həftəlik sifarişlər',
        value: formatNumber(analytics?.weekOrders ?? 0),
        helper: 'Son 7 gün',
        trend: analytics ? formatPercent(analytics.growthMetrics.ordersGrowthWeek) : undefined,
        bg: 'bg-indigo-50',
        color: 'text-indigo-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M19 3v4M3 9h18m-2 4H5m6 4H5m9 0h5" />
          </svg>
        ),
      },
      {
        key: 'yearOrders',
        title: 'İllik sifarişlər',
        value: formatNumber(analytics?.yearOrders ?? 0),
        helper: 'Son 12 ay',
        trend: analytics ? formatPercent(analytics.growthMetrics.ordersGrowthMonth) : undefined,
        bg: 'bg-rose-50',
        color: 'text-rose-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.656 0-3 .895-3 2s1.344 2 3 2 3 .895 3 2-1.344 2-3 2m0-8c1.11 0 2.08.402 2.6 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.6-1M4 6h16" />
          </svg>
        ),
      },
    ],
    [analytics]
  );

  const peopleAndInventoryStats = useMemo(
    () => [
      {
        key: 'totalCustomers',
        title: 'Müştərilər',
        value: formatNumber(analytics?.totalCustomers ?? 0),
        helper: `Yeni: ${formatNumber(analytics?.newCustomersMonth ?? 0)} / Geri qayıdan: ${formatNumber(analytics?.returningCustomers ?? 0)}`,
        bg: 'bg-teal-50',
        color: 'text-teal-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2m11-9a4 4 0 11-8 0 4 4 0 018 0zM23 21v-2a4 4 0 00-3-3.87" />
          </svg>
        ),
      },
      {
        key: 'totalProducts',
        title: 'Məhsullar',
        value: formatNumber(analytics?.totalProducts ?? 0),
        helper: `Aktiv: ${formatNumber(analytics?.activeProducts ?? 0)} / Passiv: ${formatNumber(analytics?.inactiveProducts ?? 0)}`,
        bg: 'bg-lime-50',
        color: 'text-lime-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18m-7 5h7" />
          </svg>
        ),
      },
      {
        key: 'totalCategories',
        title: 'Kateqoriyalar',
        value: formatNumber(analytics?.totalCategories ?? 0),
        helper: `Seçilmiş məhsullar: ${formatNumber(analytics?.featuredProducts ?? 0)}`,
        bg: 'bg-sky-50',
        color: 'text-sky-600',
        icon: (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10m-9 4h8m-7 4h6" />
          </svg>
        ),
      },
    ],
    [analytics]
  );

  const statusCards = useMemo(() => {
    if (!analytics) {
      return [];
    }

    const breakdown = analytics.orderStatusBreakdown;
    const config = [
      {
        key: 'pending',
        revenueKey: 'pendingRevenue',
        label: 'Gözləyir',
        tone: 'bg-amber-50 border border-amber-100',
        pill: 'bg-amber-100 text-amber-700',
      },
      {
        key: 'processing',
        revenueKey: 'processingRevenue',
        label: 'İşlənir',
        tone: 'bg-blue-50 border border-blue-100',
        pill: 'bg-blue-100 text-blue-700',
      },
      {
        key: 'shipped',
        revenueKey: 'shippedRevenue',
        label: 'Göndərilib',
        tone: 'bg-purple-50 border border-purple-100',
        pill: 'bg-purple-100 text-purple-700',
      },
      {
        key: 'delivered',
        revenueKey: 'deliveredRevenue',
        label: 'Çatdırılıb',
        tone: 'bg-emerald-50 border border-emerald-100',
        pill: 'bg-emerald-100 text-emerald-700',
      },
      {
        key: 'cancelled',
        revenueKey: 'cancelledRevenue',
        label: 'Ləğv edilib',
        tone: 'bg-rose-50 border border-rose-100',
        pill: 'bg-rose-100 text-rose-700',
      },
    ] as const;

    return config.map((item) => ({
      key: item.key,
      label: item.label,
      tone: item.tone,
      pill: item.pill,
      count: breakdown[item.key] ?? 0,
      revenue: breakdown[item.revenueKey] ?? 0,
    }));
  }, [analytics]);

  const paymentMethods = analytics?.paymentMethodStats ?? [];
  const maxPaymentRevenue = Math.max(1, ...paymentMethods.map((item) => item.totalRevenue));

  const last7Days = analytics?.last7DaysRevenue ?? [];
  const maxDailyRevenue = Math.max(1, ...last7Days.map((day) => day.revenue));

  const last12Months = analytics?.last12MonthsRevenue ?? [];
  const maxMonthlyRevenue = Math.max(1, ...last12Months.map((item) => item.revenue));

  const topCategories = analytics?.topCategories ?? [];
  const topSelling = (analytics?.topSellingProducts ?? []).slice(0, 5);
  const topRevenue = (analytics?.topRevenueProducts ?? []).slice(0, 5);
  const pendingOrders = (analytics?.pendingOrders ?? []).slice(0, 6);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analitika Mərkəzi</h1>
        <p className="text-sm text-gray-500 mt-1">Satışlar, sifarişlər və performans üzrə detallı göstəricilər</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {revenueStats.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  {stat.trend && <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{stat.trend}</span>}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-2 leading-snug">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {operationsStats.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  {stat.trend && <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{stat.trend}</span>}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-2 leading-snug">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {peopleAndInventoryStats.map((stat) => (
              <div key={stat.key} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-2 leading-snug">{stat.helper}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 xl:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Sifariş statusları</h2>
                <span className="text-sm text-gray-500">Ümumi sifariş: {formatNumber(analytics?.totalOrders ?? 0)}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {statusCards.map((status) => (
                  <div key={status.key} className={`rounded-2xl p-4 ${status.tone} bg-opacity-60`}> 
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900 capitalize">{status.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${status.pill}`}>{formatNumber(status.count)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Gəlir: <span className="font-semibold text-gray-700">{formatCurrency(status.revenue)}</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Ödəniş metodları</h2>
                <span className="text-sm text-gray-500">{formatNumber(paymentMethods.reduce((sum, item) => sum + item.orderCount, 0))} sifariş</span>
              </div>
              <div className="space-y-4">
                {paymentMethods.length === 0 ? (
                  <p className="text-sm text-gray-500">Ödəniş statistikası hələ mövcud deyil</p>
                ) : (
                  paymentMethods.map((method) => (
                    <div key={method.paymentMethod}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">{method.paymentMethod}</span>
                        <span className="text-xs font-medium text-gray-500">{formatPercent(method.percentage)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                            style={{ width: `${Math.max(2, (method.totalRevenue / maxPaymentRevenue) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{formatCurrency(method.totalRevenue)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Son 7 gün</h2>
                <span className="text-sm text-gray-500">{formatCurrency(last7Days.reduce((sum, day) => sum + day.revenue, 0))}</span>
              </div>
              <div className="space-y-4">
                {last7Days.length === 0 ? (
                  <p className="text-sm text-gray-500">Tarixi məlumat yoxdur</p>
                ) : (
                  last7Days.map((day) => (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="w-16 text-sm font-medium text-gray-600">{formatDateLabel(day.date)}</div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="h-2 rounded-full bg-gray-100 flex-1 overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${Math.max(2, (day.revenue / maxDailyRevenue) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{formatCurrency(day.revenue)}</span>
                      </div>
                      <div className="w-14 text-right text-xs text-gray-400">{formatNumber(day.orderCount)} sif.</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Son 12 ay</h2>
                <span className="text-sm text-gray-500">Toplam {formatCurrency(last12Months.reduce((sum, item) => sum + item.revenue, 0))}</span>
              </div>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {last12Months.length === 0 ? (
                  <p className="text-sm text-gray-500">Aylıq təhlil mövcud deyil</p>
                ) : (
                  last12Months.map((item) => (
                    <div key={`${item.year}-${item.month}`} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-600">
                        {formatMonthLabel(item.year, item.month, item.monthName)}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <div className="h-2 rounded-full bg-gray-100 flex-1 overflow-hidden">
                          <div
                            className="h-full bg-primary-400 rounded-full"
                            style={{ width: `${Math.max(2, (item.revenue / maxMonthlyRevenue) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{formatCurrency(item.revenue)}</span>
                      </div>
                      <div className="w-16 text-right text-xs text-gray-400">{formatNumber(item.orderCount)} sif.</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Kateqoriya performansı</h2>
              {topCategories.length === 0 ? (
                <p className="text-sm text-gray-500">Kateqoriya üzrə statistika mövcud deyil</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="pb-3">Kateqoriya</th>
                        <th className="pb-3">Məhsul</th>
                        <th className="pb-3">Satış</th>
                        <th className="pb-3">Sifariş</th>
                        <th className="pb-3 text-right">Gəlir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topCategories.map((category) => (
                        <tr key={category.categoryId} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 font-medium text-gray-900">{category.categoryName}</td>
                          <td className="py-3 text-gray-500">{formatNumber(category.productCount)}</td>
                          <td className="py-3 text-gray-500">{formatNumber(category.totalSold)}</td>
                          <td className="py-3 text-gray-500">{formatNumber(category.orderCount)}</td>
                          <td className="py-3 text-gray-900 text-right font-semibold">{formatCurrency(category.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Top məhsullar</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Satışa görə</h3>
                  <div className="space-y-4">
                    {topSelling.length === 0 ? (
                      <p className="text-sm text-gray-500">Məlumat yoxdur</p>
                    ) : (
                      topSelling.map((product, index) => (
                        <div key={`${product.id}-selling`} className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 font-semibold">#{index + 1}</div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{formatNumber(product.salesCount)} satış · {product.brand ?? 'Naməlum brend'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Gəlirə görə</h3>
                  <div className="space-y-4">
                    {topRevenue.length === 0 ? (
                      <p className="text-sm text-gray-500">Məlumat yoxdur</p>
                    ) : (
                      topRevenue.map((product, index) => (
                        <div key={`${product.id}-revenue`} className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-semibold">#{index + 1}</div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.categoryName ?? 'Naməlum kateqoriya'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                            {product.price !== undefined && product.price > 0 && (
                              <p className="text-xs text-gray-400">Qiymət: {formatCurrency(product.price)}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Gözləyən sifarişlər</h2>
                <span className="text-sm text-gray-500">Toplam {formatNumber(analytics?.orderStatusBreakdown.pending ?? 0)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="pb-3">Sifariş №</th>
                      <th className="pb-3">Müştəri</th>
                      <th className="pb-3">Məbləğ</th>
                      <th className="pb-3">Tarix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingOrders.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-sm text-gray-500">Hazırda gözləyən sifariş yoxdur</td>
                      </tr>
                    ) : (
                      pendingOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 font-semibold text-gray-900">{order.orderNumber}</td>
                          <td className="py-3 text-gray-500">{order.customerName}</td>
                          <td className="py-3 text-gray-900 font-semibold">{formatCurrency(order.totalAmount)}</td>
                          <td className="py-3 text-gray-400 text-xs">{formatDateTime(order.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
