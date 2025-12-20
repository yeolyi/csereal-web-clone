import { useLocation, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import { useLanguage } from '~/hooks/useLanguage';

export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage({
    '존재하지 않는 경로입니다': 'Page not found',
    '메인으로 이동': 'Go to home',
  });

  return (
    <>
      <Header />
      <div className="grow p-15 flex flex-col items-start gap-4">
        <p className="text-lg text-white">
          {t('존재하지 않는 경로입니다')}: {pathname}
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="whitespace-nowrap rounded-[.0625rem] border border-neutral-200 bg-neutral-100 px-[.875rem] py-[.3125rem] text-md font-medium leading-[1.5rem] text-neutral-500 hover:bg-neutral-200"
        >
          {t('메인으로 이동')}
        </button>
      </div>
    </>
  );
}
