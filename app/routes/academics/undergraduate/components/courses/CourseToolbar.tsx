import { Tag } from '~/components/common/Tag';
import { useLanguage } from '~/hooks/useLanguage';
import type { SortOption, ViewOption } from '~/types/academics';
import translations from './translations.json';

interface CourseToolbarProps {
  hideViewOption?: boolean;
  hideSortOption?: boolean;
  viewOption: ViewOption;
  sortOption: SortOption;
  setViewOption: (option: ViewOption) => void;
  setSortOption: (option: SortOption) => void;
}

export default function CourseToolbar({
  hideViewOption = false,
  hideSortOption = false,
  viewOption,
  sortOption,
  setViewOption,
  setSortOption,
}: CourseToolbarProps) {
  return (
    <div className="mb-5 flex items-center justify-between sm:pl-5">
      {hideViewOption || (
        <ViewOptions
          selectedOption={viewOption}
          changeOption={(option) => setViewOption(option)}
        />
      )}
      {hideSortOption || (
        <SortOptions
          selectedOption={sortOption}
          changeOption={(option) => setSortOption(option)}
        />
      )}
    </div>
  );
}

interface ViewOptionsProps {
  selectedOption: ViewOption;
  changeOption: (option: ViewOption) => void;
}

function ViewOptions({ selectedOption, changeOption }: ViewOptionsProps) {
  const { t } = useLanguage(translations);

  return (
    <div className="flex gap-3 text-md text-neutral-400">
      <button
        type="button"
        className={
          selectedOption === '목록형' ? 'text-neutral-800' : 'cursor-pointer'
        }
        onClick={() => changeOption('목록형')}
      >
        {t('목록형')}
      </button>
      <span>|</span>
      <button
        type="button"
        className={
          selectedOption === '카드형' ? 'text-neutral-800' : 'cursor-pointer'
        }
        onClick={() => changeOption('카드형')}
      >
        {t('카드형')}
      </button>
    </div>
  );
}

interface SortOptionsProps {
  selectedOption: SortOption;
  changeOption: (option: SortOption) => void;
}

export const SORT_OPTIONS: SortOption[] = ['학년', '교과목 구분', '학점'];

function SortOptions({ selectedOption, changeOption }: SortOptionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {SORT_OPTIONS.map((option) => (
        <Tag
          key={option}
          label={option}
          variant={option === selectedOption ? 'solid' : 'outline'}
          onClick={
            option === selectedOption ? undefined : () => changeOption(option)
          }
        />
      ))}
    </div>
  );
}
