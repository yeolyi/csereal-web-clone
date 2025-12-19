import { useLocation, useNavigate } from 'react-router';
import { usePathWithoutLocale } from '~/hooks/usePathWithoutLocale';
import { getLocaleFromPathname } from '~/utils/i18n';

export function useLanguage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locale = getLocaleFromPathname(location.pathname);
  const pathWithoutLocale = usePathWithoutLocale();

  const changeLanguage = () => {
    const isEnglish = locale === 'en';
    const newLocale = isEnglish ? 'ko' : 'en';
    if (newLocale === 'en') {
      navigate(`/en${pathWithoutLocale}${location.search}`);
    } else {
      navigate(`${pathWithoutLocale}${location.search}`);
    }
  };

  return { locale, changeLanguage };
}
