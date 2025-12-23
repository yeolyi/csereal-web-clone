import type { ReactNode } from 'react';
import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  content: ReactNode | null;
  open: (content: ReactNode) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  content: null,
  open: (content) => set({ isOpen: true, content }),
  close: () => set({ isOpen: false, content: null }),
}));
