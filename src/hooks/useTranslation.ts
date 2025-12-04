import { useLanguageStore, type Language } from '../store/languageStore';
import { translations, type TranslationKey } from '../i18n/translations';

export function useTranslation() {
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);
  
  const t = (key: TranslationKey): string => {
    return translations[currentLanguage as Language][key] || translations.az[key] || key;
  };
  
  return { t, currentLanguage };
}
