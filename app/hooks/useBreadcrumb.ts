import type { BreadcrumbItem } from '~/components/layout/PageLayout';
import { navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';
import { findPathToItem, useNavItem } from '~/hooks/useNavItem';

export function useBreadcrumb(): BreadcrumbItem[] {
  const { activeItem } = useNavItem();
  const { tUnsafe } = useLanguage();

  if (!activeItem) return [];

  const path = findPathToItem(navigationTree, activeItem);
  if (!path) return [];

  return path
    .filter((item) => item.path) // path가 있는 항목만
    .map((item) => ({
      name: tUnsafe(item.key),
      path: item.path,
    }));
}
