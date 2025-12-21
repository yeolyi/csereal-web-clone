import { useLocation } from 'react-router';
import { type NavItem, navigationTree } from '~/constants/navigation';
import { useLanguage } from '~/hooks/useLanguage';

export function useNavItem() {
  const { pathWithoutLocale } = useLanguage();
  const { pathname } = useLocation();

  const activeItem = findNavItemByPath(navigationTree, pathWithoutLocale);
  const topLevelItem = activeItem ? findTopLevelItem(activeItem) : null;

  /**
   * 현재 pathname이 targetPath에 대해 활성화되어야 하는지 판단
   * 정확한 매칭 또는 현재 경로가 대상 경로의 하위 경로인 경우 true 반환
   */
  const isActive = (targetPath: string | undefined) => {
    if (!targetPath) return false;
    return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
  };

  return { activeItem, topLevelItem, isActive };
}

/**
 * 두 경로 간의 활성화 여부를 판단하는 유틸 함수
 * (LeftNavDetail 등에서 activeItem.path와 item.path를 비교할 때 사용)
 */
export function isPathActive(
  currentPath: string,
  targetPath: string | undefined,
): boolean {
  if (!targetPath) return false;
  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

function findNavItemByPath(
  items: NavItem[],
  targetPath: string,
): NavItem | null {
  let bestMatch: NavItem | null = null;
  let bestMatchLength = 0;

  for (const item of items) {
    // path가 있는 항목만 비교
    if (item.path) {
      // 정확히 일치하면 바로 반환
      if (item.path === targetPath) return item;

      // 현재 경로가 항목 경로로 시작하면 (부분 일치)
      // 가장 긴 일치를 찾기 위해 저장
      if (
        targetPath.startsWith(item.path) &&
        item.path.length > bestMatchLength
      ) {
        bestMatch = item;
        bestMatchLength = item.path.length;
      }
    }

    if (item.children) {
      const found = findNavItemByPath(item.children, targetPath);
      if (found) {
        // 자식에서 찾은 것이 더 구체적이므로 우선
        return found;
      }
    }
  }

  return bestMatch;
}

function findTopLevelItem(activeItem: NavItem): NavItem | null {
  // navigationTree의 직접 자식 중에서 activeItem의 조상 찾기
  for (const topLevel of navigationTree) {
    if (topLevel.key === activeItem.key) return topLevel;
    if (isAncestorNavItem(topLevel, activeItem)) return topLevel;
  }

  return null;
}

// Helper: Check if parentItem is an ancestor of childItem
export function isAncestorNavItem(
  parentItem: NavItem,
  childItem: NavItem | null,
): boolean {
  if (!childItem) return false;

  // 중복 key가 있어도 참조 동일성으로 경로를 판별
  const path = findPathToItem(navigationTree, childItem);
  if (!path) return false;

  // child 포함 경로 중에 parent가 있는지 확인
  return path.some((item) => item === parentItem);
}

// 특정 항목까지의 경로(루트→타겟)를 찾음
function findPathToItem(
  items: NavItem[],
  target: NavItem,
  acc: NavItem[] = [],
): NavItem[] | null {
  for (const item of items) {
    const newPath = [...acc, item];
    if (item === target) return newPath;
    if (item.children) {
      const found = findPathToItem(item.children, target, newPath);
      if (found) return found;
    }
  }
  return null;
}
