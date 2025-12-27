import { lazy, Suspense, useEffect, useState } from 'react';

import type { HTMLEditorProps } from './HTMLEditor';
import HTMLEditorFallback from './HTMLEditorFallback';

const HTMLEditor = lazy(() => import('./HTMLEditor'));

export default function LazyHTMLEditor(props: HTMLEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <HTMLEditorFallback />;
  }

  return (
    <Suspense fallback={<HTMLEditorFallback />}>
      <HTMLEditor {...props} />
    </Suspense>
  );
}
