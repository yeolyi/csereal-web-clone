import type { Route } from '.react-router/types/app/routes/about/student-clubs/+types/index';
import { useSearchParams } from 'react-router';
import Button from '~/components/common/Button';
import LoginVisible from '~/components/common/LoginVisible';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAboutSubNav } from '~/hooks/useSubNav';
import type { StudentClubsResponse } from '~/types/api/v2/about/student-clubs';
import { fetchJson } from '~/utils/fetch';
import { findItemBySearchParam } from '~/utils/string';
import ClubDetails from './components/ClubDetails';

export async function loader() {
  const response = await fetchJson<StudentClubsResponse>(
    `${BASE_URL}/v2/about/student-clubs`,
  );
  return response;
}

export default function StudentClubsPage({
  loaderData: clubs,
}: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { t, locale, localizedPath } = useLanguage({
    '학생 동아리': 'Student Clubs',
    '동아리 소개': 'Student Clubs',
    '학부 소개': 'About',
  });
  const subNav = useAboutSubNav();

  const selectedClub = findItemBySearchParam(
    clubs,
    (item) => [item.ko.id.toString()],
    searchParams.get('selected'),
  );

  const selectionItems = clubs.map((club) => {
    const { id, name: label } = club[locale];
    return {
      id: id.toString(),
      label,
      href: `/about/student-clubs?selected=${id}`,
      selected: id === selectedClub?.ko.id,
    };
  });

  return (
    <PageLayout
      title={t('동아리 소개')}
      titleSize="xl"
      breadcrumb={[
        { name: t('학부 소개'), path: '/about/overview' },
        { name: t('동아리 소개'), path: '/about/student-clubs' },
      ]}
      subNav={subNav}
      padding="noTop"
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mt-11 text-right">
          <Button
            as="link"
            to={localizedPath('/about/student-clubs/create')}
            variant="solid"
            tone="brand"
            size="md"
          >
            동아리 추가
          </Button>
        </div>
      </LoginVisible>

      <SelectionList items={selectionItems} />
      {selectedClub && <ClubDetails club={selectedClub} locale={locale} />}
    </PageLayout>
  );
}
