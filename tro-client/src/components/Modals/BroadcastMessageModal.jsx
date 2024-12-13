import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { MODAL_TYPE } from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import "./style.scss";

export const BroadcastMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.BROADCAST_MESSAGE_MODAL;
  const { notification } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle>Thông báo từ quản trị viên</DialogTitle>
          <DialogDescription>
            Chi tiết thông báo từ quản trị viên
          </DialogDescription>
        </DialogHeader>
        <div>
          <h2>Chi tiết thông báo từ quản trị viên</h2>
          <article className="mt-4">
            <div
              className="broadcast-message-modal"
              dangerouslySetInnerHTML={{
                __html: notification?.message,
              }}
            ></div>
          </article>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
