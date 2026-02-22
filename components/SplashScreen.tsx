
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface SplashScreenProps {
  isVisible: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
    const { t } = useTranslation();
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2a383f] text-white transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 -translate-y-full'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <svg className="w-12 h-12 text-[--color-primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t('appName')}</h1>
      </div>
      <p className="mt-4 text-lg text-[--color-cream]">{t('welcomeMessage')}</p>
    </div>
  );
};
