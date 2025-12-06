// Simple translation utility using MyMemory Translation API
// For production, consider using a proper translation service like Google Translate

interface TranslationResult {
  en: string;
  ru: string;
}

/**
 * Translates Azerbaijani text to English and Russian
 * Uses MyMemory Translation API (free, no API key required)
 */
export const translateFromAzerbaijani = async (text: string): Promise<TranslationResult> => {
  if (!text.trim()) {
    return { en: '', ru: '' };
  }

  try {
    // Using MyMemory Translation API
    const translateToLanguage = async (targetLang: string): Promise<string> => {
      const encodedText = encodeURIComponent(text);
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=az|${targetLang}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // MyMemory API returns translated text in responseData.translatedText
      if (data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      
      throw new Error('Invalid response from translation API');
    };

    // Translate to both languages in parallel
    const [en, ru] = await Promise.all([
      translateToLanguage('en'),
      translateToLanguage('ru'),
    ]);

    return { en, ru };
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return empty strings if translation fails
    // This way the user can manually fill in the translations
    return { en: '', ru: '' };
  }
};

/**
 * Debounced translation function to avoid too many API calls
 */
export const debouncedTranslate = (() => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (text: string, callback: (result: TranslationResult) => void, delay = 800) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      const result = await translateFromAzerbaijani(text);
      callback(result);
    }, delay);
  };
})();
