'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Definición del tipo para las traducciones: permite objetos anidados
type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

export const useTranslation = () => {
  const [locale, setLocale] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, NestedTranslations>>({});

  // Función para obtener un valor anidado usando una ruta con puntos
  const getNestedValue = (obj: NestedTranslations | undefined, path: string): string => {
    if (!obj) return path;
    
    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current[key] === undefined) {
        return path;
      }
      current = current[key];
    }

    return typeof current === 'string' ? current : path;
  };

  // Efecto para cargar las traducciones y establecer el idioma inicial
  useEffect(() => {
    const loadTranslations = async (lang: string) => {
      try {
        const translation = await import(`../../public/locales/${lang}.json`);
        setTranslations(prev => ({
          ...prev,
          [lang]: translation.default || translation
        }));
      } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
      }
    };

    const savedLocale = Cookies.get('locale');
    const initialLocale = savedLocale || (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en');
    setLocale(initialLocale);
    loadTranslations(initialLocale);
  }, []);

  // Función para obtener la traducción de una clave.
  const t = (key: string): string => {
    return getNestedValue(translations[locale], key) || key;
  };

  // Función para cambiar el idioma, esperando un evento de cambio
  const changeLanguage = async (event: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const newLocale = event.target.value;
    
    // Solo cargar las traducciones si no están ya cargadas
    if (!translations[newLocale]) {
      try {
        const translation = await import(`../../public/locales/${newLocale}.json`);
        setTranslations(prev => ({
          ...prev,
          [newLocale]: translation.default || translation
        }));
      } catch (error) {
        console.error(`Error loading translations for ${newLocale}:`, error);
        return;
      }
    }

    setLocale(newLocale);
    Cookies.set('locale', newLocale);
  };

  return { t, locale, changeLanguage };
};