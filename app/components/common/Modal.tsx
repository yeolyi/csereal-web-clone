/** biome-ignore-all lint/a11y/noStaticElementInteractions: TODO */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: TODO */
import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  children: ReactNode;
  contentClassName?: string;
}

export default function Modal({
  open,
  onClose,
  ariaLabel,
  children,
  contentClassName = '',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    if (typeof window === 'undefined') return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`relative max-h-[90vh] w-full max-w-[768px] overflow-auto rounded-sm border-t-2 border-main-orange bg-neutral-50 p-6 shadow-xl ${contentClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700"
          onClick={onClose}
          aria-label="닫기"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
