
import React, { useState, useEffect } from 'react';
import { UploadStep } from './components/UploadStep';
import { ResultsStep } from './components/ResultsStep';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import type { Storyboard, AdOptions, Shot } from './types';
import { generateStoryboard, generateShotImage, analyzeProduct } from './services/geminiService';
import { Loader } from './components/Loader';
import { SplashScreen } from './components/SplashScreen';
import { useTranslation } from './hooks/useTranslation';


export type AppStep = 'upload' | 'generating_storyboard' | 'generating_images' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [productImageBase64, setProductImageBase64] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerationStart = async (
    productImage: File,
    adOptions: AdOptions
  ) => {
    setStep('generating_storyboard');
    setError(null);
    setStoryboard(null);
    setGeneratedImages({});
    setProductImageBase64(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(productImage);
      reader.onload = async () => {
        const base64Image = (reader.result as string).split(',')[1];
        setProductImageBase64(base64Image);
        
        const productAnalysis = await analyzeProduct(base64Image, adOptions.category);
        const newStoryboard = await generateStoryboard(productAnalysis, adOptions.dialect, adOptions.mood, adOptions.features, base64Image);
        setStoryboard(newStoryboard);
        setStep('generating_images');
        
        generateImagesForStoryboard(newStoryboard, adOptions.aspectRatio, base64Image);
      };
      reader.onerror = () => {
        setError('Failed to read the product image. Please try again.');
        setStep('upload');
      };
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the storyboard. Please check your API key and try again.');
      setStep('upload');
    }
  };
  
  const generateImagesForStoryboard = async (storyboardToProcess: Storyboard, aspectRatio: AdOptions['aspectRatio'], base64Image: string) => {
    for (const shot of storyboardToProcess.storyboard) {
      try {
        const imageUrl = await generateShotImage(shot, storyboardToProcess.persona, aspectRatio, base64Image);
        setGeneratedImages(prev => ({ ...prev, [shot.shot_id]: imageUrl }));
      } catch (err) {
        console.error(`Failed to generate image for shot ${shot.shot_id}`, err);
        // FIX: Set the image state to 'error' to show failure in the UI.
        setGeneratedImages(prev => ({ ...prev, [shot.shot_id]: 'error' }));
      }
    }
    setStep('results');
  };

  const handleRegenerateImage = async (shot: Shot) => {
    if (!storyboard || !productImageBase64) return;
    try {
      setGeneratedImages(prev => ({ ...prev, [shot.shot_id]: 'loading' }));
      const imageUrl = await generateShotImage(shot, storyboard.persona, storyboard.aspectRatio, productImageBase64);
      setGeneratedImages(prev => ({ ...prev, [shot.shot_id]: imageUrl }));
    } catch (err)
 {
      console.error(`Failed to regenerate image for shot ${shot.shot_id}`, err);
      setGeneratedImages(prev => ({ ...prev, [shot.shot_id]: 'error' }));
    }
  };
  
  const handleRestart = () => {
    setStep('upload');
    setStoryboard(null);
    setGeneratedImages({});
    setError(null);
    setProductImageBase64(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'upload':
        return <UploadStep onGenerate={handleGenerationStart} error={error} />;
      case 'generating_storyboard':
        return <Loader text={t('analyzingLoader')} />;
      case 'generating_images':
        return (
          <ResultsStep
            storyboard={storyboard}
            generatedImages={generatedImages}
            isLoading={true}
            onRestart={handleRestart}
            onRegenerateImage={handleRegenerateImage}
          />
        );
      case 'results':
        return (
           <ResultsStep
            storyboard={storyboard}
            generatedImages={generatedImages}
            isLoading={false}
            onRestart={handleRestart}
            onRegenerateImage={handleRegenerateImage}
          />
        );
      default:
        return <UploadStep onGenerate={handleGenerationStart} error={error} />;
    }
  };

  return (
    <>
      <SplashScreen isVisible={showSplash} />
      {!showSplash && (
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
            {renderContent()}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;