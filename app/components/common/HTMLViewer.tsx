import './suneditor-contents.css';

import { Autolinker } from 'autolinker';

interface HTMLViewerProps {
  htmlContent: string;
  wrapperClassName?: string;
  contentClassName?: string;
}

export default function HTMLViewer({
  htmlContent,
  wrapperClassName,
  contentClassName,
}: HTMLViewerProps) {
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

  return (
    <div className={`flow-root ${wrapperClassName}`}>
      <div
        className={`sun-editor-editable ${contentClassName}`}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: TODO 근데 대안이 있나?
        dangerouslySetInnerHTML={{ __html: trimmedHTML }}
      />
    </div>
  );
}
