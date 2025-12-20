import { Link } from 'react-router';
import CornerFoldedRectangle from '~/components/common/CornerFoldedRectangle';
import { COLOR_THEME } from '~/constants/color';
import { useLanguage } from '~/hooks/useLanguage';
import { replaceSpaceWithDash } from '~/utils/string';

interface SelectionListProps {
  names: { ko: string; en: string }[];
  selectedItemNameKo: string;
  rootPath: string;
}

export default function SelectionList({
  names,
  selectedItemNameKo,
  rootPath,
}: SelectionListProps) {
  const { locale } = useLanguage();

  return (
    <ul className="mb-6 grid grid-cols-2 gap-3 pt-7 sm:mb-9 sm:pt-11 lg:grid-cols-[repeat(auto-fit,minmax(200px,auto))]">
      {names.map((name) => (
        <SelectionItem
          key={name.ko}
          href={`${rootPath}?selected=${replaceSpaceWithDash(name.en || name.ko)}`}
          name={name[locale] ?? name.ko}
          isSelected={name.ko === selectedItemNameKo}
        />
      ))}
    </ul>
  );
}

interface SelectionItemProps {
  name: string;
  isSelected: boolean;
  href: string;
}

function SelectionItem({ name, isSelected, href }: SelectionItemProps) {
  const itemCommonStyle =
    'flex items-center justify-center w-full h-10 py-3 text-center text-[11px] sm:text-sm lg:text-md tracking-wide';
  const triangleLength = 1.25; // 20px
  const radius = 0.125; // 2px
  const dropShadow = 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3)';

  return (
    <li>
      {isSelected ? (
        <CornerFoldedRectangle
          colorTheme={COLOR_THEME.orange}
          triangleLength={triangleLength}
          radius={radius}
          triangleDropShadow={dropShadow}
          width="w-full"
        >
          <span className={`${itemCommonStyle} font-medium text-neutral-50`}>
            {name}
          </span>
        </CornerFoldedRectangle>
      ) : (
        <CornerFoldedRectangle
          colorTheme={COLOR_THEME.lightGray}
          triangleLength={triangleLength}
          radius={radius}
          triangleDropShadow={dropShadow}
          animationType="folding"
          width="w-full"
        >
          <Link
            to={href}
            className={`${itemCommonStyle} text-neutral-500 transition-all duration-300 hover:text-neutral-800`}
          >
            {name}
          </Link>
        </CornerFoldedRectangle>
      )}
    </li>
  );
}
