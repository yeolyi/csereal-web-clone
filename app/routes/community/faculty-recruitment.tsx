import type { Route } from '.react-router/types/app/routes/community/+types/faculty-recruitment';
import HTMLViewer from '~/components/common/HTMLViewer';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useCommunitySubNav } from '~/hooks/useSubNav';
import type { FacultyRecruitmentResponse } from '~/types/api/v2/recruit';

export async function loader() {
  const response = await fetch(`${BASE_URL}/v2/recruit`);
  if (!response.ok) throw new Error('Failed to fetch faculty recruitment');
  return (await response.json()) as FacultyRecruitmentResponse;
}

export default function FacultyRecruitmentPage({
  loaderData: data,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    신임교수초빙: 'Faculty Recruitment',
    편집: 'Edit',
  });
  const subNav = useCommunitySubNav();

  return (
    <PageLayout
      title={t('신임교수초빙')}
      titleSize="xl"
      breadcrumb={[
        { name: t('소식'), path: '/community' },
        { name: t('신임교수초빙'), path: '/community/faculty-recruitment' },
      ]}
      subNav={subNav}
    >
      <h1 className="my-5 text-3xl font-bold">{data.title}</h1>
      <HTMLViewer
        html={data.description}
        image={
          data.mainImageUrl
            ? {
                src: data.mainImageUrl,
                width: 200,
                height: 200,
              }
            : undefined
        }
      />
    </PageLayout>
  );
}
