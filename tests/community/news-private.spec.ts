import { expect, test } from '@playwright/test';
import { loginAsStaff, logout } from '../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  selectDate,
  submitForm,
  toggleCheckbox,
} from '../helpers/form-components';
import { getKoreanDateTime } from '../helpers/utils';

test('비공개 글 설정 검증', async ({ page }) => {
  const dateTimeString = getKoreanDateTime();
  const title = `비공개 새소식 ${dateTimeString}`;
  const description = `비공개 내용 ${dateTimeString}`;
  const date = new Date();
  date.setDate(date.getDate() + 1);

  // === 1단계: 비공개 새소식 작성 ===
  await page.goto('/community/news');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/news/create');

  await fillTextInput(page, 'title', title);
  await selectDate(page, '시기', date);
  await fillHTMLEditor(page, description);
  await toggleCheckbox(page, '비공개 글');

  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/news\/\d+$/);

  const url = page.url();
  const newsId = url.match(/\/community\/news\/(\d+)$/)?.[1];
  expect(newsId).toBeDefined();

  // === 2단계: 로그인 상태에서는 보임 ===
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);

  // === 3단계: 로그아웃 후 접근 시도 ===
  await logout(page);
  await page.goto(`/community/news/${newsId}`);

  // 비공개 글은 로그아웃 상태에서 접근 불가 (404 또는 접근 제한 메시지)
  await expect(page.locator('body')).not.toContainText(description);

  // === 4단계: 삭제 (다시 로그인) ===
  await loginAsStaff(page);
  await page.goto(`/community/news/${newsId}`);

  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForLoadState('load');
  await page.getByRole('link', { name: '편집' }).waitFor({ state: 'visible' });

  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/news\/edit\/\d+$/);
  await deleteItem(page);
  await page.waitForURL('**/community/news');
});
