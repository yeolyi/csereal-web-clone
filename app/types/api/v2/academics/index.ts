import type { Attachment } from '~/types/api/v2/attachment';

export interface Guide {
  description: string;
  attachments: Attachment[];
}
