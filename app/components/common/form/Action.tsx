import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import AlertDialog from '../AlertDialog';
import Button from '../Button';

interface Props {
  onCancel: () => void;
  onDelete?: () => Promise<void>;
  onSubmit: () => Promise<void>;
  submitLabel?: string;
}

export default function Action({
  onCancel,
  onDelete,
  onSubmit,
  submitLabel,
}: Props) {
  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="relative mb-6 flex items-center justify-end gap-3">
        <ErrorMessages />
        <Button
          variant="outline"
          tone="neutral"
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            if (isDirty) {
              setShowCancelDialog(true);
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
              setShowDeleteDialog(true);
            }}
          >
            삭제
          </Button>
        )}
        <Button
          variant="solid"
          tone="inverse"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {submitLabel ?? '저장하기'}
        </Button>
      </div>

      <AlertDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        description="편집중인 내용이 사라집니다."
        onConfirm={() => {
          onCancel();
          setShowCancelDialog(false);
        }}
      />

      {onDelete && (
        <AlertDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          description="게시물을 삭제하시겠습니까?"
          onConfirm={async () => {
            await onDelete();
            setShowDeleteDialog(false);
          }}
        />
      )}
    </>
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
