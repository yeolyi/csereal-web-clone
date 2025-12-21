import { useReducer, useState } from 'react';
import Attachments from '~/components/common/Attachments';
import HTMLViewer from '~/components/common/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';
import type { TimelineContent } from '~/types/api/v2/academics';
import Timeline from './Timeline';

interface TimelineViewerProps<T> {
  contents: T[];
  title: { text: string; unit: string };
  yearLimitCount?: number;
}

export default function TimelineViewer<T extends TimelineContent>({
  contents,
  title,
  yearLimitCount = 10,
}: TimelineViewerProps<T>) {
  const { t, tUnsafe } = useLanguage({
    이하: 'or earlier',
    '내용은 없습니다.': 'No content available.',
  });
  const [selectedYear, setSelectedYear] = useState(contents[0]?.year ?? 0);
  const timeLineYears = contents
    .map((change) => change.year)
    .slice(0, yearLimitCount);
  const yearLimit = timeLineYears.at(-1) ?? 0;
  const selectedContents = getSelectedContents(
    selectedYear,
    yearLimit,
    contents,
    tUnsafe,
  );

  if (contents.length === 0) {
    return null;
  }

  return (
    <>
      <Timeline
        times={timeLineYears}
        selectedTime={selectedYear}
        setSelectedTime={setSelectedYear}
      />
      <div className="mt-7">
        {selectedContents.length === 1 ? (
          <ContentViewer
            description={selectedContents[0].description}
            title={`${selectedContents[0].year}${title.unit} ${title.text}`}
            attachments={selectedContents[0].attachments}
          />
        ) : (
          selectedContents.map((change, i) => {
            const isLast = i !== 0 && i === selectedContents.length - 1;
            return (
              <TogglableContentViewer
                description={change.description}
                expandDefault={i === 0}
                title={`${change.year}${title.unit}${isLast ? ` ${t('이하')}` : ''} ${title.text}`}
                attachments={change.attachments}
                key={change.year}
              />
            );
          })
        )}
      </div>
    </>
  );
}

function ContentViewer({
  description,
  title,
  attachments,
}: {
  description: string;
  title: string;
  attachments: TimelineContent['attachments'];
}) {
  return (
    <div className="mb-5">
      <div className="mb-4 font-semibold">{title}</div>
      <Attachments files={attachments} />
      <div className="rounded-sm bg-neutral-50 p-5">
        <HTMLViewer html={description} />
      </div>
    </div>
  );
}

function TogglableContentViewer({
  description,
  expandDefault = false,
  title,
  attachments,
}: {
  description: string;
  expandDefault?: boolean;
  title: string;
  attachments: TimelineContent['attachments'];
}) {
  const [isExpanded, toggleContent] = useReducer((x) => !x, expandDefault);

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={toggleContent}
        className="mb-4 flex items-center hover:text-main-orange"
      >
        <span className="material-symbols-outlined text-2xl font-light">
          {isExpanded ? 'expand_less' : 'expand_more'}
        </span>
        <span className="font-semibold">{title}</span>
      </button>
      {isExpanded && (
        <>
          <Attachments files={attachments} />
          <div className="rounded-sm bg-neutral-50 p-5">
            <HTMLViewer html={description} />
          </div>
        </>
      )}
    </div>
  );
}

const getSelectedContents = <T extends TimelineContent>(
  year: number,
  yearLimit: number,
  data: T[],
  t: (key: string) => string,
): T[] | TimelineContent[] => {
  if (year <= yearLimit) return data.filter((d) => d.year <= yearLimit);

  const change = data.find((d) => d.year === year);
  return change
    ? [change]
    : [
        {
          year,
          description: `${year} ${t('내용은 없습니다.')}`,
          attachments: [],
        },
      ];
};
