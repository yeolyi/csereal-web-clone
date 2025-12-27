import type { Route } from '.react-router/types/app/routes/academics/undergraduate/curriculum/+types/index';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

export async function loader() {
  return await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/undergraduate/curriculum`,
  );
}

export default function UndergraduateCurriculumPage({
  loaderData,
}: Route.ComponentProps) {
  const { t } = useLanguage({ 학번: 'Student ID' });
  const subNav = useAcademicsSubNav();
  const title = t('전공 이수 표준 형태');
  return (
    <PageLayout title={title} titleSize="xl" subNav={subNav}>
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('전공 이수 표준 형태'), unit: t('학번') }}
      />
    </PageLayout>
  );
}
