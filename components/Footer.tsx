
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[--color-bg-alt] border-t border-[--color-border]">
      <div className="container mx-auto px-4 py-6 text-center text-[--color-text-muted]">
        <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('footerRights')}</p>
        <p className="text-sm mt-1">{t('footerDisclaimer')}</p>
        <p className="text-sm mt-2 font-medium">{t('footerDesigner')}</p>
      </div>
    </footer>
  );
};
