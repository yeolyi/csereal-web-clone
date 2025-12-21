import { Link } from 'react-router';
import HTMLViewer from '~/components/common/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import type { ResearchGroup } from '~/types/api/v2/research/groups';

interface ResearchGroupDetailsProps {
  group: ResearchGroup;
}

export default function ResearchGroupDetails({
  group,
}: ResearchGroupDetailsProps) {
  const { t, localizedPath } = useLanguage({
    스트림: 'Stream',
    연구실: 'Labs',
  });
  const labsPath = localizedPath('/research/labs');

  return (
    <div className="flex flex-col bg-neutral-100 px-7 pb-9 pt-8 sm:pb-[100px] sm:pl-[100px] sm:pr-[320px] sm:pt-[50px]">
      <h2 className="mb-6 ml-1 whitespace-nowrap text-base font-bold leading-loose sm:mx-0 sm:mb-[18px] sm:text-[24px]">
        {group.name} {t('스트림')}
      </h2>
      <div className="max-w-[780px] bg-white p-[18px] sm:p-[40px]">
        <HTMLViewer html={group.description} />
      </div>
      {group.mainImageUrl && (
        <div className="relative mt-10 aspect-2/1 w-[80%] max-w-[720px] self-end">
          <img
            src={group.mainImageUrl}
            alt={`${group.name} 연구 스트림 사진`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="mt-10 sm:mx-0">
        <h3 className="mb-1 whitespace-nowrap text-md font-bold leading-loose sm:py-1 sm:pl-2.5 sm:text-[20px]">
          {t('연구실')}
        </h3>
        <ul>
          {group.labs.map((lab) => (
            <li key={lab.id} className="mb-0.5 w-fit whitespace-nowrap">
              <Link
                to={`${labsPath}/${lab.id}`}
                className="group flex h-7 items-center gap-2.5 sm:px-3"
              >
                <span className="h-2.5 w-2.5 rounded-full border border-main-orange duration-300 group-hover:bg-main-orange" />
                <span className="text-sm font-medium duration-300 group-hover:text-main-orange sm:text-md">
                  {lab.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
