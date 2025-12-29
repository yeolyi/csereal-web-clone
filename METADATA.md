# 페이지 메타데이터 구현 가이드

## 진행 상황

### ✅ 완료된 작업

#### Phase 1: 기반 작업
- [x] PageLayout 컴포넌트에 `pageTitle`, `pageDescription` props 추가
- [x] metadata.ts 유틸리티 함수 작성
- [x] SITE_NAME 상수화 및 PageLayout 자동 추가 기능

#### Phase 2-3: 핵심 패턴 구현
- [x] 메인 페이지 (`/main/index.tsx`)
- [x] 학부 소개 (`/about/overview/index.tsx`)
- [x] 공지사항 상세 (`/community/notice/$id.tsx`)
- [x] 새 소식 상세 (`/community/news/$id.tsx`)

### 🚧 진행 중
- [ ] 나머지 동적 페이지 (4개)
- [ ] 정적 페이지들 (~50개)

---

## API 사용법

### 1. PageLayout 사용 페이지 (정적 메타데이터)

**파일**: `app/routes/about/overview/index.tsx` 등

```typescript
import { useLanguage } from '~/hooks/useLanguage';
import PageLayout from '~/components/layout/PageLayout';

const META = {
  ko: {
    title: "학부 소개",
    description: "서울대학교 컴퓨터공학부는...",
  },
  en: {
    title: "About",
    description: "The Department of Computer Science and Engineering...",
  },
};

export default function Page() {
  const { locale } = useLanguage();
  const meta = META[locale];

  return (
    <PageLayout
      pageTitle={meta.title}        // PageLayout이 자동으로 "| 서울대학교 컴퓨터공학부" 추가
      pageDescription={meta.description}
      title="페이지 제목"
      titleSize="xl"
    >
      {/* 페이지 내용 */}
    </PageLayout>
  );
}
```

**결과**:
- Title: `"학부 소개 | 서울대학교 컴퓨터공학부"`
- og:title: `"학부 소개 | 서울대학교 컴퓨터공학부"`
- Description: 그대로 사용
- og:description: 그대로 사용

---

### 2. PageLayout 사용 페이지 (동적 메타데이터)

**파일**: `app/routes/community/notice/$id.tsx` 등

```typescript
import { stripHtml, truncateDescription } from '~/utils/metadata';
import PageLayout from '~/components/layout/PageLayout';

export default function NoticeDetailPage({ loaderData: notice }) {
  const { t, locale } = useLanguage();

  // 동적 메타데이터 생성
  const pageTitle = locale === 'en'
    ? `${notice.title} | Notice`
    : `${notice.title} | 공지사항`;

  const pageDescription = notice.description
    ? truncateDescription(stripHtml(notice.description))
    : locale === 'en'
      ? 'Notice details from the Department of CSE, SNU.'
      : '서울대학교 컴퓨터공학부 공지사항 상세 내용입니다.';

  return (
    <PageLayout
      pageTitle={pageTitle}              // PageLayout이 SITE_NAME 자동 추가
      pageDescription={pageDescription}
      title={t('공지사항')}
      titleSize="xl"
    >
      {/* 페이지 내용 */}
    </PageLayout>
  );
}
```

**결과**:
- Title: `"[게시물 제목] | 공지사항 | 서울대학교 컴퓨터공학부"`
- Description: HTML 제거 및 160자 제한 적용

---

### 3. PageLayout 미사용 페이지

**파일**: `app/routes/main/index.tsx`

```typescript
import { SITE_NAME } from '~/utils/metadata';

const META = {
  ko: {
    title: SITE_NAME.ko,
    description: "창의와 지식을 융합하여...",
  },
  en: {
    title: 'Dept. of Computer Science and Engineering, SNU',
    description: "Leading the evolution of computing technology...",
  },
};

export default function MainPage() {
  const { locale } = useLanguage();
  const meta = META[locale];

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />

      <Header />
      {/* 메인 페이지 내용 */}
    </>
  );
}
```

---

## 유틸리티 함수

### SITE_NAME
```typescript
import { SITE_NAME } from '~/utils/metadata';

// SITE_NAME.ko = '서울대학교 컴퓨터공학부'
// SITE_NAME.en = 'Dept. of CSE, SNU'
```

### stripHtml
```typescript
import { stripHtml } from '~/utils/metadata';

const html = '<p>안녕하세요 <strong>서울대</strong></p>';
const text = stripHtml(html);
// 결과: "안녕하세요 서울대"
```

### truncateDescription
```typescript
import { truncateDescription } from '~/utils/metadata';

const longText = "매우 긴 텍스트...".repeat(100);
const short = truncateDescription(longText, 160);
// 결과: "매우 긴 텍스트... (157자)..."
```

---

## 메타데이터 작성 가이드

### Title 패턴
- **정적 페이지**: 페이지명만 입력
  - 입력: `"학부 소개"`
  - 결과: `"학부 소개 | 서울대학교 컴퓨터공학부"`

- **동적 페이지**: 게시물 제목 + 카테고리
  - 입력: `"${notice.title} | 공지사항"`
  - 결과: `"[게시물 제목] | 공지사항 | 서울대학교 컴퓨터공학부"`

### Description 작성 요령
1. **길이**: 150-160자 이내
2. **내용**: 페이지의 핵심 내용 요약
3. **동적 페이지**: HTML 제거 필수 (`stripHtml` + `truncateDescription`)
4. **Fallback**: 데이터가 없을 경우 기본 설명 제공

### 예시

**좋은 예시**:
```typescript
ko: {
  title: "교수진",
  description: "서울대학교 컴퓨터공학부 교수진을 소개합니다. 인공지능, 시스템, 이론 등 다양한 분야의 세계적 수준의 연구자들이 있습니다."
}
```

