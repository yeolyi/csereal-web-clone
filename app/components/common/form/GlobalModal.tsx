import { useModalStore } from '~/store/modal';
import Modal from '../Modal';

export default function GlobalModal() {
  const isOpen = useModalStore((state) => state.isOpen);
  const content = useModalStore((state) => state.content);
  const close = useModalStore((state) => state.close);

  return (
    <Modal open={isOpen} onClose={close}>
      {content}
    </Modal>
  );
}
