import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import { useThemeStore } from '../../store/themeStore';

export default function AdminHeader() {
  const navigate = useNavigate();
  const { admin, adminLogout, toggleSidebar, sidebarOpen } = useAdminStore();
  const { isDark, toggleTheme } = useThemeStore();

  const avatar = admin?.avatar || 'https://ui-avatars.com/api/?name=Admin&background=312e81&color=fff';

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 transition-[left,width] duration-300 ease-out ${
        sidebarOpen ? 'lg:left-72' : 'lg:left-20'
      }`}
    >
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-xl transition-colors duration-200 dark:border-slate-800/60 dark:bg-slate-950/70 sm:px-6">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Sidebar menyunu aç"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Görünüş rejimini dəyiş"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-primary-200"
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

 

            <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />

            <div className="relative group/profile">
              <button
                type="button"
                className="flex items-center gap-3 rounded-xl px-1.5 py-1 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:hover:bg-slate-800"
              >
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold leading-tight text-slate-700 dark:text-slate-100">
                    {admin?.name}
                  </p>
                  <p className="text-xs capitalize text-slate-400 dark:text-slate-500">{admin?.role}</p>
                </div>
                <img
                  src={avatar}
                  alt={admin?.name ?? 'Admin'}
                  className="h-9 w-9 rounded-lg border border-transparent object-cover shadow-sm transition-all group-hover/profile:border-primary-200 dark:group-hover/profile:border-primary-500/40"
                />
                <svg className="h-4 w-4 text-slate-400 transition-colors group-hover/profile:text-slate-600 dark:group-hover/profile:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="invisible absolute right-0 z-50 mt-4 w-56 origin-top-right rounded-2xl border border-slate-200/70 bg-white/95 p-2 opacity-0 shadow-xl backdrop-blur transition-all duration-200 group-hover/profile:visible group-hover/profile:opacity-100 dark:border-slate-800/70 dark:bg-slate-950/90">
                <div className="border-b border-slate-100/70 px-3 py-2 pb-3 dark:border-slate-800/70">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">Hesabım</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{admin?.email}</p>
                </div>
                 
                <div className="my-1 h-px bg-slate-100/70 dark:bg-slate-800/70" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  Çıxış
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
