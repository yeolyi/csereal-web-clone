import type { Attachment } from '~/types/api/attachment';
import { formatBytes } from '~/utils/string';
import clipIcon from './assets/clip.svg';

interface AttachmentsProps {
  files: Attachment[];
  margin?: string;
  padding?: string;
}

export default function Attachments({
  files,
  margin = 'mb-9 mt-3 sm:mb-11 sm:mt-5',
  padding = 'py-3 pl-4 pr-20 sm:pr-[10rem]',
}: AttachmentsProps) {
  if (files.length === 0) return null;

  return (
    <div
      className={`relative flex flex-col gap-2 self-start rounded-sm border border-neutral-200 bg-white sm:w-auto sm:max-w-fit ${margin} ${padding}`}
    >
      {files.map((file, index) => {
        const byteStr = formatBytes(file.bytes);
        const key = `${file.url}-${index}`;

        return (
          <a
            key={key}
            className="flex text-sm font-normal hover:underline"
            href={encodeURI(file.url)}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {file.name}
            </span>
            <span className="ml-2">({byteStr})</span>
          </a>
        );
      })}

      <img src={clipIcon} alt="" className="absolute right-2 -top-6" />
    </div>
  );
}
