export type ImageUploadResponse = {
  errorMessage: string;
  result: {
    url: string;
    name: string;
    size: number;
  }[];
};

export const postImage = async (formData: FormData): Promise<ImageUploadResponse> => {
  const response = await fetch('https://cse.snu.ac.kr/api/v1/file/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  return response.json();
};
