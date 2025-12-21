import type { Route } from '.react-router/types/app/routes/research/groups/+types/index';
import type { LoaderFunctionArgs } from 'react-router';
import SelectionList from '~/components/common/SelectionList';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import useSelectionParam from '~/hooks/useSelectionParam';
import { useResearchSubNav } from '~/hooks/useSubNav';
import type { ResearchGroupsResponse } from '~/types/api/v2/research/groups';
import { getLocaleFromPathname } from '~/utils/string';
import ResearchGroupDetails from './components/ResearchGroupDetails';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);

  const params = new URLSearchParams();
  params.append('language', locale);

  const response = await fetch(
    `${BASE_URL}/v2/research/groups?${params.toString()}`,
  );
  if (!response.ok) throw new Error('Failed to fetch research groups');

  return (await response.json()) as ResearchGroupsResponse;
}

export default function ResearchGroupsPage({
  loaderData: groups,
}: Route.ComponentProps) {
  const { t } = useLanguage({
    '연구 스트림은 존재하지 않습니다.': 'Research stream does not exist.',
  });
  const subNav = useResearchSubNav();

  const { selectedItem, getUrl } = useSelectionParam({
    items: groups,
    basePath: '/research/groups',
    idKey: 'id',
    labelKey: 'name',
  });

  const selectionItems = groups.map((group) => ({
    id: String(group.id),
    label: group.name,
    href: getUrl(group),
    selected: group.id === selectedItem?.id,
  }));

  return (
    <PageLayout
      title={t('연구·교육 스트림')}
      titleSize="xl"
      breadcrumb={[
        { name: t('연구·교육'), path: '/research' },
        { name: t('연구·교육 스트림'), path: '/research/groups' },
      ]}
      subNav={subNav}
      padding="none"
    >
      <div className="px-7 sm:pl-[100px] sm:pr-[320px]">
        <SelectionList items={selectionItems} />
      </div>
      {selectedItem && <ResearchGroupDetails group={selectedItem} />}
    </PageLayout>
  );
}
