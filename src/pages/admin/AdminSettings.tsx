import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'shipping' | 'notifications'>('general');

  const tabs = [
    { id: 'general' as const, label: 'Ümumi', icon: '⚙️' },
    { id: 'payment' as const, label: 'Ödəniş', icon: '💳' },
    { id: 'shipping' as const, label: 'Çatdırılma', icon: '🚚' },
    { id: 'notifications' as const, label: 'Bildirişlər', icon: '🔔' },
  ];

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tənzimləmələr</h1>
        <p className="text-gray-600">Mağaza tənzimləmələrini idarə edin</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-2 mb-8 inline-flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-2xl font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mağaza Məlumatları</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mağaza Adı</label>
                  <input
                    type="text"
                    defaultValue="E-Commerce Store"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="info@ecommerce.az"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    defaultValue="+994501234567"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valyuta</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
                    <option>AZN (₼)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>TRY (₺)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ünvan</label>
                <textarea
                  rows={3}
                  defaultValue="Bakı şəhəri, Nizami küç. 123"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Haqqında</label>
                <textarea
                  rows={4}
                  defaultValue="Keyfiyyətli məhsullar və sürətli çatdırılma ilə xidmətinizdəyik."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Dəyişiklikləri Saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Ödəniş Üsulları</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Kart ilə ödəniş', enabled: true, icon: '💳' },
              { name: 'Nağd ödəniş', enabled: true, icon: '💵' },
              { name: 'Bank köçürməsi', enabled: false, icon: '🏦' },
              { name: 'PayPal', enabled: false, icon: '📱' },
            ].map((method) => (
              <div key={method.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium text-gray-900">{method.name}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-secondary-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Ödəniş Tənzimləmələrini Saxla
            </button>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Çatdırılma Tənzimləmələri</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standart çatdırılma müddəti (gün)</label>
                <input
                  type="number"
                  defaultValue="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sürətli çatdırılma müddəti (gün)</label>
                <input
                  type="number"
                  defaultValue="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standart çatdırılma qiyməti (₼)</label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pulsuz çatdırılma limiti (₼)</label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="font-medium text-gray-900">Sürətli çatdırılma</h3>
                <p className="text-sm text-gray-600">1 gün ərzində çatdırılma xidməti</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-secondary-600"></div>
              </label>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Çatdırılma Tənzimləmələrini Saxla
            </button>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Bildiriş Tənzimləmələri</h2>
          
          <div className="space-y-4">
            {[
              { name: 'Yeni sifariş bildirişləri', enabled: true },
              { name: 'Stok azalması bildirişləri', enabled: true },
              { name: 'Yeni rəy bildirişləri', enabled: true },
              { name: 'Gündəlik hesabat', enabled: false },
              { name: 'Həftəlik hesabat', enabled: true },
              { name: 'Aylıq hesabat', enabled: false },
            ].map((notification) => (
              <div key={notification.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="font-medium text-gray-900">{notification.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={notification.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-secondary-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Bildiriş Tənzimləmələrini Saxla
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
