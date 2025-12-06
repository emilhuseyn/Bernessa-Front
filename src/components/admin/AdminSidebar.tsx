import { NavLink } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import type { ReactNode } from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  {
    name: 'İdarə Paneli',
    path: '/admin',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
      </svg>
    ),
  },
  {
    name: 'Məhsullar',
    path: '/admin/products',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    name: 'Kateqoriyalar',
    path: '/admin/categories',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    name: 'Sifarişlər',
    path: '/admin/orders',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Tənzimləmələr',
    path: '/admin/settings',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const { sidebarOpen, toggleSidebar } = useAdminStore();
  const isExpanded = sidebarOpen;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 border-r border-slate-200/70 bg-white/90 text-slate-700 backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-800/60 dark:bg-slate-950/80 dark:text-slate-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isExpanded ? 'Yan menyunu daralt' : 'Yan menyunu genişləndir'}
          className="absolute hidden lg:flex top-20 -right-3 h-8 w-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors duration-200 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-slate-200/70 px-5 pt-6 pb-5 dark:border-slate-800/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm shadow-primary-500/30">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div
              className={`origin-left transition-all duration-200 ${
                isExpanded ? 'pointer-events-auto opacity-100 translate-x-0' : 'pointer-events-none opacity-0 -translate-x-2'
              }`}
            >
              <p className="text-base font-semibold text-slate-900 dark:text-white">Admin Panel</p>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Nəzarət mərkəzi</p>
            </div>
          </div>

          <nav className="custom-scrollbar flex-1 space-y-1.5 px-3 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => {
                  const baseClasses = [
                    'group relative flex items-center rounded-xl border border-transparent text-sm font-medium transition-all duration-200',
                    isExpanded ? 'gap-3 px-3 py-2.5' : 'px-2 py-2 justify-center',
                    'text-slate-500 hover:bg-slate-100/60 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-primary-200',
                  ];

                  if (isActive) {
                    baseClasses.push(
                      'border-primary-500/30 bg-primary-500/10 text-primary-600 shadow-sm dark:border-primary-500/30 dark:bg-primary-500/15 dark:text-primary-200'
                    );
                  }

                  return baseClasses.join(' ');
                }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-2 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                    )}
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-500/20 text-primary-600 dark:bg-primary-500/20 dark:text-primary-200'
                          : 'bg-white/40 text-slate-500 group-hover:bg-primary-500/10 group-hover:text-primary-600 dark:bg-slate-900/50 dark:text-slate-400 dark:group-hover:text-primary-200'
                      }`}
                    >
                      {item.icon}
                    </div>
                    {isExpanded && (
                      <span className="text-sm font-medium text-slate-700 transition-opacity duration-200 dark:text-slate-100">
                        {item.name}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200/70 bg-white/70 px-4 pb-6 pt-4 dark:border-slate-800/60 dark:bg-slate-950/60">
            <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'}`}>
              <div className="relative">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User&background=312e81&color=fff"
                  alt="Admin User"
                  className="h-10 w-10 rounded-full border border-white/70 object-cover shadow-sm dark:border-slate-900"
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 dark:border-slate-950"></span>
              </div>
              {isExpanded && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">Admin User</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">Super Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
