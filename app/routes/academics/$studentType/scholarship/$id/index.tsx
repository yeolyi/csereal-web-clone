import type { Route } from '.react-router/types/app/routes/academics/$studentType/scholarship/$id/+types/index';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import LoginVisible from '~/components/feature/auth/LoginVisible';
import PageLayout from '~/components/layout/PageLayout';
import AlertDialog from '~/components/ui/AlertDialog';
import Button from '~/components/ui/Button';
import HTMLViewer from '~/components/ui/HTMLViewer';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import { useAcademicsSubNav } from '~/hooks/useSubNav';
import { fetchJson, fetchOk } from '~/utils/fetch';
import { stripHtml, truncateDescription } from '~/utils/metadata';

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const res = await fetchJson<{ first: any; second: any }>(
    `${BASE_URL}/v2/academics/scholarship/${id}`,
  );
  const isFirstKo = res.first.language === 'ko';
  return isFirstKo
    ? { ko: res.first, en: res.second }
    : { ko: res.second, en: res.first };
}

export default function ScholarshipDetailPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { studentType, id } = params;
  const { locale, t } = useLanguage({
    '장학금을 삭제했습니다.': 'Scholarship deleted successfully.',
    '장학금을 삭제하지 못했습니다.': 'Failed to delete scholarship.',
  });
  const navigate = useNavigate();
  const subNav = useAcademicsSubNav();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const scholarship = loaderData[locale];
  const name = scholarship.name;
  // 타이틀이 긴 경우 괄호 내부 내용을 제거
  const shortTitle = name.length > 20 ? name.replace(/\([^)]*\)/g, '') : name;

  const studentLabel = studentType === 'graduate' ? t('대학원') : t('학부');

  // 메타데이터 생성
  const pageTitle =
    locale === 'en'
      ? `${name} | ${studentType === 'graduate' ? 'Graduate' : 'Undergraduate'} Scholarship`
      : `${name} | ${studentLabel} 장학금`;

  const pageDescription = scholarship.description
    ? truncateDescription(stripHtml(scholarship.description))
    : locale === 'en'
      ? `${name} scholarship information for ${studentType === 'graduate' ? 'graduate' : 'undergraduate'} students at the Department of CSE, SNU.`
      : `서울대학교 컴퓨터공학부 ${studentLabel} ${name} 장학금 안내입니다.`;

  const handleDelete = async () => {
    try {
      await fetchOk(`${BASE_URL}/v2/academics/scholarship/${id}`, {
        method: 'DELETE',
      });
      toast.success(t('장학금을 삭제했습니다.'));
      navigate(`/academics/${studentType}/scholarship`);
    } catch {
      toast.error(t('장학금을 삭제하지 못했습니다.'));
    }
  };

  return (
    <PageLayout
      title={shortTitle}
      titleSize="xl"
      subNav={subNav}
      pageTitle={pageTitle}
      pageDescription={pageDescription}
    >
      <LoginVisible allow="ROLE_STAFF">
        <div className="mb-8 flex justify-end gap-3">
          <Button
            variant="outline"
            tone="neutral"
            onClick={() => setShowDeleteDialog(true)}
          >
            삭제
          </Button>
          <Button variant="outline" tone="neutral" as="link" to="edit">
            편집
          </Button>
        </div>
      </LoginVisible>
      <HTMLViewer html={scholarship.description} />

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        description="장학금을 삭제하시겠습니까?"
        confirmText="삭제"
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}
