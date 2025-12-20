import type { Route } from '.react-router/types/app/routes/+types/layout';
import { useEffect } from 'react';
import { isRouteErrorResponse, Outlet, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { type Role, useStore } from '~/store';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<Role | undefined> {
  try {
    const response = await fetch(`${BASE_URL}/v2/user/my-role`, {
      headers: request.headers,
    });
    if (!response.ok) return undefined;

    const { roles }: { roles: Role[] } = await response.json();

    // 우선순위 체크
    if (roles.includes('ROLE_STAFF')) return 'ROLE_STAFF';
    if (roles.includes('ROLE_RESERVATION')) return 'ROLE_RESERVATION';
    if (roles.includes('ROLE_COUNCIL')) return 'ROLE_COUNCIL';

    return undefined;
  } catch {
    return undefined;
  }
}

export default function Layout({ loaderData }: Route.ComponentProps) {
  useEffect(() => {
    useStore.setState({ role: loaderData });
  }, [loaderData]);

  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = useLanguage({ '메인으로 이동': 'Go to home' });
  const navigate = useNavigate();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <>
      <Header />
      <div className="grow p-15 flex flex-col items-start gap-4">
        <p className="text-lg text-white">Error: {message}</p>
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
