import type { Route } from '.react-router/types/app/routes/about/facilities/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/ui/Button';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { FacilitiesResponse } from '~/types/api/v2/about/facilities';
import { getLocaleFromPathname } from '~/utils/string';
import FacilitiesList from './components/FacilitiesList';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(`${BASE_URL}/v2/about/facilities`);
  if (!response.ok) throw new Error('Failed to fetch facilities');

  const facilities = (await response.json()) as FacilitiesResponse;
  return facilities.map((facility) => facility[locale]);
}

export default function FacilitiesPage({
  loaderData: facilities,
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({ '시설 안내': 'Facilities' });
  const subNav = useAboutSubNav();

  return (
    <PageLayout title={t('시설 안내')} titleSize="xl" subNav={subNav}>
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-7 text-right">
          <Button
            as="link"
            to={localizedPath('/about/facilities/create')}
            variant="solid"
            tone="brand"
            size="md"
          >
            시설 추가
          </Button>
        </div>
      </LoginVisible>
      <FacilitiesList facilities={facilities} />
    </PageLayout>
  );
}
