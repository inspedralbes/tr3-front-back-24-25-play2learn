'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const LanguageSelector = ({ variant = 'default' }: { variant?: 'default' | 'sidebar' }) => {
  const { t, locale, changeLanguage } = useTranslation();

  const languages = [
    { code: 'en', name: t('languages.en') },
    { code: 'es', name: t('languages.es') },
    { code: 'fr', name: t('languages.fr') }
  ];

  if (variant === 'sidebar') {
    return (
      <select
        value={locale}
        onChange={changeLanguage}
        className="bg-transparent text-indigo-400 hover:text-white focus:text-white rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-800/50 transition-all cursor-pointer"
        aria-label={t('languages.select_language')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-indigo-900 text-white">
            {lang.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Globe size={20} className="text-indigo-400" />
      <select
        value={locale}
        onChange={changeLanguage}
        className="bg-indigo-800/30 border border-indigo-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-800/50 transition-colors"
        aria-label={t('languages.select_language')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-indigo-900 text-white">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
