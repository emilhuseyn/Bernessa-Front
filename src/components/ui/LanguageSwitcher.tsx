import { useState, useRef, useEffect } from 'react';
import { useLanguageStore, type Language } from '../../store/languageStore';
import { FiCheck } from 'react-icons/fi';

const FlagIcon = ({ code }: { code: Language }) => {
  const flags = {
    az: (
      <svg className="w-5 h-4" viewBox="0 0 20 15" fill="none">
        <rect width="20" height="5" fill="#00B5E2"/>
        <rect y="5" width="20" height="5" fill="#EF3340"/>
        <rect y="10" width="20" height="5" fill="#509E2F"/>
        <g transform="translate(10, 7.5)">
          <circle cx="0" cy="0" r="2" fill="white"/>
          <circle cx="0.5" cy="0" r="1.6" fill="#EF3340"/>
          <path d="M1.8 0 L2.8 0.9 L2.4 -0.3 L3.2 -1.2 L2 -1.2 L1.8 -2.3 L1.6 -1.2 L0.4 -1.2 L1.2 -0.3 L0.8 0.9 Z" fill="white" transform="scale(0.5)"/>
        </g>
      </svg>
    ),
    en: (
      <svg className="w-5 h-4" viewBox="0 0 20 15" fill="none">
        <rect width="20" height="15" fill="#012169"/>
        <path d="M0 0L20 15M20 0L0 15" stroke="white" strokeWidth="3"/>
        <path d="M0 0L20 15M20 0L0 15" stroke="#C8102E" strokeWidth="2"/>
        <path d="M10 0V15M0 7.5H20" stroke="white" strokeWidth="5"/>
        <path d="M10 0V15M0 7.5H20" stroke="#C8102E" strokeWidth="3"/>
      </svg>
    ),
    ru: (
      <svg className="w-5 h-4" viewBox="0 0 20 15" fill="none">
        <rect width="20" height="5" fill="white"/>
        <rect y="5" width="20" height="5" fill="#0039A6"/>
        <rect y="10" width="20" height="5" fill="#D52B1E"/>
      </svg>
    ),
  };
  return flags[code];
};

const languages: Array<{ code: Language; name: string }> = [
  { code: 'az', name: 'Azərbaycan' },
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
];

export const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FlagIcon code={currentLang.code} />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {currentLang.code.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                currentLanguage === lang.code
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <FlagIcon code={lang.code} />
                <span className="font-medium">{lang.code.toUpperCase()}</span>
              </span>
              {currentLanguage === lang.code && (
                <FiCheck className="w-4 h-4 text-gray-900 dark:text-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
