import { expect, test } from '@playwright/test';
import { loginAsStaff } from '../helpers/auth';
import {
  deleteItem,
  fillHTMLEditor,
  fillTextInput,
  selectDate,
  submitForm,
  toggleCheckbox,
  uploadFiles,
  uploadImage,
} from '../helpers/form-components';
import { switchPageLanguage } from '../helpers/navigation';
import { createTestImage, createTestTextFile } from '../helpers/test-assets';
import { getKoreanDateTime } from '../helpers/utils';

test('새소식 작성→확인→편집→확인→삭제 플로우 검증', async ({
  page,
}, testInfo) => {
  // === 테스트 데이터 준비 ===
  const dateTimeString = getKoreanDateTime();
  const title = `테스트 새소식 ${dateTimeString}`;
  const description = `새소식 내용 ${dateTimeString}`;
  const date = new Date(); // 오늘
  date.setDate(date.getDate() + 1); // 내일
  const { imagePath } = await createTestImage(testInfo, dateTimeString);
  const { filePath, fileName } = createTestTextFile(testInfo, dateTimeString);
  const tags = ['행사', '채용', '수상']; // 테스트할 태그들

  const editedTitle = `${title} (수정됨)`;
  const editedDescription = `${description} [편집됨]`;
  const editedDate = new Date(); // 오늘
  editedDate.setDate(editedDate.getDate() + 2); // 모레
  const editedTags = ['강연', '교육']; // 편집 시 변경할 태그들

  // === 1단계: 새소식 작성 ===
  await page.goto('/community/news');
  await loginAsStaff(page);
  await page.getByRole('link', { name: '새 게시글' }).click();
  await page.waitForURL('**/community/news/create');

  // 제목, 내용, 시기, 대표 이미지, 첨부파일, 태그 입력
  await fillTextInput(page, 'title', title);
  await selectDate(page, '시기', date);
  await fillHTMLEditor(page, description);
  await uploadImage(page, imagePath);
  await uploadFiles(page, filePath);

  // 태그 선택
  for (const tag of tags) {
    await toggleCheckbox(page, tag);
  }

  // 제출
  await submitForm(page, '게시하기');
  // 응답에서 받은 ID로 상세 페이지로 리다이렉트됨
  await page.waitForURL(/\/community\/news\/\d+$/);

  // URL에서 생성된 ID 추출
  const url = page.url();
  const newsId = url.match(/\/community\/news\/(\d+)$/)?.[1];
  expect(newsId).toBeDefined();

  // === 2단계: 작성된 새소식 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);
  await expect(page.locator('body')).toContainText(fileName);
  // 태그 확인
  for (const tag of tags) {
    await expect(page.locator('body')).toContainText(tag);
  }

  // === 3단계: 작성된 새소식 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/community/news/${newsId}`);
  await expect(page.locator('body')).toContainText(title);
  await expect(page.locator('body')).toContainText(description);
  await expect(page.locator('body')).toContainText(fileName);
  // 태그 확인 (영문에서도 동일한 태그명 표시)
  for (const tag of tags) {
    await expect(page.locator('body')).toContainText(tag);
  }

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/community/news/${newsId}`);

  // === 4단계: 편집 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/news\/edit\/\d+$/);

  await fillTextInput(page, 'title', editedTitle);
  await selectDate(page, '시기', editedDate);
  await fillHTMLEditor(page, editedDescription);

  // 기존 태그 해제
  for (const tag of tags) {
    await toggleCheckbox(page, tag, false);
  }

  // 새로운 태그 선택
  for (const tag of editedTags) {
    await toggleCheckbox(page, tag);
  }

  // 제출
  await submitForm(page, '게시하기');
  await page.waitForURL(/\/community\/news\/\d+$/);

  // === 5단계: 편집된 새소식 검증 - 한글 ===
  await expect(page.locator('body')).toContainText(editedTitle);
  await expect(page.locator('body')).toContainText(editedDescription);
  // 첨부파일과 이미지는 유지되어야 함
  await expect(page.locator('body')).toContainText(fileName);
  // 편집된 태그 확인
  for (const tag of editedTags) {
    await expect(page.locator('body')).toContainText(tag);
  }
  // 이전 태그는 없어야 함
  for (const tag of tags) {
    await expect(page.locator('body')).not.toContainText(tag);
  }

  // === 6단계: 편집된 새소식 검증 - 영문 ===
  await switchPageLanguage(page, 'en', `/community/news/${newsId}`);
  await expect(page.locator('body')).toContainText(editedTitle);
  await expect(page.locator('body')).toContainText(editedDescription);
  await expect(page.locator('body')).toContainText(fileName);
  // 편집된 태그 확인
  for (const tag of editedTags) {
    await expect(page.locator('body')).toContainText(tag);
  }
  // 이전 태그는 없어야 함
  for (const tag of tags) {
    await expect(page.locator('body')).not.toContainText(tag);
  }

  // 한글로 다시 전환
  await switchPageLanguage(page, 'ko', `/community/news/${newsId}`);

  // === 7단계: 삭제 ===
  await page.getByRole('link', { name: '편집' }).click();
  await page.waitForURL(/\/community\/news\/edit\/\d+$/);
  await deleteItem(page);
  await page.waitForURL('**/community/news');

  // === 8단계: 삭제 검증 ===
  // 목록 페이지로 돌아왔는지 확인
  expect(page.url()).toContain('/community/news');
  expect(page.url()).not.toContain(`/${newsId}`);
});
