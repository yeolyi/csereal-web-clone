import { useFormContext } from 'react-hook-form';

import { useModalStore } from '~/store/modal';
import AlertModal from './AlertModal';
import Button from '../Button';

interface Props {
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: () => Promise<void>;
  submitLabel?: string;
}

export default function Action({ onCancel, onDelete, onSubmit, submitLabel }: Props) {
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();
  const open = useModalStore((state) => state.open);

  return (
    <div className="relative mb-6 flex items-center justify-end gap-3">
      <ErrorMessages />
      <Button
        variant="outline"
        tone="neutral"
        disabled={isSubmitting}
        onClick={(e) => {
          e.preventDefault();
          if (isDirty) {
            open(<AlertModal message="편집중인 내용이 사라집니다." onConfirm={onCancel} />);
          } else {
            onCancel();
          }
        }}
      >
        취소
      </Button>
      {onDelete && (
        <Button
          variant="solid"
          tone="inverse"
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            open(<AlertModal message="게시물을 삭제하시겠습니까?" onConfirm={onDelete} />);
          }}
        >
          삭제
        </Button>
      )}
      <Button variant="solid" tone="inverse" disabled={isSubmitting} onClick={onSubmit}>
        {submitLabel ?? '저장하기'}
      </Button>
    </div>
  );
}

const ErrorMessages = () => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <ul className="text-md text-[#FF0000]">
      {Object.values(errors).map((error, idx) => (
        <li key={idx}>{error?.message?.toString()}</li>
      ))}
    </ul>
  );
};
