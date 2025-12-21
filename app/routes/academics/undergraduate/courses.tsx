import type { Route } from '.react-router/types/app/routes/academics/undergraduate/+types/courses';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import useResponsive from '~/hooks/useResponsive';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import CourseCardGrid from '~/routes/academics/undergraduate/components/courses/CourseCardGrid';
import CourseDetailModal from '~/routes/academics/undergraduate/components/courses/CourseDetailModal';
import CourseList from '~/routes/academics/undergraduate/components/courses/CourseList';
import CourseToolbar from '~/routes/academics/undergraduate/components/courses/CourseToolbar';
import courseTranslations from '~/routes/academics/undergraduate/components/courses/translations.json';
import type { Classification, SortOption, ViewOption } from '~/types/academics';
import type { Course } from '~/types/api/v2/academics/courses';
import { getLocaleFromPathname } from '~/utils/string';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const locale = getLocaleFromPathname(url.pathname);
  const response = await fetch(
    `https://cse.snu.ac.kr/api/v2/academics/courses?studentType=undergraduate&sort=${locale}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch undergraduate courses data');
  }
  return (await response.json()) as Course[];
}

export default function UndergraduateCoursesPage({
  loaderData,
}: Route.ComponentProps) {
  const { t, isEnglish } = useLanguage(courseTranslations);
  const subNav = useAcademicsSubNav();
  const title = t('교과과정');
  const breadcrumb = [
    { name: t('학사 및 교과'), path: '/academics' },
    { name: t('학부'), path: '/academics/undergraduate' },
    { name: t('교과과정'), path: '/academics/undergraduate/courses' },
  ];

  const isMobile = useResponsive();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getViewOption = (searchParams: URLSearchParams): ViewOption => {
    const view = searchParams.get('view');
    return VIEW_OPTIONS.includes(view as ViewOption)
      ? (view as ViewOption)
      : '목록형';
  };

  const getSortOption = (searchParams: URLSearchParams): SortOption => {
    const sort = searchParams.get('sort');
    return SORT_OPTIONS.includes(sort as SortOption)
      ? (sort as SortOption)
      : '학년';
  };

  const setViewOption = (option: ViewOption) => {
    searchParams.set('view', option);
    setSearchParams(searchParams);
  };

  const setSortOption = (option: SortOption) => {
    searchParams.set('sort', option);
    setSearchParams(searchParams);
  };

  const viewOption = getViewOption(searchParams);
  const sortOption = getSortOption(searchParams);

  const effectiveViewOption = isMobile ? '목록형' : viewOption;

  const sortedCourses = getSortedCourses(loaderData, sortOption);

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      breadcrumb={breadcrumb}
      subNav={subNav}
    >
      <h4 className="mb-8 text-[17px] font-bold sm:pl-5">{t('교과목 정보')}</h4>
      <CourseToolbar
        hideViewOption={isMobile}
        viewOption={viewOption}
        sortOption={sortOption}
        setViewOption={setViewOption}
        setSortOption={setSortOption}
      />
      {isEnglish && <ClassificationDescription />}
      {effectiveViewOption === '카드형' ? (
        <CourseCardGrid courses={sortedCourses} selectedOption={sortOption} />
      ) : (
        <CourseList
          courses={sortedCourses.flat()}
          onSelectCourse={setSelectedCourse}
        />
      )}
      <CourseDetailModal
        course={selectedCourse}
        open={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
      />
    </PageLayout>
  );
}

const VIEW_OPTIONS: ViewOption[] = ['카드형', '목록형'];
const SORT_OPTIONS: SortOption[] = ['학년', '교과목 구분', '학점'];

const classificationToIndexMap: { [key in Classification]: number } = {
  전공필수: 0,
  전공선택: 1,
  교양: 2,
};

function ClassificationDescription() {
  return (
    <div className="mb-3 ml-5 flex items-center gap-1.5 text-sm text-neutral-400">
      <span className="material-symbols-outlined text-xl font-light">info</span>
      <span className="pt-px">
        RM: Required course for Major&nbsp;&nbsp;/&nbsp;&nbsp;EM: Elective
        course for Major&nbsp;&nbsp;/&nbsp;&nbsp;LE: Liberal Education course
      </span>
    </div>
  );
}

const courseToIndexFnMap: { [key in SortOption]: (course: Course) => number } =
  {
    학년: (course) => Math.max(0, course.grade - 1),
    '교과목 구분': (course) =>
      classificationToIndexMap[course.ko.classification],
    학점: (course) => course.credit - 1,
  };

const getSortedCourses = (courses: Course[], sortOption: SortOption) => {
  const sortedCourses: Course[][] = [];
  courses.forEach((course) => {
    const index = courseToIndexFnMap[sortOption](course);
    if (!sortedCourses[index]) {
      sortedCourses[index] = [];
    }
    sortedCourses[index].push(course);
  });
  return sortedCourses;
};
