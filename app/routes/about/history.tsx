import type { Route } from '.react-router/types/app/routes/about/+types/history';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/ui/Button';
import ContentSection from '~/components/feature/content/ContentSection';
import HTMLViewer from '~/components/ui/HTMLViewer';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { AboutContent } from '~/types/api/v2/about/content';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const response = await fetch(
    `${BASE_URL}/v2/about/history?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch history');

  return (await response.json()) as AboutContent;
}

export default function HistoryPage({ loaderData }: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage();
  const subNav = useAboutSubNav();

  return (
    <PageLayout title={t('연혁')} titleSize="xl" subNav={subNav} padding="none">
      <ContentSection tone="white" padding="subNav">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/history/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <HTMLViewer
          html={loaderData.description}
          image={
            loaderData.imageURL && {
              src: loaderData.imageURL,
              width: 320,
              height: 360,
              mobileFullWidth: true,
            }
          }
        />
      </ContentSection>
    </PageLayout>
  );
}
