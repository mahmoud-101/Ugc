import React, { useState, useRef, useCallback } from 'react';
import type { AdOptions } from '../types';
import { DIALECTS, MOODS, ASPECT_RATIOS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

interface UploadStepProps {
  onGenerate: (productImage: File, adOptions: AdOptions) => void;
  error: string | null;
}

// FIX: Changed OptionButton to a const with an arrow function.
// This helps TypeScript correctly identify it as a React component and handle the 'key' prop.
interface OptionButtonProps<T extends string> {
  option: T;
  selected: T;
  onSelect: (option: T) => void;
  children: React.ReactNode;
}

const OptionButton = <T extends string>({
  option,
  selected,
  onSelect,
  children,
}: OptionButtonProps<T>) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
        selected === option
          ? 'bg-[--color-primary] text-white shadow-lg'
          : 'bg-[--color-bg-alt] text-[--color-text] hover:bg-[--color-secondary] hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};


export const UploadStep: React.FC<UploadStepProps> = ({ onGenerate, error }) => {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [features, setFeatures] = useState('');
  const [dialect, setDialect] = useState<AdOptions['dialect']>('Egyptian');
  const [mood, setMood] = useState<AdOptions['mood']>('Luxury');
  const [aspectRatio, setAspectRatio] = useState<AdOptions['aspectRatio']>('16:9');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProductImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        setProductImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (productImage) {
      onGenerate(productImage, { category, dialect, mood, features, aspectRatio });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-[--color-text] sm:text-5xl">{t('createAdConceptTitle')}</h2>
        <p className="mt-4 text-lg text-[--color-text-muted]">{t('createAdConceptSubtitle')}</p>
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-[--color-bg-alt]/50 p-8 rounded-2xl shadow-2xl shadow-black/5 space-y-8 backdrop-blur-md">
        
        <div>
          <label className="block text-lg font-medium text-[--color-text] mb-2">{t('uploadImageLabel')}</label>
          <label 
            htmlFor="product-image"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex justify-center items-center w-full h-64 px-6 transition bg-[--color-bg]/50 border-2 border-[--color-border] border-dashed rounded-lg appearance-none cursor-pointer hover:border-[--color-primary] focus:outline-none"
          >
             {previewUrl ? (
                <img src={previewUrl} alt="Product Preview" className="max-h-full max-w-full object-contain rounded-md" />
              ) : (
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[--color-text-muted]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-[--color-text-muted]">
                    {t('dropFiles')} <span className="text-[--color-primary] underline">{t('browse')}</span>
                  </span>
                </span>
             )}
          </label>
          <input id="product-image" type="file" accept="image/png, image/jpeg" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="product-category" className="block text-lg font-medium text-[--color-text] mb-3">{t('productTypeLabel')}</label>
              <input
                type="text"
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t('productTypePlaceholder')}
                className="w-full bg-[--color-bg]/50 text-[--color-text] rounded-md border-[--color-border] focus:ring-[--color-primary] focus:border-[--color-primary] transition"
              />
            </div>
             <div>
              <label htmlFor="product-features" className="block text-lg font-medium text-[--color-text] mb-3">{t('productFeaturesLabel')}</label>
              <textarea
                id="product-features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                rows={3}
                placeholder={t('productFeaturesPlaceholder')}
                className="w-full bg-[--color-bg]/50 text-[--color-text] rounded-md border-[--color-border] focus:ring-[--color-primary] focus:border-[--color-primary] transition"
              />
            </div>
        </div>
         <div>
            <h3 className="text-lg font-medium text-[--color-text] mb-3">{t('aspectRatioLabel')}</h3>
            <div className="flex flex-wrap gap-2">
               {/* FIX: Explicitly provide generic type argument to OptionButton to fix type inference issue. */}
               {ASPECT_RATIOS.map(ar => <OptionButton<AdOptions['aspectRatio']> key={ar.value} option={ar.value} selected={aspectRatio} onSelect={setAspectRatio}>{t(ar.labelKey)}</OptionButton>)}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-lg font-medium text-[--color-text] mb-3">{t('dialectLabel')}</h3>
                <div className="flex flex-wrap gap-2">
                  {/* FIX: Explicitly provide generic type argument to OptionButton and simplify onSelect handler. */}
                  {DIALECTS.map(d => <OptionButton<AdOptions['dialect']> key={d.key} option={d.key} selected={dialect} onSelect={setDialect}>{t(d.tKey)}</OptionButton>)}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-medium text-[--color-text] mb-3">{t('moodLabel')}</h3>
                <div className="flex flex-wrap gap-2">
                   {/* FIX: Explicitly provide generic type argument to OptionButton and simplify onSelect handler. */}
                   {MOODS.map(m => <OptionButton<AdOptions['mood']> key={m.key} option={m.key} selected={mood} onSelect={setMood}>{t(m.tKey)}</OptionButton>)}
                </div>
            </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={!productImage}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-[--color-primary] hover:bg-[--color-primary-hover] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[--color-bg-alt] focus:ring-[--color-primary] disabled:bg-[--color-slate] disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {t('generateStoryboardBtn')}
             <svg xmlns="http://www.w3.org/2000/svg" className="ms-3 -me-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </form>
    </div>
  );
};