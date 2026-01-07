import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { contactSettingService } from '../../services/contactSettingService';
import type { ContactSetting, CreateContactSettingDTO, ContactSettingTranslation } from '../../types';
import { LoadingSpinner } from '../../components/ui/Loading';
import { useTranslation } from '../../hooks/useTranslation';
import { debouncedTranslate } from '../../utils/translateText';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api';

export default function AdminContactSettings() {
  const { t, currentLanguage } = useTranslation();
  const [settings, setSettings] = useState<ContactSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageViewModal, setImageViewModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateContactSettingDTO>({
    address: '',
    email: '',
    phone: '',
    whatsApp: '',
    instagram: '',
    workingHoursWeekdays: '',
    workingHoursSaturday: '',
    workingHoursSunday: '',
    supportDescription: '',
    latitude: '',
    longitude: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedInUrl: '',
    youTubeUrl: '',
    // English translations
    supportDescriptionEn: '',
    workingHoursWeekdaysEn: '',
    workingHoursSaturdayEn: '',
    workingHoursSundayEn: '',
    // Russian translations
    supportDescriptionRu: '',
    workingHoursWeekdaysRu: '',
    workingHoursSaturdayRu: '',
    workingHoursSundayRu: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update form when editing and language changes
  useEffect(() => {
    if (editingId && settings.length > 0) {
      const currentSetting = settings.find(s => s.id === editingId);
      if (currentSetting) {
        let enTranslation: ContactSettingTranslation | undefined;
        let ruTranslation: ContactSettingTranslation | undefined;
        
        if (currentSetting.translations) {
          if (Array.isArray(currentSetting.translations)) {
            // Array format
            enTranslation = currentSetting.translations.find(t => t.languageCode === 'en');
            ruTranslation = currentSetting.translations.find(t => t.languageCode === 'ru');
          } else if (typeof currentSetting.translations === 'object') {
            // Object format { az: {...}, en: {...}, ru: {...} }
            enTranslation = currentSetting.translations['en'];
            ruTranslation = currentSetting.translations['ru'];
          }
        }
        
        setFormData(prev => ({
          ...prev,
          // Keep non-translation fields as they are
          address: currentSetting.address,
          email: currentSetting.email,
          phone: currentSetting.phone,
          whatsApp: currentSetting.whatsApp || '',
          instagram: currentSetting.instagram || '',
          workingHoursWeekdays: currentSetting.workingHoursWeekdays || '',
          workingHoursSaturday: currentSetting.workingHoursSaturday || '',
          workingHoursSunday: currentSetting.workingHoursSunday || '',
          supportDescription: currentSetting.supportDescription || '',
          latitude: currentSetting.latitude || '',
          longitude: currentSetting.longitude || '',
          facebookUrl: currentSetting.facebookUrl || '',
          twitterUrl: currentSetting.twitterUrl || '',
          linkedInUrl: currentSetting.linkedInUrl || '',
          youTubeUrl: currentSetting.youTubeUrl || '',
          // Update translations
          supportDescriptionEn: enTranslation?.supportDescription || '',
          workingHoursWeekdaysEn: enTranslation?.workingHoursWeekdays || '',
          workingHoursSaturdayEn: enTranslation?.workingHoursSaturday || '',
          workingHoursSundayEn: enTranslation?.workingHoursSunday || '',
          supportDescriptionRu: ruTranslation?.supportDescription || '',
          workingHoursWeekdaysRu: ruTranslation?.workingHoursWeekdays || '',
          workingHoursSaturdayRu: ruTranslation?.workingHoursSaturday || '',
          workingHoursSundayRu: ruTranslation?.workingHoursSunday || '',
        }));
      }
    }
  }, [editingId, settings, currentLanguage]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await contactSettingService.getAllContactSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching contact settings:', error);
      toast.error('Əlaqə parametrlərini yükləmək mümkün olmadı');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-translate Azerbaijani fields to English and Russian
    if (name === 'supportDescription' && value.trim()) {
      debouncedTranslate(value, (result) => {
        setFormData(prev => ({
          ...prev,
          supportDescriptionEn: result.en,
          supportDescriptionRu: result.ru,
        }));
      });
    } else if (name === 'workingHoursWeekdays' && value.trim()) {
      debouncedTranslate(value, (result) => {
        setFormData(prev => ({
          ...prev,
          workingHoursWeekdaysEn: result.en,
          workingHoursWeekdaysRu: result.ru,
        }));
      });
    } else if (name === 'workingHoursSaturday' && value.trim()) {
      debouncedTranslate(value, (result) => {
        setFormData(prev => ({
          ...prev,
          workingHoursSaturdayEn: result.en,
          workingHoursSaturdayRu: result.ru,
        }));
      });
    } else if (name === 'workingHoursSunday' && value.trim()) {
      debouncedTranslate(value, (result) => {
        setFormData(prev => ({
          ...prev,
          workingHoursSundayEn: result.en,
          workingHoursSundayRu: result.ru,
        }));
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, contactImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await contactSettingService.updateContactSetting(editingId, formData);
        toast.success('Əlaqə parametrləri uğurla yeniləndi');
      } else {
        await contactSettingService.createContactSetting(formData);
        toast.success('Əlaqə parametrləri uğurla yaradıldı');
      }
      
      setShowModal(false);
      resetForm();
      fetchSettings();
    } catch (error) {
      console.error('Error saving contact settings:', error);
      const message = error instanceof Error ? error.message : 'Əməliyyat uğursuz oldu';
      toast.error(message);
    }
  };

  const handleEdit = (setting: ContactSetting) => {
    setEditingId(setting.id);
    
    // Get English and Russian translations - handle both object and array format
    let enTranslation: ContactSettingTranslation | undefined;
    let ruTranslation: ContactSettingTranslation | undefined;
    
    if (setting.translations) {
      if (Array.isArray(setting.translations)) {
        // Array format
        enTranslation = setting.translations.find(t => t.languageCode === 'en');
        ruTranslation = setting.translations.find(t => t.languageCode === 'ru');
      } else if (typeof setting.translations === 'object') {
        // Object format { az: {...}, en: {...}, ru: {...} }
        enTranslation = setting.translations['en'];
        ruTranslation = setting.translations['ru'];
      }
    }
    
    setFormData({
      address: setting.address,
      email: setting.email,
      phone: setting.phone,
      whatsApp: setting.whatsApp || '',
      instagram: setting.instagram || '',
      workingHoursWeekdays: setting.workingHoursWeekdays || '',
      workingHoursSaturday: setting.workingHoursSaturday || '',
      workingHoursSunday: setting.workingHoursSunday || '',
      supportDescription: setting.supportDescription || '',
      latitude: setting.latitude || '',
      longitude: setting.longitude || '',
      facebookUrl: setting.facebookUrl || '',
      twitterUrl: setting.twitterUrl || '',
      linkedInUrl: setting.linkedInUrl || '',
      youTubeUrl: setting.youTubeUrl || '',
      // English translations
      supportDescriptionEn: enTranslation?.supportDescription || '',
      workingHoursWeekdaysEn: enTranslation?.workingHoursWeekdays || '',
      workingHoursSaturdayEn: enTranslation?.workingHoursSaturday || '',
      workingHoursSundayEn: enTranslation?.workingHoursSunday || '',
      // Russian translations
      supportDescriptionRu: ruTranslation?.supportDescription || '',
      workingHoursWeekdaysRu: ruTranslation?.workingHoursWeekdays || '',
      workingHoursSaturdayRu: ruTranslation?.workingHoursSaturday || '',
      workingHoursSundayRu: ruTranslation?.workingHoursSunday || '',
    });
    if (setting.contactImage) {
      setImagePreview(`${API_BASE_URL.replace('/api', '')}${setting.contactImage}`);
    }
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu əlaqə parametrlərini silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      await contactSettingService.deleteContactSetting(id);
      toast.success('Əlaqə parametrləri silindi');
      fetchSettings();
    } catch (error) {
      console.error('Error deleting contact settings:', error);
      toast.error('Silmə əməliyyatı uğursuz oldu');
    }
  };

  const resetForm = () => {
    setFormData({
      address: '',
      email: '',
      phone: '',
      whatsApp: '',
      instagram: '',
      workingHoursWeekdays: '',
      workingHoursSaturday: '',
      workingHoursSunday: '',
      supportDescription: '',
      latitude: '',
      longitude: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedInUrl: '',
      youTubeUrl: '',
      // English translations
      supportDescriptionEn: '',
      workingHoursWeekdaysEn: '',
      workingHoursSaturdayEn: '',
      workingHoursSundayEn: '',
      // Russian translations
      supportDescriptionRu: '',
      workingHoursWeekdaysRu: '',
      workingHoursSaturdayRu: '',
      workingHoursSundayRu: '',
    });
    setEditingId(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Əlaqə Parametrləri</h1>
          <p className="text-gray-600 dark:text-gray-400">Əlaqə məlumatlarını idarə edin</p>
        </div>
        {settings.length === 0 && (
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            + Yeni Əlaqə Əlavə Et
          </button>
        )}
      </div>

      {/* Settings List */}
      <div className="grid grid-cols-1 gap-6">
        {settings.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📞</div>
            <p className="text-gray-600 dark:text-gray-400">Heç bir əlaqə parametri tapılmadı</p>
          </div>
        ) : (
          settings.map((setting) => (
            <div
              key={setting.id}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {setting.contactImage && (
                    <img
                      src={`${API_BASE_URL.replace('/api', '')}${setting.contactImage}`}
                      alt="Contact"
                      className="w-20 h-20 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setImageViewModal(`${API_BASE_URL.replace('/api', '')}${setting.contactImage}`)}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {setting.address}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Email:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{setting.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Telefon:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{setting.phone}</span>
                      </div>
                      {setting.whatsApp && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">WhatsApp:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{setting.whatsApp}</span>
                        </div>
                      )}
                      {setting.instagram && (
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Instagram:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{setting.instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(setting)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Redaktə et"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(setting.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {setting.workingHoursWeekdays && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Həftə içi:</span>
                      <span className="text-gray-900 dark:text-white">{setting.workingHoursWeekdays}</span>
                    </div>
                  )}
                  {setting.workingHoursSaturday && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Şənbə:</span>
                      <span className="text-gray-900 dark:text-white">{setting.workingHoursSaturday}</span>
                    </div>
                  )}
                  {setting.workingHoursSunday && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block">Bazar:</span>
                      <span className="text-gray-900 dark:text-white">{setting.workingHoursSunday}</span>
                    </div>
                  )}
                </div>
                {setting.supportDescription && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{setting.supportDescription}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Əlaqə Parametrlərini Redaktə Et' : 'Yeni Əlaqə Əlavə Et'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ünvan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Bakı, Azərbaycan"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="info@company.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="+994 50 123 45 67"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsApp"
                    value={formData.whatsApp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="+994 55 765 43 21"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="@company"
                  />
                </div>

                {/* Working Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İş saatları (Həftə içi)
                  </label>
                  <input
                    type="text"
                    name="workingHoursWeekdays"
                    value={formData.workingHoursWeekdays}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="09:00 - 18:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İş saatları (Şənbə)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSaturday"
                    value={formData.workingHoursSaturday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="10:00 - 16:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İş saatları (Bazar)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSunday"
                    value={formData.workingHoursSunday}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Bağlı"
                  />
                </div>

                {/* Coordinates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enlem (Latitude)
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="40.4093"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uzunluq (Longitude)
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="49.8671"
                  />
                </div>

                {/* Social Media URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="https://linkedin.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youTubeUrl"
                    value={formData.youTubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="https://youtube.com/..."
                  />
                </div>

                {/* Support Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('admin.contact.supportDescriptionAz')}
                  </label>
                  <textarea
                    name="supportDescription"
                    value={formData.supportDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder={t('admin.contact.placeholderAz')}
                  />
                </div>

                {/* English Translations Section */}
                <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🇬🇧 English Translation
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Support Description (English)
                  </label>
                  <textarea
                    name="supportDescriptionEn"
                    value={formData.supportDescriptionEn}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Information about our customer service..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours - Weekdays (EN)
                  </label>
                  <input
                    type="text"
                    name="workingHoursWeekdaysEn"
                    value={formData.workingHoursWeekdaysEn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="09:00 AM - 06:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours - Saturday (EN)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSaturdayEn"
                    value={formData.workingHoursSaturdayEn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="10:00 AM - 04:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Working Hours - Sunday (EN)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSundayEn"
                    value={formData.workingHoursSundayEn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Closed"
                  />
                </div>

                {/* Russian Translations Section */}
                <div className="md:col-span-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🇷🇺 Русский перевод
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание поддержки (Русский)
                  </label>
                  <textarea
                    name="supportDescriptionRu"
                    value={formData.supportDescriptionRu}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Информация о нашей службе поддержки клиентов..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Часы работы - Будни (RU)
                  </label>
                  <input
                    type="text"
                    name="workingHoursWeekdaysRu"
                    value={formData.workingHoursWeekdaysRu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="09:00 - 18:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Часы работы - Суббота (RU)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSaturdayRu"
                    value={formData.workingHoursSaturdayRu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="10:00 - 16:00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Часы работы - Воскресенье (RU)
                  </label>
                  <input
                    type="text"
                    name="workingHoursSundayRu"
                    value={formData.workingHoursSundayRu}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Закрыто"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şəkil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-slate-700 dark:text-white"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
                >
                  {editingId ? 'Yenilə' : 'Əlavə et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {imageViewModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
          onClick={() => setImageViewModal(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setImageViewModal(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageViewModal}
              alt="Contact Image"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
