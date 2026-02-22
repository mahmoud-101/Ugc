
import React from 'react';
import type { Storyboard, Shot } from '../types';
import { ShotCard } from './ShotCard';
import JSZip from 'jszip';
import { useTranslation } from '../hooks/useTranslation';

interface ResultsStepProps {
  storyboard: Storyboard | null;
  generatedImages: Record<number, string>;
  isLoading: boolean;
  onRestart: () => void;
  onRegenerateImage: (shot: Shot) => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
  storyboard,
  generatedImages,
  isLoading,
  onRestart,
  onRegenerateImage
}) => {
  const { t } = useTranslation();

  if (!storyboard) {
    return (
      <div className="text-center">
        <p>{t('somethingWentWrong')}</p>
        <button onClick={onRestart} className="mt-4 px-4 py-2 bg-[--color-primary] text-white rounded-md">{t('startOver')}</button>
      </div>
    );
  }
  
  const handleDownloadJson = () => {
    const data = {
      ...storyboard,
      generated_images: generatedImages,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "storyboard.json";
    link.click();
  };
  
  const handleDownloadZip = async () => {
    const zip = new JSZip();
    
    // Add storyboard JSON
    const data = { ...storyboard, generated_images: {} }; // Don't include base64 in JSON
    zip.file("storyboard.json", JSON.stringify(data, null, 2));
    
    // Add images
    const imageFolder = zip.folder("shots");
    for (const shot of storyboard.storyboard) {
        const imageUrl = generatedImages[shot.shot_id];
        if (imageUrl && imageUrl.startsWith('data:image')) {
            const base64Data = imageUrl.split(',')[1];
            imageFolder?.file(`shot_${shot.shot_id}.png`, base64Data, { base64: true });
        }
    }

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "UGC_Ad_Project.zip";
    link.click();
    URL.revokeObjectURL(link.href);
  };


  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold leading-7 text-[--color-text] sm:text-4xl sm:truncate">
            {t('storyboardTitle')}
          </h2>
          <p className="mt-2 text-md text-[--color-text-muted]">
            {t('personaPrefix')} <span className="font-semibold text-[--color-text]">{storyboard.persona.name}, {storyboard.persona.age}</span> - {storyboard.persona.personality}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:ms-4">
          <button onClick={onRestart} className="px-4 py-2 text-sm font-medium bg-[--color-bg-alt] text-[--color-text] hover:bg-[--color-border] rounded-md transition">
            {t('startNewProjectBtn')}
          </button>
          <button onClick={handleDownloadJson} disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-[--color-bg-alt] text-[--color-text] hover:bg-[--color-border] rounded-md transition disabled:opacity-50">
            {t('downloadJsonBtn')}
          </button>
           <button onClick={handleDownloadZip} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-[--color-primary] hover:bg-[--color-primary-hover] rounded-md transition disabled:bg-[--color-slate] disabled:cursor-not-allowed">
            {isLoading ? t('generatingBtn') : t('downloadZipBtn')}
          </button>
        </div>
      </div>
      
      {isLoading && 
        <div className="text-center my-8 p-4 bg-[--color-bg-alt]/50 rounded-lg">
          <div className="flex items-center justify-center">
             <div className="w-6 h-6 border-2 border-[--color-primary] border-dashed rounded-full animate-spin me-3"></div>
             <p className="text-lg text-[--color-text-muted]">{t('generatingShotsLoader')}</p>
          </div>
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {storyboard.storyboard.map((shot) => (
          <ShotCard 
            key={shot.shot_id} 
            shot={shot} 
            imageUrl={generatedImages[shot.shot_id]}
            onRegenerate={() => onRegenerateImage(shot)}
          />
        ))}
      </div>
    </div>
  );
};