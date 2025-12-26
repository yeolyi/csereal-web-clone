import type { Route } from '.react-router/types/app/routes/academics/$studentType/+types/course-changes';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import TimelineViewer from '~/routes/academics/components/timeline/TimelineViewer';
import type { TimelineContent } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';

export async function loader({ params }: Route.LoaderArgs) {
  const { studentType } = params;
  return await fetchJson<TimelineContent[]>(
    `${BASE_URL}/v2/academics/${studentType}/course-changes`,
  );
}

export default function CourseChangesPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  const { t } = useLanguage({ 학년도: 'Academic Year' });
  const subNav = useAcademicsSubNav();

  const title = t('교과목 변경 내역');
  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: studentLabel, path: `/academics/${studentType}` },
    {
      name: t('교과목 변경 내역'),
      path: `/academics/${studentType}/course-changes`,
    },
  ];

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <TimelineViewer
        contents={loaderData}
        title={{ text: t('교과목 변경 내역'), unit: t('학년도') }}
      />
    </PageLayout>
  );
}
