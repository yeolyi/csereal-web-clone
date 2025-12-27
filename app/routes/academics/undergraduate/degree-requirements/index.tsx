import type { Route } from '.react-router/types/app/routes/academics/undergraduate/degree-requirements/+types/index';
import { Link } from 'react-router';
import Attachments from '~/components/common/Attachments';
import Button from '~/components/common/Button';
import HTMLViewer from '~/components/common/HTMLViewer';
import LoginVisible from '~/components/common/LoginVisible';
import Node from '~/components/common/Nodes';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import type { DegreeRequirements } from '~/types/api/v2/academics/undergraduate/degree-requirements';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return await fetchJson<DegreeRequirements>(
    `${BASE_URL}/v2/academics/undergraduate/degree-requirements`,
  );
}

export default function DegreeRequirementsPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '공통: 졸업사정 유의사항': 'Common: Graduation Review Notes',
  });
  const subNav = useAcademicsSubNav();
  const title = t('졸업 규정');
  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 flex justify-end">
          <Button variant="outline" tone="neutral" as="link" to="edit">
            편집
          </Button>
        </div>
      </LoginVisible>
      <Attachments files={loaderData.attachments} />
      <div className="mb-4 mt-6 flex w-[200px] flex-col">
        <h3 className="mb-2 pl-3 text-lg font-bold">
          {t('공통: 졸업사정 유의사항')}
        </h3>
        <Node variant="straight" />
      </div>
      <HTMLViewer html={loaderData.description} />
    </PageLayout>
  );
}
