
import 'server-only';
import type { Locale } from '@/lib/i18n-config';

// Define a general type for the dictionary structure
// You might want to make this more specific based on your JSON structure
type Dictionary = {
  [key: string]: string | Dictionary;
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  hi: () => import('@/dictionaries/hi.json').then((module) => module.default),
  kn: () => import('@/dictionaries/kn.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.en();
};
