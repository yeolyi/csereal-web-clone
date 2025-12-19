export type Locale = 'ko' | 'en';

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'ko';
}
