import { useLocation } from 'react-router';

export function usePathWithoutLocale() {
  const location = useLocation();
  return location.pathname.replace(/^\/en/, '') || '/';
}