**나쁜 예시**:
```typescript
ko: {
  title: "교수진 | 서울대학교 컴퓨터공학부",  // ❌ SITE_NAME 중복
  description: "교수진입니다."  // ❌ 너무 짧고 내용 없음
}
```

---

## 주의사항

1. **edit 페이지 제외**: 검색엔진에서 제외해야 하므로 메타데이터 불필요
2. **HTML 제거**: description에 HTML 태그 절대 포함 금지
3. **다국어 필수**: 모든 메타데이터는 한글/영문 버전 필요
4. **PageLayout 자동화**: PageLayout 사용 시 SITE_NAME 자동 추가됨
5. **특수문자 처리**: 따옴표, 줄바꿈 등 이스케이프 필요

---

## 구현 완료 체크리스트

### 동적 페이지 (6개)
- [x] `/community/notice/$id.tsx` - 공지사항 상세
- [x] `/community/news/$id.tsx` - 새 소식 상세
- [x] `/community/seminar/$id.tsx` - 세미나 상세
- [x] `/people/faculty/$id.tsx` - 교수 상세
- [x] `/people/staff/$id.tsx` - 직원 상세
- [x] `/people/emeritus-faculty/$id.tsx` - 명예교수 상세

### About 섹션 (8개)
- [x] `/about/overview/index.tsx` - 학부 소개
- [x] `/about/greetings.tsx` - 학부장 인사말
- [x] `/about/history.tsx` - 연혁
- [x] `/about/contact.tsx` - 연락처
- [x] `/about/directions/index.tsx` - 찾아오는 길
- [x] `/about/facilities/index.tsx` - 시설 안내
- [x] `/about/future-careers/index.tsx` - 졸업생 진로
- [x] `/about/student-clubs/index.tsx` - 동아리 소개

### Community 섹션 (4개)
- [x] `/community/notice/index.tsx` - 공지사항 목록
- [x] `/community/news/index.tsx` - 새 소식 목록
- [x] `/community/seminar/index.tsx` - 세미나 목록
- [x] `/community/faculty-recruitment/index.tsx` - 신임교수초빙

### People 섹션 (3개)
- [x] `/people/faculty/index.tsx` - 교수진 목록
- [x] `/people/staff/index.tsx` - 직원 목록
- [x] `/people/emeritus-faculty/index.tsx` - 명예교수 목록

### Research 섹션 (4개)
- [x] `/research/labs/index.tsx` - 연구실 목록
- [x] `/research/centers/index.tsx` - 센터 목록
- [x] `/research/groups/index.tsx` - 연구 그룹
- [x] `/research/top-conference-list/index.tsx` - Top Conference List
- ~~`/research/conferences/index.tsx` - 존재하지 않음~~

### Academics 섹션 (7개)
- [x] `/academics/$studentType/guide/index.tsx` - 학부/대학원 안내
- [x] `/academics/undergraduate/curriculum/index.tsx` - 학부 교과과정
- [x] `/academics/$studentType/courses.tsx` (via CoursesPage.tsx) - 학부/대학원 교과목
- [x] `/academics/undergraduate/degree-requirements/index.tsx` - 졸업 규정
- [x] `/academics/undergraduate/general-studies-requirements/index.tsx` - 필수 교양
- [x] `/academics/$studentType/scholarship/index.tsx` - 학부/대학원 장학 제도
- [x] `/academics/$studentType/course-changes.tsx` - 교과목 변경 내역

### 추가 동적 페이지 (2개)
- [x] `/research/labs/$id/index.tsx` - 연구실 상세
- [x] `/academics/$studentType/scholarship/$id/index.tsx` - 장학금 상세

### Admissions 섹션 (6개)
- [x] `/admissions/$mainType/$postType/index.tsx` (via AdmissionsPageContent.tsx)
  - undergraduate/regular-admission
  - undergraduate/early-admission
  - graduate/regular-admission
  - international/undergraduate
  - international/graduate
  - international/exchange
  - international/scholarships

### 10-10 Project 섹션 (3개)
- [x] `/10-10-project/manager.tsx` - Manager
- [x] `/10-10-project/participants.tsx` - Participants (Professors)
- [x] `/10-10-project/proposal.tsx` - Proposal

### Reservations 섹션 (2개)
- [x] `/reservations/introduction.tsx` - 시설 예약 안내
- [x] `/reservations/privacy-policy.tsx` - 개인정보처리방침

### 기타 페이지 (1개)
- [x] `/main/index.tsx` - 메인 페이지

---

## 구현 완료 요약

### 총 페이지 수: 46개

**섹션별 완료 현황:**
- Main: 1개
- Dynamic detail pages: 8개 (notice, news, seminar, faculty, staff, emeritus-faculty, labs, scholarship)
- About: 8개
- Community: 4개
- People: 3개
- Research: 4개
- Academics: 7개
- Admissions: 6개 (AdmissionsPageContent 컴포넌트로 통합)
- 10-10 Project: 3개
- Reservations: 2개

**핵심 파일:**
- `app/utils/metadata.ts` - SITE_NAME 상수 및 유틸리티 함수
- `app/components/layout/PageLayout/index.tsx` - 자동 SITE_NAME 추가
- 46개 route 파일에 메타데이터 추가

**구현 패턴:**
1. PageLayout 사용 + 정적 메타데이터: 38개
2. PageLayout 사용 + 동적 메타데이터: 8개
3. PageLayout 미사용: 1개 (main/index.tsx)

---

**최종 업데이트**: 2024-12-30
**작성자**: Claude (Sonnet 4.5)
