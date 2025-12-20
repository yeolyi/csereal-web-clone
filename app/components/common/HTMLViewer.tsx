import './suneditor-contents.css';

import { Autolinker } from 'autolinker';
import useResponsive from '~/hooks/useResponsive';

interface TopRightImage {
  src: string;
  width: number;
  height: number;
  mobileFullWidth?: boolean;
}

interface HTMLViewerProps {
  htmlContent: string;
  topRightImage?: TopRightImage;
  wrapperClassName?: string;
  contentClassName?: string;
}

export default function HTMLViewer({
  htmlContent,
  topRightImage,
  wrapperClassName,
  contentClassName,
}: HTMLViewerProps) {
  const isMobile = useResponsive();

  // 400.XXX같은 값들이 링크 처리되는걸 막기 위해 tldMatches false처리
  const linkedHTML = Autolinker.link(htmlContent, {
    urls: { tldMatches: false },
  }).trim();

  // TODO: 이거 필요한지 확인
  const trimmedHTML = linkedHTML.startsWith('<html>')
    ? linkedHTML.slice(
        linkedHTML.indexOf('<body>') + '<body>'.length,
        linkedHTML.lastIndexOf('</body>') - '</body>'.length,
      )
    : linkedHTML;

  // topRightImage width 계산
  const imageWidth =
    topRightImage && isMobile && topRightImage.mobileFullWidth
      ? undefined
      : topRightImage?.width;

  return (
    <div className={`flow-root ${wrapperClassName ?? ''}`}>
      {topRightImage && (
        <div
          className="relative mb-7 w-full sm:float-right sm:ml-7 sm:w-auto"
          style={imageWidth ? { width: `${imageWidth}px` } : undefined}
        >
          <img
            src={topRightImage.src}
            alt="대표 이미지"
            width={topRightImage.width}
            height={topRightImage.height}
            className="w-full object-contain"
          />
        </div>
      )}
      <div
        className={`sun-editor-editable ${contentClassName ?? ''}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO 근데 대안이 있나?
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
    </div>
  );
}
