import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import { useLanguage } from '~/hooks/useLanguage';
import { useNavItem } from '~/hooks/useNavItem';
import { useAdmissionsSubNav } from '~/hooks/useSubNav';

interface AdmissionsPageContentProps {
  description: string;
  layout?: 'default' | 'extraBottom';
}

export default function AdmissionsPageContent({
  description,
  layout = 'default',
}: AdmissionsPageContentProps) {
  const { t, tUnsafe, localizedPath } = useLanguage();
  const { activeItem } = useNavItem();
  const subNav = useAdmissionsSubNav();
  const title = activeItem ? tUnsafe(activeItem.key) : t('입학');
  const wrapperClass = layout === 'extraBottom' ? 'pb-16 sm:pb-[220px]' : '';

  // activeItem.path가 있으면 자동으로 editPath 생성
  const editPath = activeItem?.path ? `${activeItem.path}/edit` : null;

  return (
    <PageLayout
      title={title}
      titleSize="xl"
      subNav={subNav}
      padding={layout === 'extraBottom' ? 'noBottom' : 'default'}
    >
      {editPath && (
        <LoginVisible allow="ROLE_STAFF">
          <div className="mb-7 text-right">
            <Button
              as="link"
              to={localizedPath(editPath)}
              variant="outline"
              tone="neutral"
              size="md"
            >
              편집
            </Button>
          </div>
        </LoginVisible>
      )}
      <div className={wrapperClass}>
        <HTMLViewer html={description} />
      </div>
    </PageLayout>
  );
}
