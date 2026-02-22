
import React from 'react';
import type { Shot } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ShotCardProps {
  shot: Shot;
  imageUrl: string | undefined; // Can be base64 URL, 'loading', 'error', or undefined
  onRegenerate: () => void;
}

export const ShotCard: React.FC<ShotCardProps> = ({ shot, imageUrl, onRegenerate }) => {
  const { t } = useTranslation();
  
  const renderImageContent = () => {
    if (imageUrl === 'loading' || !imageUrl) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[--color-bg]">
          <div className="w-8 h-8 border-2 border-[--color-primary] border-dashed rounded-full animate-spin"></div>
          <p className="mt-3 text-xs text-[--color-text-muted]">{t('generating')}</p>
        </div>
      );
    }
    if (imageUrl === 'error') {
       return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{t('generationFailed')}</p>
        </div>
      );
    }
    return <img src={imageUrl} alt={`Shot ${shot.shot_id}`} className="w-full h-full object-cover" />;
  };

  return (
    <div className="bg-[--color-bg-alt] rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[--color-primary]/20 hover:scale-[1.02]">
      <div className="relative aspect-video">
        {renderImageContent()}
        <div className="absolute top-2 start-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
          {t('shot')} {shot.shot_id}
        </div>
        <button onClick={onRegenerate} disabled={imageUrl === 'loading'} className="absolute top-2 end-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-[--color-primary] transition disabled:opacity-50 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" />
            </svg>
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
            <p className="text-sm font-semibold text-[--color-secondary]">{shot.camera}</p>
            <p className="mt-2 text-sm text-[--color-text] leading-relaxed"><span className="font-bold text-[--color-text-muted]">{t('scene')}</span> {shot.scene}</p>
            <p className="mt-2 text-sm text-[--color-text] leading-relaxed"><span className="font-bold text-[--color-text-muted]">{t('action')}</span> {shot.action}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-[--color-border]">
           <p className="text-sm italic text-[--color-text]">"{shot.dialogue}"</p>
        </div>
      </div>
    </div>
  );
};
