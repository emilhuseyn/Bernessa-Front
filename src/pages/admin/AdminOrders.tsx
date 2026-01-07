import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { orderService } from '../../services';
import type { OrderSummary } from '../../services';
import { handleApiError } from '../../utils/errorHandler';
import { Button } from '../../components/ui/Button';

type OrderStatusOption = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type OrderFilterStatus = 'all' | OrderStatusOption;

const STATUS_FILTERS: Array<{ value: OrderFilterStatus; label: string }> = [
  { value: 'all', label: 'Hamısı' },
  { value: 'pending', label: 'Gözləyir' },
  { value: 'processing', label: 'İşlənir' },
  { value: 'shipped', label: 'Göndərilib' },
  { value: 'delivered', label: 'Çatdırılıb' },
  { value: 'cancelled', label: 'Ləğv edilib' },
];

const STATUS_BADGE_MAP: Record<OrderStatusOption, { label: string; color: string }> = {
  pending: { label: 'Gözləyir', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' },
  processing: { label: 'İşlənir', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' },
  shipped: { label: 'Göndərilib', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30' },
  delivered: { label: 'Çatdırılıb', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' },
  cancelled: { label: 'Ləğv edilib', color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30' },
};

const STATUS_API_VALUES: Record<OrderStatusOption, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 4,
};

export default function AdminOrders() {
  const [selectedStatus, setSelectedStatus] = useState<OrderFilterStatus>('all');
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null);
  const [actionMenuOrderId, setActionMenuOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllAdmin();
      setOrders(data);
    } catch (err) {
      setOrders([]);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleActionMenu = (orderId: string) => {
    setActionMenuOrderId((current) => (current === orderId ? null : orderId));
  };

  useEffect(() => {
    if (!actionMenuOrderId) {
      return;
    }

    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-order-actions]')) {
        setActionMenuOrderId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActionMenuOrderId(null);
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [actionMenuOrderId]);

  const getStatusBadge = (status?: string) => {
    const key = (status ?? '').toLowerCase() as OrderStatusOption;
    if (STATUS_BADGE_MAP[key]) {
      return STATUS_BADGE_MAP[key];
    }
    return { label: status ?? 'Bilinmir', color: 'bg-gray-50 text-gray-600 border-gray-200' };
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return 'Tarix mövcud deyil';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString('az-AZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (selectedStatus !== 'all') {
      result = orders.filter((order) => (order.status ?? '').toLowerCase() === selectedStatus);
    }
    // Sort by date descending (newest first)
    return [...result].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders, selectedStatus]);

  const totalOrdersText = useMemo(() => {
    const currentCount = filteredOrders.length;
    if (selectedStatus === 'all') {
      return `Cəmi sifariş: ${currentCount}`;
    }
    const label = STATUS_FILTERS.find((f) => f.value === selectedStatus)?.label ?? '';
    return `${label}: ${currentCount}`;
  }, [filteredOrders, selectedStatus]);

  const closeDetails = () => setSelectedOrder(null);

  const handleStatusChange = async (
    order: OrderSummary,
    nextStatus: OrderStatusOption,
    options: { closeMenu?: boolean } = {}
  ) => {
    const previousStatus = order.status;
    if ((previousStatus ?? '').toLowerCase() === nextStatus) {
      if (options.closeMenu) {
        setActionMenuOrderId(null);
      }
      return;
    }

    const orderId = order.id;
    setOrders((prev) => prev.map((item) => (item.id === orderId ? { ...item, status: nextStatus } : item)));
    setSelectedOrder((current) =>
      current && current.id === orderId ? { ...current, status: nextStatus } : current
    );

    try {
      const statusPayload = STATUS_API_VALUES[nextStatus];
      const updatedOrder = await orderService.updateStatus(orderId, { status: statusPayload });
      const normalizedStatusKey = (updatedOrder.status ?? '').toLowerCase();

      setOrders((prev) => {
        return prev.map((item) => (item.id === orderId ? updatedOrder : item));
      });

      setSelectedOrder((current) => {
        if (!current || current.id !== orderId) {
          return current;
        }
        if (selectedStatus !== 'all' && normalizedStatusKey !== selectedStatus) {
          return null;
        }
        return updatedOrder;
      });

      if (options.closeMenu) {
        setActionMenuOrderId(null);
      }

      if (selectedStatus !== 'all' && normalizedStatusKey !== selectedStatus) {
        closeDetails();
      }
    } catch (err) {
      setError(handleApiError(err));
      setOrders((prev) =>
        prev.map((item) => (item.id === orderId ? { ...item, status: previousStatus } : item))
      );
      setSelectedOrder((current) =>
        current && current.id === orderId ? { ...current, status: previousStatus } : current
      );
      if (options.closeMenu) {
        setActionMenuOrderId(null);
      }
    }
  };
  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sifariş İdarəetməsi</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sifarişləri izləyin və idarə edin</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{totalOrdersText}</p>
      </div>

      {/* Status Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-8">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedStatus === filter.value
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-900/20 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Sifarişlər yüklənir...
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);
          const totalDisplay =
            typeof order.totalAmount === 'number' ? `${order.totalAmount.toFixed(2)} AZN` : 'Məbləğ yoxdur';
          const customerPhone = order.customerPhone || 'Telefon qeyd olunmayıb';
          const shippingAddress = order.shippingAddress || 'Ünvan qeyd olunmayıb';
          return (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{order.orderNumber}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Müştəri</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName || 'Ad yoxdur'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Telefon</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Ünvan</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-line">{shippingAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Tarix</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13l-1.2 6h12.4M7 13L5.4 5M17 17a2 2 0 11-4 0" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Məhsul sayı</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.items.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex flex-col items-end gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-gray-700 pt-4 lg:pt-0 lg:pl-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ümumi məbləğ</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalDisplay}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ödəniş üsulu: {order.paymentMethod ?? 'Naməlum'}</p>
                  </div>
                  
                  <div className="flex gap-2 w-full lg:w-auto items-start" data-order-actions>
                    <button
                        type="button"
                      className="flex-1 lg:flex-none px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionMenuOrderId(null);
                        }}
                    >
                      Detallar
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                        onClick={() => toggleActionMenu(order.id)}
                        aria-haspopup="menu"
                        aria-expanded={actionMenuOrderId === order.id}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {actionMenuOrderId === order.id && (
                        <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 shadow-xl">
                          <button
                            type="button"
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActionMenuOrderId(null);
                            }}
                          >
                            <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 20l4-16a2 2 0 012-1h4a2 2 0 012 1l4 16" />
                            </svg>
                            Detallara bax
                          </button>
                          <div className="mt-2 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/50 p-2">
                            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Statusu dəyiş</p>
                            <div className="mt-2 flex flex-col gap-1">
                              {(Object.keys(STATUS_BADGE_MAP) as OrderStatusOption[]).map((statusKey) => {
                                const isActive = (order.status ?? '').toLowerCase() === statusKey;
                                return (
                                  <button
                                    key={statusKey}
                                    type="button"
                                    className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                                      isActive
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 cursor-default'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'
                                    }`}
                                    disabled={isActive}
                                    onClick={() => handleStatusChange(order, statusKey, { closeMenu: true })}
                                  >
                                    {STATUS_BADGE_MAP[statusKey].label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sifariş tapılmadı</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Seçdiyiniz statusda heç bir sifariş yoxdur</p>
        </div>
      )}

      {selectedOrder && (() => {
        const currentOrder = selectedOrder;
        const detailBadge = getStatusBadge(currentOrder.status);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-gray-800 shadow-2xl">
              <button
                type="button"
                onClick={closeDetails}
                className="absolute right-4 top-4 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-500"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

            <div className="px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-400 dark:text-gray-500">Sifariş</p>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{currentOrder.orderNumber}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Yaradılma: {formatDate(currentOrder.createdAt)}</p>
                </div>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${detailBadge.color}`}>
                  {detailBadge.label}
                </span>
              </div>
            </div>

            <div className="px-8 py-6 space-y-8 max-h-[70vh] overflow-y-auto">
              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Müştəri məlumatları</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ad</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">{currentOrder.customerName || 'Ad yoxdur'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Telefon</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">{currentOrder.customerPhone || 'Telefon qeyd olunmayıb'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white break-all">{currentOrder.customerEmail || 'Email qeyd olunmayıb'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ödəniş</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-white">{currentOrder.paymentMethod ?? 'Naməlum'}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Çatdırılma ünvanı</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{currentOrder.shippingAddress || 'Ünvan qeyd olunmayıb'}</p>
                </div>
                {currentOrder.customerNote && (
                  <div className="mt-4 rounded-2xl border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-800 dark:text-amber-300">
                    <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-2">Müştəri qeydi</p>
                    <p>{currentOrder.customerNote}</p>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Məhsullar ({currentOrder.items.length})</h3>
                <div className="space-y-3">
                  {currentOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-4 shadow-sm">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name ?? 'Məhsul'} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 dark:text-gray-500">Şəkil yoxdur</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name ?? 'Məhsul'}</p>
                          <div className="flex gap-2 mt-1">
                            {item.volume && <p className="text-xs text-gray-500 dark:text-gray-400">Həcm: {item.volume}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: {item.productId ?? 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                          <span>Miqdar: {item.quantity}</span>
                          <span>{((item.price ?? 0) * item.quantity).toFixed(2)} AZN</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Məbləğ</h3>
                <div className="space-y-2 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/50 p-4 text-sm text-gray-700 dark:text-gray-300">
                  {typeof currentOrder.subtotal === 'number' && (
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{currentOrder.subtotal.toFixed(2)} AZN</span>
                    </div>
                  )}
                  {typeof currentOrder.tax === 'number' && (
                    <div className="flex justify-between">
                      <span>Vergi</span>
                      <span>{currentOrder.tax.toFixed(2)} AZN</span>
                    </div>
                  )}
                  {typeof currentOrder.discount === 'number' && currentOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Endirim</span>
                      <span>-{currentOrder.discount.toFixed(2)} AZN</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 text-base font-semibold text-gray-900 dark:text-white">
                    <span>Cəmi</span>
                    <span>{(currentOrder.totalAmount ?? 0).toFixed(2)} AZN</span>
                  </div>
                </div>
                {currentOrder.deliveredAt && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Çatdırılma: {formatDate(currentOrder.deliveredAt)}</p>
                )}
              </section>
            </div>

              <div className="flex justify-end border-t border-gray-100 dark:border-gray-700 px-8 py-5">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS_BADGE_MAP) as OrderStatusOption[]).map((statusKey) => {
                      const isActive = (currentOrder.status ?? '').toLowerCase() === statusKey;
                      return (
                        <Button
                          key={statusKey}
                          type="button"
                          size="sm"
                          variant={isActive ? 'primary' : 'outline'}
                          disabled={isActive}
                          onClick={() => handleStatusChange(currentOrder, statusKey)}
                        >
                          {STATUS_BADGE_MAP[statusKey].label}
                        </Button>
                      );
                    })}
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={closeDetails}>
                    Bağla
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </AdminLayout>
  );
}
