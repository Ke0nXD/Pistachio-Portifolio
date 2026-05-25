'use client';
import { LanguageContext, useLanguageProvider } from '@/hooks/useLanguage';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { ClickStickers } from '@/components/effects/ClickStickers';

export function Providers({ children }: { children: React.ReactNode }) {
  const language = useLanguageProvider();

  return (
    <LanguageContext.Provider value={language}>
      <CustomCursor />
      <ClickStickers />
      {children}
    </LanguageContext.Provider>
  );
}
