import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  fillHTMLEditor,
  fillTextInput,
  selectDate,
  submitForm,
  toggleCheckbox,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('새소식 메인-중요 안내 설정 테스트', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const title = `중요 새소식 ${dateTimeString}`;
  const description = `중요 내용 ${dateTimeString}`;
  const date = new Date();
  date.setDate(date.getDate() + 1);

  // 새소식 작성
  await page.goto('/community/news');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/news/create');

  await fillTextInput(page, 'title', title);
  await selectDate(page, '시기', date);
  await fillHTMLEditor(page, description);
  await toggleCheckbox(page, '메인-중요 안내에 표시');

  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/news\/\d+$/);

  // 중요 안내 표시 확인
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);

  // 삭제
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/news\/edit\/\d+$/);

  await page
    .getByRole('button', { name: '삭제' })
    .filter({ hasText: '삭제' })
    .last()
    .click();
  await page
    .getByRole('alertdialog')
    .getByRole('button', { name: '확인' })
    .click();
  await page.waitForURL('**/community/news');
});
