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
import { RentalContract } from "..";
import { ScrollArea } from "../ui/scroll-area";

export const ContractModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.CONTRACT_MODAL;
  const { room } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} className="">
      <DialogContent className="min-w-[70vw] !h-[90vh]">
        <DialogHeader>
          <DialogTitle>Hợp đồng cho thuê phòng trọ</DialogTitle>
          <DialogDescription>
            Điền đây đủ các thông tin để in hợp đồng phòng trọ
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <RentalContract
            address={room?.listing?.address}
            price={room?.listing?.price}
          />
        </ScrollArea>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
