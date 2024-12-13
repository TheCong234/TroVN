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
import { LazyLoadImage } from "react-lazy-load-image-component";

export const ImagePreviewModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.IMAGE_PREVIEW_MODAL;
  const { images } = data;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[70vw]">
        <DialogHeader>
          <DialogTitle>Tất cả hình ảnh</DialogTitle>
          <DialogDescription>
            <div className="max-h-[80vh] overflow-auto grid grid-cols-2 gap-4 ">
              {images?.map((image) => (
                <div key={image.id}>
                  <LazyLoadImage
                    effect="blur"
                    src={image.url}
                    alt={image.caption}
                  />
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
