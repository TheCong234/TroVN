import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { APPOINTMENT_STATUS, MODAL_TYPE, STATUS_COLOR } from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { updateAppointmentsByHost } from "@/apis/appointment";
import { toast } from "sonner";
import { ScrollArea } from "../ui/scroll-area";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formattedDate } from "./CreateInvoiceModal";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const AppointmentDetailModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [date, setDate] = useState(null);
  const isModalOpen = isOpen && type === MODAL_TYPE.DETAIL_APPOINTMENT_MODAL;
  const { appointments, handleReload } = data;

  const handleCancelAppointment = async (id) => {
    const toastId = toast.loading("Đang huy lịch", { position: "top-center" });
    try {
      const { success, message } = await updateAppointmentsByHost(id, {
        status: "CANCELED",
      });
      if (success) {
        onClose();
        handleReload();
        toast.success(message, { position: "top-center" });
      } else {
        console.log("Failed to cancel appointment:", message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="">Chi tiết lịch hẹn</DialogTitle>
          <DialogDescription>
            Đặt lịch hẹn xem phòng với chủ nhà
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="grid grid-cols-1 gap-y-4">
            {appointments?.map((item) => (
              <div className="border rounded-md p-2 flex gap-2">
                <div>
                  <LazyLoadImage
                    effect="blur"
                    src={item.listing.images[0]?.url}
                    className="size-20 min-w-20 rounded-md"
                    alt=""
                  />
                </div>
                <div>
                  <div className="leading-4">{item.listing.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {item.listing.address}
                  </div>
                  <div className="text-sm py-1">
                    {format(item.appointmentDate, "HH:mm  dd MMMM yyyy", {
                      locale: vi,
                    })}
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <Badge
                        style={{
                          backgroundColor: STATUS_COLOR[item.status],
                        }}
                      >
                        {APPOINTMENT_STATUS[item.status]}
                      </Badge>
                    </div>

                    {item.status === "PENDING" && (
                      <Button
                        className=""
                        variant="outline"
                        onClick={() => handleCancelAppointment(item.id)}
                      >
                        Hủy lịch
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Thoát
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
