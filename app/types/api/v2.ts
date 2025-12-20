import type { Attachment } from '~/types/api/attachment';

export type MainResponse = {
  slides: MainNews[];
  notices: AllMainNotice;
  importants: MainImportant[];
};

export type MainNews = {
  id: number;
  title: string;
  description: string;
  imageURL: string;
  createdAt: string;
};

export type AllMainNotice = {
  all: MainNotice[];
  scholarship: MainNotice[];
  undergraduate: MainNotice[];
  graduate: MainNotice[];
};

export type MainNotice = {
  id: number;
  title: string;
  createdAt: string;
};

export type MainImportant = {
  id: number;
  title: string;
  description: string;
  category: 'notice' | 'news';
};

export type AboutContent = {
  description: string;
  imageURL: string | null;
  attachments: Attachment[];
};
