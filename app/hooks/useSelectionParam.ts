import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

type KeyOf<T> = Extract<keyof T, string>;

interface UseSelectionParamOptions<T> {
  items: T[];
  basePath: string;
  idKey?: KeyOf<T>;
  labelKey?: KeyOf<T>;
}

interface UseSelectionParamResult<T> {
  selectedItem?: T;
  getUrl: (item: T) => string;
  getOnClick: (item: T) => () => void;
}

export default function useSelectionParam<T>({
  items,
  basePath,
  idKey = 'id' as KeyOf<T>,
  labelKey = 'label' as KeyOf<T>,
}: UseSelectionParamOptions<T>): UseSelectionParamResult<T> {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentParams = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const rawParam = currentParams.get('selected') ?? undefined;
  const selectedParam = rawParam ? decodeURIComponent(rawParam) : undefined;

  const selectedItem = useMemo(() => {
    if (items.length === 0) return undefined;
    if (!selectedParam) return items[0];

    const match = items.find((item) => String(item[idKey]) === selectedParam);

    return match ?? items[0];
  }, [items, selectedParam, idKey]);

  const getUrl = useCallback(
    (item: T) => {
      const id = String(item[idKey]);
      const params = new URLSearchParams(currentParams);
      params.set('selected', encodeURIComponent(id));
      return `${basePath}?${params.toString()}`;
    },
    [currentParams, basePath, idKey],
  );

  const getOnClick = useCallback(
    (item: T) => () => {
      navigate(getUrl(item), { preventScrollReset: true });
    },
    [navigate, getUrl],
  );

  void labelKey;

  return {
    selectedItem,
    getUrl,
    getOnClick,
  };
}
