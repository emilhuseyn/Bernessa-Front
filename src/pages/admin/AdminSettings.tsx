import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';

export default function AdminSettings() {
  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isResetting, setIsResetting] = useState(false);

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Təhlükəsizlik</h1>
        <p className="text-gray-600 dark:text-gray-400">Admin şifrə və təhlükəsizlik tənzimləmələri</p>
      </div>

      {/* Security Settings */}
      <div className="space-y-6">
          {/* Reset Admin Password */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Admin Şifrəsini Sıfırla</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adminin emailini daxil edərək onun şifrəsini sıfırlaya bilərsiniz</p>
              </div>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              
              if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
                toast.error('Şifrələr uyğun gəlmir');
                return;
              }

              // Password strength validation
              const password = resetPasswordData.newPassword;
              
              if (password.length < 8) {
                toast.error('Şifrə ən azı 8 simvol olmalıdır');
                return;
              }

              if (!/[A-Z]/.test(password)) {
                toast.error('Şifrə ən azı 1 böyük hərf (A-Z) ehtiva etməlidir');
                return;
              }

              if (!/[a-z]/.test(password)) {
                toast.error('Şifrə ən azı 1 kiçik hərf (a-z) ehtiva etməlidir');
                return;
              }

              if (!/[0-9]/.test(password)) {
                toast.error('Şifrə ən azı 1 rəqəm (0-9) ehtiva etməlidir');
                return;
              }

              if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                toast.error('Şifrə ən azı 1 xüsusi simvol (!@#$%^&* və s.) ehtiva etməlidir');
                return;
              }

              setIsResetting(true);

              try {
                const token = localStorage.getItem('admin-token');
                const response = await axios.post(
                  `${API_BASE_URL}/auths/admin/reset-password`,
                  {
                    email: resetPasswordData.email,
                    newPassword: resetPasswordData.newPassword,
                    confirmPassword: resetPasswordData.confirmPassword
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      ...(token && { Authorization: `Bearer ${token}` })
                    }
                  }
                );

                if (response.data.success) {
                  toast.success('Şifrə uğurla sıfırlandı');
                  setResetPasswordData({ email: '', newPassword: '', confirmPassword: '' });
                } else {
                  toast.error(response.data.message || 'Şifrə sıfırlanarkən xəta baş verdi');
                }
              } catch (error: unknown) {
                let errorMessage = 'Şifrə sıfırlanarkən xəta baş verdi';
                if (error && typeof error === 'object' && 'response' in error) {
                  const axiosError = error as { response?: { data?: { message?: string } } };
                  errorMessage = axiosError.response?.data?.message || errorMessage;
                }
                toast.error(errorMessage);
              } finally {
                setIsResetting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İstifadəçi Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={resetPasswordData.email}
                  onChange={(e) => setResetPasswordData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifrə <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Ən azı 8 simvol"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şifrə Təsdiqi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={resetPasswordData.confirmPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Şifrəni təkrarlayın"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Diqqət!</strong> Bu əməliyyat geri qaytarıla bilməz. Adminin şifrəsi dəyişdiriləcək.
                </p>
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isResetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sıfırlanır...
                  </span>
                ) : (
                  'Şifrəni Sıfırla'
                )}
              </button>
            </form>
          </div>

          {/* Password Requirements */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl border border-purple-200 dark:border-purple-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🔒</span>
              Şifrə Tələbləri
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">✅</span>
                <span>Ən azı 8 simvol uzunluğunda olmalıdır</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">✅</span>
                <span>Ən azı 1 böyük hərf (A-Z) ehtiva etməlidir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">✅</span>
                <span>Ən azı 1 kiçik hərf (a-z) ehtiva etməlidir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">✅</span>
                <span>Ən azı 1 rəqəm (0-9) ehtiva etməlidir</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">✅</span>
                <span>Ən azı 1 xüsusi simvol (!@#$%^&* və s.) ehtiva etməlidir</span>
              </li>
            </ul>
          </div>
 
         
        </div>
    </AdminLayout>
  );
}
