import type { Route } from '.react-router/types/app/routes/about/+types/contact';
import type { LoaderFunctionArgs } from 'react-router';
import Button from '~/components/ui/Button';
import ContentSection from '~/components/feature/content/ContentSection';
import HTMLViewer from '~/components/ui/HTMLViewer';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import { getLocaleFromPathname } from '~/utils/string';

interface ContactResponse {
  description: string;
  imageURL: string | null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `${BASE_URL}/v2/about/contact?language=${locale}`,
  );
  if (!response.ok) throw new Error('Failed to fetch contact');

  return (await response.json()) as ContactResponse;
}

export default function ContactPage({
  loaderData: { description, imageURL },
}: Route.ComponentProps) {
  const { t, localizedPath } = useLanguage({ 연락처: 'Contact' });
  const subNav = useAboutSubNav();

  return (
    <PageLayout
      title={t('연락처')}
      titleSize="xl"
      subNav={subNav}
      padding="none"
    >
      <ContentSection tone="white" padding="subNav">
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-8 text-right">
            <Button
              as="link"
              to={localizedPath('/about/contact/edit')}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
        <HTMLViewer
          html={description}
          image={
            imageURL && {
              src: imageURL,
              width: 240,
              height: 360,
              mobileFullWidth: true,
            }
          }
        />
      </ContentSection>
    </PageLayout>
  );
}
