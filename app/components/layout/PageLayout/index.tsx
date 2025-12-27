import type { ReactNode } from 'react';
import { useBreadcrumb } from '~/hooks/useBreadcrumb';
import Header from '../Header';
import PageTitle from './PageTitle';
import SubNavbar, { type SubNavItem } from './SubNavbar';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

export interface SubNavConfig {
  title: string;
  titlePath: string;
  items: SubNavItem[];
}

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  titleSize: 'xl' | 'lg';
  titleMargin?: string;
  padding?: 'default' | 'none' | 'noTop' | 'noBottom';
  subNav?: SubNavConfig;
  children: ReactNode;
}

/**
 * 본문 기본 스타일
 * padding-left: 100px
 * padding-right: 360px
 * padding-top: 44px
 * padding-bottom: 150px
 * background-color: white
 */
export default function PageLayout({
  title,
  subtitle,
  breadcrumb,
  titleSize,
  titleMargin = 'mb-6 sm:mb-11',
  padding = 'default',
  subNav,
  children,
}: PageLayoutProps) {
  const generatedBreadcrumb = useBreadcrumb();
  const finalBreadcrumb = breadcrumb ?? generatedBreadcrumb;

  const paddingClass =
    padding === 'none'
      ? 'p-0'
      : padding === 'noTop'
        ? 'p-[0_1.25rem_4rem_1.25rem] sm:p-[0_360px_150px_100px]'
        : padding === 'noBottom'
          ? 'p-[1.75rem_1.25rem_0_1.25rem] sm:p-[2.75rem_360px_0_100px]'
          : 'p-[1.75rem_1.25rem_4rem_1.25rem] sm:p-[2.75rem_360px_150px_100px]';

  return (
    <div className="flex grow flex-col bg-neutral-900">
      <Header />
      {(title || finalBreadcrumb.length > 0) && (
        <PageTitle
          title={title}
          subtitle={subtitle}
          breadcrumb={finalBreadcrumb}
          titleSize={titleSize}
          margin={titleMargin}
        />
      )}
      <div className={`relative grow bg-white ${paddingClass}`}>
        {children}
        {subNav && <SubNavbar {...subNav} />}
      </div>
    </div>
  );
}
