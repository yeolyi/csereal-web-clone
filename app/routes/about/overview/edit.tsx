'use client';

import type { Route } from '.react-router/types/app/routes/about/overview/+types/edit';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Fieldset from '~/components/common/form/Fieldset';
import Form from '~/components/common/form/Form';
import LanguagePicker, {
  type Language,
} from '~/components/common/form/LanguagePicker';
import PageLayout from '~/components/layout/PageLayout';
import { BASE_URL } from '~/constants/api';
import { useLanguage } from '~/hooks/useLanguage';
import type { AboutContent } from '~/types/api/v2/about/content';
import { type EditorFile, type EditorImage, isLocalImage } from '~/types/form';

interface AboutFormData {
  htmlKo: string;
  htmlEn: string;
  image: EditorImage;
  files: EditorFile[];
}

export async function loader() {
  const [koData, enData] = await Promise.all([
    fetch(`${BASE_URL}/v2/about/overview?language=ko`).then(
      (res) => res.json() as Promise<AboutContent>,
    ),
    fetch(`${BASE_URL}/v2/about/overview?language=en`).then(
      (res) => res.json() as Promise<AboutContent>,
    ),
  ]);

  return { koData, enData };
}

export default function OverviewEdit({ loaderData }: Route.ComponentProps) {
  const { koData, enData } = loaderData;
  const navigate = useNavigate();
  const { locale } = useLanguage({});
  const [language, setLanguage] = useState<Language>('ko');

  const defaultValues: AboutFormData = {
    htmlKo: koData.description,
    htmlEn: enData.description,
    image: koData.imageURL
      ? { type: 'UPLOADED_IMAGE', url: koData.imageURL }
      : null,
    files: koData.attachments.map((file) => ({
      type: 'UPLOADED_FILE' as const,
      file: {
        id: file.id,
        name: file.name,
        url: file.url,
        bytes: file.bytes,
      },
    })),
  };

  const methods = useForm<AboutFormData>({ defaultValues });

  const onCancel = () => {
    navigate(`/${locale}/about/overview`);
  };

  const onSubmit = methods.handleSubmit(
    async ({ htmlKo, htmlEn, image, files }) => {
      const formData = new FormData();

      // Request object
      const deleteIds = defaultValues.files
        .filter(
          (originalFile) =>
            originalFile.type === 'UPLOADED_FILE' &&
            !files.some(
              (currentFile) =>
                currentFile.type === 'UPLOADED_FILE' &&
                currentFile.file.id === originalFile.file.id,
            ),
        )
        .map((file) => (file.type === 'UPLOADED_FILE' ? file.file.id : -1));

      const requestObject = {
        ko: { description: htmlKo, deleteIds },
        en: { description: htmlEn, deleteIds: [] },
        removeImage: defaultValues.image !== null && image === null,
      };

      formData.append(
        'request',
        new Blob([JSON.stringify(requestObject)], { type: 'application/json' }),
      );

      // Image
      if (isLocalImage(image)) {
        formData.append('mainImage', image.file);
      }

      // Files
      const newFiles = files.filter((file) => file.type === 'LOCAL_FILE');
      newFiles.forEach((file) => {
        if (file.type === 'LOCAL_FILE') {
          formData.append('newAttachments', file.file);
        }
      });

      try {
        const response = await fetch(`/api/v2/about/overview`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to update overview');
        }

        navigate(`/${locale}/about/overview`);
      } catch (error) {
        console.error('Failed to update:', error);
        alert('수정에 실패했습니다.');
      }
    },
  );

  return (
    <PageLayout title="학부 소개 편집" titleSize="xl" padding="default">
      <FormProvider {...methods}>
        <Form>
          <LanguagePicker onChange={setLanguage} selected={language} />

          <Fieldset.HTML>
            <Form.HTML
              name="htmlKo"
              options={{
                required: {
                  value: true,
                  message: '한국어 내용을 입력해주세요.',
                },
              }}
              isHidden={language === 'en'}
            />
            <Form.HTML
              name="htmlEn"
              options={{
                required: { value: true, message: '영문 내용을 입력해주세요.' },
              }}
              isHidden={language === 'ko'}
            />
          </Fieldset.HTML>

          <Fieldset.Image>
            <label
              htmlFor="image"
              className="mb-3 whitespace-pre-wrap text-sm font-normal tracking-wide text-neutral-500"
            >
              글 우측 상단에 들어가는 이미지입니다.
            </label>
            <Form.Image name="image" />
          </Fieldset.Image>

          <Fieldset.File>
            <Form.File name="files" />
          </Fieldset.File>

          <Form.Action onCancel={onCancel} onSubmit={onSubmit} />
        </Form>
      </FormProvider>
    </PageLayout>
  );
}
