import PageLayout from '~/components/layout/PageLayout';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { useLanguage } from '~/hooks/useLanguage';

const META = {
  ko: {
    title: 'Manager',
    description:
      '서울대학교 컴퓨터공학부 10-10 Project Manager 안내입니다. 프로젝트 총괄 책임자 정보를 확인하실 수 있습니다.',
  },
  en: {
    title: 'Manager',
    description:
      '10-10 Project Manager information for the Department of Computer Science and Engineering, Seoul National University.',
  },
};

export default function TenTenManagerPage() {
  const { t, localizedPath, locale } = useLanguage();

  const subNav = {
    title: t('10-10 Project'),
    titlePath: '/10-10-project',
    items: [
      { name: t('Proposal'), path: '/10-10-project/proposal' },
      { name: t('Manager'), path: '/10-10-project/manager' },
      {
        name: t('Participants(Professors)'),
        path: '/10-10-project/participants',
      },
    ],
  };

  const htmlContent = `<h3>Professor Soonhoi Ha (Department Head)<br /></h3>
<p>Codesign And Parallel Processing Lab</p>
<p>Contact info</p>
<p>Office: 301 Building, Room 408</p>
<p>Phone: (02) 880-8382 Fax: (02) 886-7589</p>
<p>Email: sha@iris.snu.ac.kr</p>
<p>
  Website:&nbsp;<a rel="nofollow" href="http://peace.snu.ac.kr/sha/">http://peace.snu.ac.kr/sha/</a>
</p>
<p>Education Ph.D. in EECS, University of California, Berkeley, 1992</p>
<p>Introduction&nbsp;:<a rel="nofollow" href="${localizedPath(
    '/about/greetings',
  )}">${localizedPath('/about/greetings')}</a></p>
<h3>Curricular Vitae (CV)&nbsp;</h3>
<p>
  <a
    rel="nofollow"
    href="https://docs.google.com/document/d/1WmpKLWIv_xjwFv4VFOItJ4vuhfAPi-67JRCl6pszHoI/edit"
    >https://docs.google.com/document/d/1WmpKLWIv_xjwFv4VFOItJ4vuhfAPi-67JRCl6pszHoI/edit</a
  >
</p>
`;

  const meta = META[locale];

  return (
    <PageLayout
      title={t('Manager')}
      titleSize="xl"
      subNav={subNav}
      pageTitle={meta.title}
      pageDescription={meta.description}
    >
      <HTMLViewer html={htmlContent} />
    </PageLayout>
  );
}
