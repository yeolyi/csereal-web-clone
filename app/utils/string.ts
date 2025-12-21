export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    'Bytes',
    'KiB',
    'MiB',
    'GiB',
    'TiB',
    'PiB',
    'EiB',
    'ZiB',
    'YiB',
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`;
};

/**
 * URL pathname에서 locale을 추출합니다.
 * @param pathname - URL의 pathname (예: '/en/about/greetings' 또는 '/about/greetings')
 * @returns 'en' 또는 'ko'
 */
export const getLocaleFromPathname = (pathname: string): 'en' | 'ko' => {
  return pathname.startsWith('/en') ? 'en' : 'ko';
};

export const encodeParam = (words: string) => words.replace(/\s+/g, '-');
export const decodeParam = (words: string) => words.replace(/-/g, ' ');

/**
 * 검색 파라미터를 사용하여 배열에서 항목을 찾습니다.
 * @param items - 검색할 항목 배열
 * @param getItemIds - 각 항목의 ID들을 반환하는 함수
 * @param searchParam - 검색 파라미터 (선택적)
 * @returns 찾은 항목 또는 첫 번째 항목 (없으면 undefined)
 */
export const findItemBySearchParam = <T>(
  items: T[],
  getItemIds: (item: T) => string[],
  searchParam?: string,
): T | undefined => {
  const defaultItem = items[0];
  if (!searchParam) return defaultItem;

  const id = decodeParam(searchParam);
  const item = items.find((item) =>
    getItemIds(item)
      .map((id) => decodeParam(id))
      .includes(id),
  );
  return item;
};
