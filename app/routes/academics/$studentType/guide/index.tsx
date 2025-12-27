import type { Route } from '.react-router/types/app/routes/academics/$studentType/guide/+types/index';
import Attachments from '~/components/ui/Attachments';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { Guide } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  return fetchJson<Guide>(`${BASE_URL}/v2/academics/${studentType}/guide`);
}

export default function GuidePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t, localizedPath } = useLanguage();
  const subNav = useAcademicsSubNav();

  const isGraduate = studentType === 'graduate';
  const title = isGraduate ? t('대학원 안내') : t('학부 안내');
  const studentLabel = isGraduate ? t('대학원') : t('학부');
  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 text-right">
          <Button
            as="link"
            to={localizedPath(`/academics/${studentType}/guide/edit`)}
            variant="outline"
            tone="neutral"
            size="md"
          >
            편집
          </Button>
        </div>
      </LoginVisible>
      <Attachments files={loaderData.attachments} />
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
