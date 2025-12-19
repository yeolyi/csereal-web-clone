import { useLanguage } from '~/hooks/useLanguage';

type Translations = Record<string, string>; // 한국어 -> 영어

export function useTranslation(translations: Translations) {
  const { locale } = useLanguage();

  const t = (koreanKey: string): string => {
    // If Korean, return key as is
    if (locale === 'ko') {
      return koreanKey;
    }
    // If English, return translated value or fallback to key
    return translations[koreanKey] || koreanKey;
  };

  return { t, locale };
}
