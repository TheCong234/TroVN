import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { MODAL_TYPE } from "@/enums";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import { formattedDate } from "./CreateInvoiceModal";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { toast } from "sonner";

export const AppointmentModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const isModalOpen = isOpen && type === MODAL_TYPE.CREATE_APPOINTMENT_MODAL;
  const { handleCreateAppointment } = data;

  const handleCreate = async () => {
    if (date && time) {
      const appointmentDateTime = new Date(date);
      appointmentDateTime.setHours(time.hour()); // Sử dụng hour() để lấy giờ
      appointmentDateTime.setMinutes(time.minute()); // Sử dụng minute() để lấy phút

      await handleCreateAppointment(appointmentDateTime);
    } else {
      toast.error("Vui lòng chọn cả ngày và giờ", { position: "top-center" });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn</DialogTitle>
          <DialogDescription>
            Đặt lịch hẹn xem phòng với chủ nhà
          </DialogDescription>
          <div className="pt-4">
            <p className="text-sm mb-2">Chọn ngày bạn muốn đến xem phòng</p>
            <div className="grid grid-cols-3 gap-4">
              <TimePicker
                className="h-10 rounded-md col-span-1"
                onChange={(time) => setTime(dayjs(time))}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal col-span-2",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formattedDate(date) : <span>Chọn một ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Thoát
          </Button>
          <Button onClick={handleCreate}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
