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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectItemIndicator, SelectItemText } from "@radix-ui/react-select";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatMoney } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { InputField } from "..";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ROLE } from "@/constants/role";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

const invoiceSchema = z.object({
  electricityFee: z.preprocess(
    (val) => parseFloat(val) || 0,
    z.number().min(0, "Tiền điện không thể âm")
  ),
  waterFee: z.preprocess(
    (val) => parseFloat(val) || 0,
    z.number().min(0, "Tiền nước không thể âm")
  ),
  otherFee: z.preprocess(
    (val) => parseFloat(val) || 0,
    z.number().min(0, "Chi phí khác không thể âm")
  ),
  totalAmount: z.number().min(0, "Tổng số tiền không thể âm"),
  dueDate: z.date().refine((date) => date >= new Date(), {
    message: "Hạn thanh toán không thể ở quá khứ",
  }),
});

export const formattedDate = (date) =>
  format(date, "dd MMMM yyyy", { locale: vi });

export const CreateInvoiceModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const isModalOpen = isOpen && type === MODAL_TYPE.CREATE_INVOICE_MODAL;
  const { rooms, handleCreateInvoice } = data;

  const [date, setDate] = useState(null);
  const [isUseListingPrice, setIsUseListingPrice] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    mode: "onBlur",
    defaultValues: {
      electricityFee: 0,
      waterFee: 0,
      otherFee: 0,
      totalAmount: 0,
    },
  });

  const electricityFee = useWatch({ control, name: "electricityFee" });
  const waterFee = useWatch({ control, name: "waterFee" });
  const otherFee = useWatch({ control, name: "otherFee" });

  useEffect(() => {
    let total =
      parseFloat(electricityFee || 0) +
      parseFloat(waterFee || 0) +
      parseFloat(otherFee || 0);

    let totalAmount = total + parseFloat(selectedRoom?.listing?.price);

    if (isUseListingPrice) {
      setValue("totalAmount", totalAmount);
    } else {
      setValue("totalAmount", total);
    }
  }, [
    electricityFee,
    waterFee,
    otherFee,
    selectedRoom,
    setValue,
    isUseListingPrice,
  ]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRoom?.id) {
      return toast.warning("Vui lòng chọn phòng cần thêm hóa đơn!", {
        position: "top-center",
      });
    }

    if (!date) {
      return toast.warning("Vui lòng chọn ngày thanh toán!", {
        position: "top-center",
      });
    }

    const payload = {
      electricityFee: parseFloat(getValues().electricityFee),
      waterFee: parseFloat(getValues().waterFee),
      otherFee: parseFloat(getValues().otherFee),
      totalAmount: parseFloat(getValues().totalAmount),
      dueDate: date,
      rentedRoomId: selectedRoom.id,
    };

    await handleCreateInvoice(payload);

    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} className="">
      <DialogContent className="min-w-[50vw] ">
        <DialogHeader>
          <DialogTitle>Hóa đơn</DialogTitle>
          <DialogDescription>Hóa đơn</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <div className="w-full">
            <Label className="font-semibold text-base">Phòng</Label>
            <Select
              className="w-full"
              onValueChange={(value) => setSelectedRoom(value)}
            >
              <SelectTrigger className="h-[80px] text-start">
                <SelectValue placeholder="Chọn phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chọn phòng đang được thuê</SelectLabel>
                  {rooms?.contents?.map((room) => (
                    <SelectItem key={room?.id} value={room}>
                      <div className="flex gap-2 items-center">
                        <LazyLoadImage
                          effect="blur"
                          className="size-14 rounded-md"
                          src={room?.listing?.images[0].url}
                        />
                        <div>
                          <p className="text-base">
                            {room?.listing?.title?.slice(0, 50)}...
                          </p>
                          <p className="text-muted-foreground">
                            {room?.listing?.address?.slice(0, 100)}
                          </p>
                          <p className="text-base font-semibold">
                            {formatMoney(room?.listing?.price)}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Label className="font-semibold text-base">Chi tiết hóa đơn</Label>
            <Form {...control}>
              <form className="grid gap-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    control={control}
                    errors={errors?.electricityFee}
                    label="Tiền điện"
                    name="electricityFee"
                    type="number"
                  />
                  <InputField
                    control={control}
                    errors={errors?.waterFee}
                    label="Tiền nước"
                    name="waterFee"
                    type="number"
                  />
                </div>
                <InputField
                  control={control}
                  errors={errors?.otherFee}
                  label="Chi phí khác"
                  name="otherFee"
                  type="number"
                />
                <InputField
                  control={control}
                  errors={errors?.totalAmount}
                  label="Tổng số tiền"
                  name="totalAmount"
                  type="number"
                  readOnly
                />
                <div className="flex gap-2 items-center ">
                  <Checkbox
                    checked={isUseListingPrice}
                    onCheckedChange={(value) => setIsUseListingPrice(value)}
                  />
                  <Label>Bao gồm giá phòng</Label>
                </div>
                <div className="pt-4">
                  <p className="text-sm mb-2">
                    Chọn ngày bạn muốn đến xem phòng
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          formattedDate(date)
                        ) : (
                          <span>Chọn một ngày</span>
                        )}
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
                <div className="flex justify-end gap-4 mt-4">
                  <Button variant="outline" onClick={() => onClose()}>
                    Thoát
                  </Button>
                  <Button type="submit" onClick={onSubmit}>
                    Tạo hóa đơn
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
