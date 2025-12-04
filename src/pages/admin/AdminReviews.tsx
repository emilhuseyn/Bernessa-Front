import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

interface Review {
  id: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export default function AdminReviews() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | Review['status']>('all');

  const reviews: Review[] = [
    {
      id: '1',
      productName: 'Wireless Headphones',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      customerName: 'Nigar Əliyeva',
      customerAvatar: 'https://ui-avatars.com/api/?name=Nigar+Aliyeva&background=0ea5e9&color=fff',
      rating: 5,
      comment: 'Əla məhsuldur! Səs keyfiyyəti çox yüksəkdir və rahatdır. Tövsiyə edirəm!',
      date: '2024-12-01',
      status: 'approved',
    },
    {
      id: '2',
      productName: 'Smart Watch Pro',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      customerName: 'Rəşad Məmmədov',
      customerAvatar: 'https://ui-avatars.com/api/?name=Reshad+Mammadov&background=7c3aed&color=fff',
      rating: 4,
      comment: 'Yaxşı məhsuldur, lakin batareya ömrü daha uzun ola bilərdi.',
      date: '2024-12-01',
      status: 'pending',
    },
    {
      id: '3',
      productName: 'Laptop Stand',
      productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      customerName: 'Aysel Hüseynova',
      customerAvatar: 'https://ui-avatars.com/api/?name=Aysel+Huseynova&background=ec4899&color=fff',
      rating: 5,
      comment: 'Çox keyfiyyətli və davamlıdır. Ergonomik dizaynı çox xoşuma gəldi.',
      date: '2024-11-30',
      status: 'approved',
    },
    {
      id: '4',
      productName: 'Phone Case',
      productImage: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop',
      customerName: 'Elvin Quliyev',
      customerAvatar: 'https://ui-avatars.com/api/?name=Elvin+Guliyev&background=f59e0b&color=fff',
      rating: 2,
      comment: 'Keyfiyyəti gözləntilərimi ödəmədi. Material çox ucuzdur.',
      date: '2024-11-30',
      status: 'rejected',
    },
  ];

  const statusFilters: Array<{ value: 'all' | Review['status']; label: string; color: string }> = [
    { value: 'all', label: 'Hamısı', color: 'bg-gray-100 text-gray-700' },
    { value: 'approved', label: 'Təsdiqlənib', color: 'bg-green-100 text-green-700' },
    { value: 'pending', label: 'Gözləyir', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'rejected', label: 'Rədd edilib', color: 'bg-red-100 text-red-700' },
  ];

  const filteredReviews = selectedStatus === 'all'
    ? reviews
    : reviews.filter(review => review.status === selectedStatus);

  const getStatusBadge = (status: Review['status']) => {
    const statusConfig = {
      approved: { label: 'Təsdiqlənib', color: 'bg-green-100 text-green-700 border-green-200' },
      pending: { label: 'Gözləyir', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      rejected: { label: 'Rədd edilib', color: 'bg-red-100 text-red-700 border-red-200' },
    };
    return statusConfig[status];
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rəy İdarəetməsi</h1>
        <p className="text-gray-600">Müştəri rəylərini nəzərdən keçirin və idarə edin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{reviews.length}</h3>
              <p className="text-sm text-gray-600">Ümumi Rəy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">4.5</h3>
              <p className="text-sm text-gray-600">Orta Reytinq</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'approved').length}</h3>
              <p className="text-sm text-gray-600">Təsdiqlənib</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{reviews.filter(r => r.status === 'pending').length}</h3>
              <p className="text-sm text-gray-600">Gözləyir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-8">
        <div className="flex flex-wrap gap-3">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                selectedStatus === filter.value
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg scale-105'
                  : `${filter.color} hover:scale-105`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const badge = getStatusBadge(review.status);
          return (
            <div
              key={review.id}
              className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 lg:w-64">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.productName}</h3>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-10 h-10 rounded-xl ring-2 ring-gray-100"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString('az-AZ')}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  <button className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium whitespace-nowrap">
                    Təsdiqlə
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium whitespace-nowrap">
                    Rədd et
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
