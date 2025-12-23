import { lazy, Suspense } from 'react';

import type { HTMLEditorProps } from './HTMLEditor';
import HTMLEditorFallback from './HTMLEditorFallback';

const HTMLEditor = lazy(() => import('./HTMLEditor'));

export default function LazyHTMLEditor(props: HTMLEditorProps) {
  return (
    <Suspense fallback={<HTMLEditorFallback />}>
      <HTMLEditor {...props} />
    </Suspense>
  );
}
