import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../../helpers/auth';
import {
  fillHTMLEditor,
  submitForm,
  switchEditorLanguage,
} from '../../helpers/form-components';
import { switchPageLanguage } from '../../helpers/navigation';
import { getKoreanDateTime } from '../../helpers/utils';

test('외국인 학부 입학 편집 및 한/영 내용 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const koText = `Playwright KO ${dateTimeString}`;
  const enText = `Playwright EN ${dateTimeString}`;

  // 1. 로그인
  await page.goto('/admissions/international/undergraduate');
  await loginAsStaff(page);

  // 2. 편집 페이지로 이동
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL('**/admissions/international/undergraduate/edit');

  // 3. 폼 입력
  await fillHTMLEditor(page, koText);
  await switchEditorLanguage(page, 'en');
  await fillHTMLEditor(page, enText);
  await switchEditorLanguage(page, 'ko');

  // 4. 제출
  await submitForm(page);
  await page.waitForURL('**/admissions/international/undergraduate');

  // 5. 검증 - 한글 페이지
  await expect(page.locator('body')).toContainText(koText);

  // 6. 검증 - 영문 페이지
  await switchPageLanguage(
    page,
    'en',
    '/admissions/international/undergraduate',
  );
  await expect(page.locator('body')).toContainText(enText);
});
