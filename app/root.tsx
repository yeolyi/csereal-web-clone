import type { Route } from '.react-router/types/app/+types/root';
import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import './app.css';
import LNB from '~/components/layout/navbar/LNB';
import { getLocaleFromPathname } from '~/utils/i18n';

// Loader for handling redirects and setting language
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // /ko/* → /* redirect
  if (pathname.startsWith('/ko')) {
    return redirect(pathname.replace('/ko', '') || '/');
  }

  // / 진입 시 언어 감지
  if (pathname === '/') {
    // Detect browser language
    const acceptLanguage = request.headers.get('accept-language');
    const browserLang = acceptLanguage?.split(',')[0]?.toLowerCase();

    // If browser language is English, redirect to /en
    if (browserLang?.startsWith('en')) {
      return redirect('/en');
    }
  }

  // Determine locale from pathname
  const locale = getLocaleFromPathname(pathname);

  return { locale };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { locale } = loaderData;

  return (
    <html lang={locale} className="bg-neutral-900 font-normal text-neutral-950">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="sm:min-w-[1200px]">
        <LNB />
        <main className="flex min-h-full min-w-full flex-col sm:pl-25">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
