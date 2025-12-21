export interface ScholarshipList {
  description: string;
  scholarships: { id: number; name: string }[];
}

export interface Scholarship {
  id: number;
  language: 'ko' | 'en';
  name: string;
  description: string;
}

export type ScholarshipWithLanguage = {
  ko: Scholarship;
  en: Scholarship;
};
