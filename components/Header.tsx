
import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';


export const Header: React.FC = () => {
    const { t } = useTranslation();
  return (
    <header className="bg-[--color-bg-alt]/80 backdrop-blur-sm shadow-lg shadow-black/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h1 className="text-2xl font-bold tracking-tight text-[--color-text] sm:text-3xl">
            {t('appName')}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
