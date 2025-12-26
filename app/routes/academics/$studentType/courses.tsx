import type { Route } from '.react-router/types/app/routes/academics/$studentType/+types/courses';
import { BASE_URL } from '~/constants/api';
import CoursesPage from '~/routes/academics/components/courses/CoursesPage';
import type { Course, StudentType } from '~/types/api/v2/academics';
import { fetchJson } from '~/utils/fetch';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request, params }: Route.LoaderArgs) {
  const { studentType } = params;
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  return await fetchJson<Course[]>(
    `${BASE_URL}/v2/academics/courses?studentType=${studentType}&sort=${locale}`,
  );
}

export default function CoursesRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType } = params;
  return (
    <CoursesPage
      courses={loaderData}
      studentType={studentType as StudentType}
      hideSortOption={studentType === 'graduate'}
    />
  );
}
