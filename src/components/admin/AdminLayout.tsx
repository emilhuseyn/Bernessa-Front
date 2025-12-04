import type { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAdminStore } from '../../store/adminStore';
import { PageTransition } from '../layout/PageTransition';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const sidebarOpen = useAdminStore((state) => state.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-gray-900 transition-colors duration-300">
      <AdminSidebar />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <AdminHeader />
        
        <main className="pt-28 pb-8 px-6 lg:px-8">
          <div className="max-w-[1920px] mx-auto">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
