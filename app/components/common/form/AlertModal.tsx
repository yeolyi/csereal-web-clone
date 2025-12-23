import { useEffect, useRef } from 'react';
import { useModalStore } from '~/store/modal';
import Button from '../Button';

interface AlertModalProps {
  message: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function AlertModal({
  message,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
}: AlertModalProps) {
  const close = useModalStore((state) => state.close);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  return (
    <div className="bg-white px-10 py-6">
      <p className="mb-6 mt-1 text-neutral-800">{message}</p>
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          tone="neutral"
          onClick={() => {
            onCancel?.();
            close();
          }}
        >
          {cancelText}
        </Button>
        <Button
          ref={confirmButtonRef}
          variant="solid"
          tone="inverse"
          onClick={() => {
            onConfirm();
            close();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
}
