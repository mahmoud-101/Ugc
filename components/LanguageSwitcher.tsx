
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      aria-label={t('toggleLanguage')}
      title={t('toggleLanguage')}
      className="p-2 rounded-full bg-[--color-bg-alt] text-[--color-text] hover:bg-[--color-border] transition-colors"
    >
        <div className="w-5 h-5 flex items-center justify-center font-semibold text-sm">
            {language === 'en' ? 'AR' : 'EN'}
        </div>
    </button>
  );
};
