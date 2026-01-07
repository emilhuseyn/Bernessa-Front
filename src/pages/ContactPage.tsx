import type { FC } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { useTranslation } from '../hooks/useTranslation';
import { contactSettingService } from '../services/contactSettingService';
import { LoadingSpinner } from '../components/ui/Loading';
import type { ContactSetting } from '../types';

export const ContactPage: FC = () => {
  const { t, currentLanguage } = useTranslation();
  const [contactSettings, setContactSettings] = useState<ContactSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        setLoading(true);
        const data = await contactSettingService.getActiveContactSetting();
        if (data) {
          setContactSettings(data);
          setError(null);
        } else {
          console.warn('No active contact settings found');
          setError(null); // Don't show error, just use fallback values
        }
      } catch (err) {
        console.error('Error fetching contact settings:', err);
        // Don't show error to user, just use fallback values
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactSettings();
  }, []);

  // Use fetched data or fallback to defaults
  const address = contactSettings?.address || t('contact.address');
  const email = contactSettings?.email || 'support@Barsense.az';
  const phone = contactSettings?.phone || '+994 50 123 45 67';
  const whatsapp = contactSettings?.whatsApp || '+994 55 765 43 21';
  const instagram = contactSettings?.instagram || '@Barsense.az';
  
  // Get translated fields based on current language - using useMemo for automatic updates
  const workingHoursWeekdays = useMemo(() => {
    if (currentLanguage === 'az' || !contactSettings?.translations) {
      return contactSettings?.workingHoursWeekdays || '09:00 - 18:00';
    }
    // Check if translations is an object (not array)
    if (typeof contactSettings.translations === 'object' && !Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations[currentLanguage];
      return translation?.workingHoursWeekdays || contactSettings?.workingHoursWeekdays || '09:00 - 18:00';
    }
    // If it's an array
    if (Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations.find(t => t.languageCode === currentLanguage);
      return translation?.workingHoursWeekdays || contactSettings?.workingHoursWeekdays || '09:00 - 18:00';
    }
    return contactSettings?.workingHoursWeekdays || '09:00 - 18:00';
  }, [contactSettings, currentLanguage]);

  const workingHoursSaturday = useMemo(() => {
    if (currentLanguage === 'az' || !contactSettings?.translations) {
      return contactSettings?.workingHoursSaturday || '10:00 - 16:00';
    }
    // Check if translations is an object (not array)
    if (typeof contactSettings.translations === 'object' && !Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations[currentLanguage];
      return translation?.workingHoursSaturday || contactSettings?.workingHoursSaturday || '10:00 - 16:00';
    }
    // If it's an array
    if (Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations.find(t => t.languageCode === currentLanguage);
      return translation?.workingHoursSaturday || contactSettings?.workingHoursSaturday || '10:00 - 16:00';
    }
    return contactSettings?.workingHoursSaturday || '10:00 - 16:00';
  }, [contactSettings, currentLanguage]);

  const workingHoursSunday = useMemo(() => {
    if (currentLanguage === 'az' || !contactSettings?.translations) {
      return contactSettings?.workingHoursSunday || t('contact.closed');
    }
    // Check if translations is an object (not array)
    if (typeof contactSettings.translations === 'object' && !Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations[currentLanguage];
      return translation?.workingHoursSunday || contactSettings?.workingHoursSunday || t('contact.closed');
    }
    // If it's an array
    if (Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations.find(t => t.languageCode === currentLanguage);
      return translation?.workingHoursSunday || contactSettings?.workingHoursSunday || t('contact.closed');
    }
    return contactSettings?.workingHoursSunday || t('contact.closed');
  }, [contactSettings, currentLanguage, t]);

  const supportDescription = useMemo(() => {
    if (currentLanguage === 'az' || !contactSettings?.translations) {
      return contactSettings?.supportDescription || t('contact.serviceDesc');
    }
    // Check if translations is an object (not array)
    if (typeof contactSettings.translations === 'object' && !Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations[currentLanguage];
      return translation?.supportDescription || contactSettings?.supportDescription || t('contact.serviceDesc');
    }
    // If it's an array
    if (Array.isArray(contactSettings.translations)) {
      const translation = contactSettings.translations.find(t => t.languageCode === currentLanguage);
      return translation?.supportDescription || contactSettings?.supportDescription || t('contact.serviceDesc');
    }
    return contactSettings?.supportDescription || t('contact.serviceDesc');
  }, [contactSettings, currentLanguage, t]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-8 text-center">{t('contact.title')}</h1>
              
              {error && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.info')}</h3>
                  <div className="space-y-4 text-gray-600">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>{address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <a href={`mailto:${email}`} className="hover:text-primary-600 transition-colors">{email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <a href={`tel:${phone}`} className="hover:text-primary-600 transition-colors">{phone}</a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.hours')}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('contact.weekdays')}</span>
                      <span className="font-medium">{workingHoursWeekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('contact.saturday')}</span>
                      <span className="font-medium">{workingHoursSaturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('contact.sunday')}</span>
                      <span className="font-medium">{workingHoursSunday}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.customerService')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {supportDescription}
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">{t('contact.phone')}</p>
                    <a href={`tel:${phone}`} className="mt-1 font-semibold text-gray-900 hover:text-primary-600 transition-colors block">{phone}</a>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Email</p>
                    <a href={`mailto:${email}`} className="mt-1 font-semibold text-gray-900 hover:text-primary-600 transition-colors block">{email}</a>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">{t('contact.whatsapp')}</p>
                    <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-1 font-semibold text-gray-900 hover:text-primary-600 transition-colors block">{whatsapp}</a>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-gray-500">{t('contact.instagram')}</p>
                    <a href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="mt-1 font-semibold text-primary-600 hover:text-primary-700 transition-colors block">{instagram}</a>
                  </div>
                </div>

                {/* Social Media Links */}
                {(contactSettings?.facebookUrl || contactSettings?.twitterUrl || contactSettings?.linkedInUrl || contactSettings?.youTubeUrl) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">{t('contact.followUs')}</p>
                    <div className="flex gap-4">
                      {contactSettings.facebookUrl && (
                        <a href={contactSettings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                      )}
                      {contactSettings?.twitterUrl && (
                        <a href={contactSettings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                      )}
                      {contactSettings?.linkedInUrl && (
                        <a href={contactSettings.linkedInUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
                      )}
                      {contactSettings?.youTubeUrl && (
                        <a href={contactSettings.youTubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-600 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Map section if coordinates are available */}
              {contactSettings?.latitude && contactSettings?.longitude && (
                <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('contact.location')}</h3>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps?q=${contactSettings.latitude},${contactSettings.longitude}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};