
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LoaderProps {
  text: string;
}

export const Loader: React.FC<LoaderProps> = ({ text }) => {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-[--color-bg-alt]/50 min-h-[400px]">
      <div className="w-16 h-16 border-4 border-[--color-primary] border-dashed rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-[--color-text] mb-2">{text}</h2>
      <p className="text-[--color-text-muted] max-w-md">{t('loaderSubtext')}</p>
    </div>
  );
};
