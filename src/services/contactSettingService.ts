import api from './api';
import type { ContactSetting, CreateContactSettingDTO } from '../types';

export const contactSettingService = {
  /**
   * Get active contact setting
   */
  getActiveContactSetting: async (): Promise<ContactSetting | null> => {
    try {
      return await api.get('/contactsettingses/active');
    } catch (error) {
      console.error('Error fetching active contact setting:', error);
      // Return null instead of throwing to allow graceful fallback
      return null;
    }
  },

  /**
   * Get contact setting by ID
   */
  getContactSettingById: async (id: number): Promise<ContactSetting> => {
    return api.get(`/contactsettingses/${id}`);
  },

  /**
   * Get all contact settings
   */
  getAllContactSettings: async (): Promise<ContactSetting[]> => {
    return api.get('/contactsettingses');
  },

  /**
   * Create new contact setting
   */
  createContactSetting: async (data: CreateContactSettingDTO): Promise<ContactSetting> => {
    const formData = new FormData();
    
    formData.append('Address', data.address);
    formData.append('Email', data.email);
    formData.append('Phone', data.phone);
    
    if (data.whatsApp) formData.append('WhatsApp', data.whatsApp);
    if (data.instagram) formData.append('Instagram', data.instagram);
    if (data.workingHoursWeekdays) formData.append('WorkingHoursWeekdays', data.workingHoursWeekdays);
    if (data.workingHoursSaturday) formData.append('WorkingHoursSaturday', data.workingHoursSaturday);
    if (data.workingHoursSunday) formData.append('WorkingHoursSunday', data.workingHoursSunday);
    if (data.supportDescription) formData.append('SupportDescription', data.supportDescription);
    if (data.contactImage) formData.append('ContactImage', data.contactImage);
    if (data.latitude) formData.append('Latitude', data.latitude);
    if (data.longitude) formData.append('Longitude', data.longitude);
    if (data.facebookUrl) formData.append('FacebookUrl', data.facebookUrl);
    if (data.twitterUrl) formData.append('TwitterUrl', data.twitterUrl);
    if (data.linkedInUrl) formData.append('LinkedInUrl', data.linkedInUrl);
    if (data.youTubeUrl) formData.append('YouTubeUrl', data.youTubeUrl);
    
    // English translations
    if (data.supportDescriptionEn) formData.append('SupportDescriptionEn', data.supportDescriptionEn);
    if (data.workingHoursWeekdaysEn) formData.append('WorkingHoursWeekdaysEn', data.workingHoursWeekdaysEn);
    if (data.workingHoursSaturdayEn) formData.append('WorkingHoursSaturdayEn', data.workingHoursSaturdayEn);
    if (data.workingHoursSundayEn) formData.append('WorkingHoursSundayEn', data.workingHoursSundayEn);
    
    // Russian translations
    if (data.supportDescriptionRu) formData.append('SupportDescriptionRu', data.supportDescriptionRu);
    if (data.workingHoursWeekdaysRu) formData.append('WorkingHoursWeekdaysRu', data.workingHoursWeekdaysRu);
    if (data.workingHoursSaturdayRu) formData.append('WorkingHoursSaturdayRu', data.workingHoursSaturdayRu);
    if (data.workingHoursSundayRu) formData.append('WorkingHoursSundayRu', data.workingHoursSundayRu);

    return api.post('/contactsettingses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Update contact setting
   */
  updateContactSetting: async (id: number, data: CreateContactSettingDTO): Promise<ContactSetting> => {
    const formData = new FormData();
    
    formData.append('Address', data.address);
    formData.append('Email', data.email);
    formData.append('Phone', data.phone);
    
    if (data.whatsApp) formData.append('WhatsApp', data.whatsApp);
    if (data.instagram) formData.append('Instagram', data.instagram);
    if (data.workingHoursWeekdays) formData.append('WorkingHoursWeekdays', data.workingHoursWeekdays);
    if (data.workingHoursSaturday) formData.append('WorkingHoursSaturday', data.workingHoursSaturday);
    if (data.workingHoursSunday) formData.append('WorkingHoursSunday', data.workingHoursSunday);
    if (data.supportDescription) formData.append('SupportDescription', data.supportDescription);
    if (data.contactImage) formData.append('ContactImage', data.contactImage);
    if (data.latitude) formData.append('Latitude', data.latitude);
    if (data.longitude) formData.append('Longitude', data.longitude);
    if (data.facebookUrl) formData.append('FacebookUrl', data.facebookUrl);
    if (data.twitterUrl) formData.append('TwitterUrl', data.twitterUrl);
    if (data.linkedInUrl) formData.append('LinkedInUrl', data.linkedInUrl);
    if (data.youTubeUrl) formData.append('YouTubeUrl', data.youTubeUrl);
    
    // English translations
    if (data.supportDescriptionEn) formData.append('SupportDescriptionEn', data.supportDescriptionEn);
    if (data.workingHoursWeekdaysEn) formData.append('WorkingHoursWeekdaysEn', data.workingHoursWeekdaysEn);
    if (data.workingHoursSaturdayEn) formData.append('WorkingHoursSaturdayEn', data.workingHoursSaturdayEn);
    if (data.workingHoursSundayEn) formData.append('WorkingHoursSundayEn', data.workingHoursSundayEn);
    
    // Russian translations
    if (data.supportDescriptionRu) formData.append('SupportDescriptionRu', data.supportDescriptionRu);
    if (data.workingHoursWeekdaysRu) formData.append('WorkingHoursWeekdaysRu', data.workingHoursWeekdaysRu);
    if (data.workingHoursSaturdayRu) formData.append('WorkingHoursSaturdayRu', data.workingHoursSaturdayRu);
    if (data.workingHoursSundayRu) formData.append('WorkingHoursSundayRu', data.workingHoursSundayRu);

    return api.put(`/contactsettingses/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Delete contact setting
   */
  deleteContactSetting: async (id: number): Promise<void> => {
    return api.delete(`/contactsettingses/${id}`);
  },
};

export default contactSettingService;
