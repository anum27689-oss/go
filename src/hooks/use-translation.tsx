"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// @ts-ignore
import en from '@/locales/en.json';
// @ts-ignore
import ur from '@/locales/ur.json';

const translations: Record<string, any> = { en, ur };

type Language = 'en' | 'ur';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ur')) {
      setLanguageState(savedLanguage);
    }
    setIsMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    if(isMounted) {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    }
  }, [language, isMounted]);

  const t = useCallback((key: string): string => {
    if (!isMounted) return '';
    const keys = key.split('.');
    let result: any = translations[language];
    try {
        for (const k of keys) {
            result = result[k];
        }
    } catch(e) {
        result = undefined;
    }

    if (!result) {
        // Fallback to English if translation not found
        let fallbackResult: any = translations['en'];
        try {
            for (const fk of keys) {
                fallbackResult = fallbackResult[fk];
            }
        } catch (e) {
            return key;
        }
        return fallbackResult || key;
    }
    return result;
  }, [language, isMounted]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
