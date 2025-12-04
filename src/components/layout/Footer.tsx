import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="relative mt-24 bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-900/20 rounded-full blur-3xl"></div>

      <div className="container-custom relative pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/20">
                  <span className="text-white font-display font-bold text-2xl">E</span>
                </div>
                <span className="text-2xl font-display font-bold text-white tracking-tight">Barsense</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                {t('footer.description')}
              </p>
            </div>

       
          </div>

  
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.customerService')}</h3>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors">{t('footer.shipping')}</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-primary-400 transition-colors">{t('footer.returns')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-primary-400 transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-lg mb-6">{t('footer.contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-400">
                <svg className="w-6 h-6 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Bakı şəhəri, Nizami küçəsi 123, AZ1000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-6 h-6 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>support@Barsense.az</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <svg className="w-6 h-6 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>+994 50 123 45 67</span>
              </div>
            </div>
            
            
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Barsense. {t('footer.allRightsReserved')}.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
