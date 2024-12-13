import * as yup from "yup";

import { DatePickerWithRange, InputField } from "..";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { addDays, format } from "date-fns";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import CalendarField from "../CalendarField";
import { CalendarIcon } from "lucide-react";
import { DatePicker } from "antd";
import Dragger from "antd/es/upload/Dragger";
import ImgCrop from "antd-img-crop";
import { Label } from "../ui/label";
import { MODAL_TYPE } from "@/enums";
import { cn } from "@/utils/helpers";
import { createBanner } from "@/apis/banner";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/useModalStore";
import { yupResolver } from "@hookform/resolvers/yup";

export const AdsCreateModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.CREATE_BANNER_MODAL;
  const { adsPackageSelect } = data;

  const schema = yup
    .object({
      title: yup.string().min(6).required(),
      description: yup.string().min(8).required(),
      fromDate: yup.date(),
      toDate: yup.date(),
      paymentId: yup.string(),
      file: yup.object(),
    })
    .required();

  const {
    formState: { errors },
    getValues,
    setValue,
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      description: "",
      title: "",
      fromDate: null,
      toDate: null,
      file: null,
      paymentId: "",
    },
    resolver: yupResolver(schema),
  });

  const handleCreateBanner = async () => {
    const toastId = toast.loading("Đang gửi yêu cầu");
    try {
      if (!adsPackageSelect?.paymentId) {
        return toast.warning("Gói chưa dược thanh toán");
      }
      setValue("paymentId", adsPackageSelect.paymentId);
      const value = getValues();
      const { success, message } = await createBanner(value);
      if (success) {
        toast.success(message);
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const disabledDaysDate = (current, { from }) => {
    if (current && current < moment().startOf("day")) {
      return true;
    }
    if (from) {
      return (
        Math.abs(current.diff(from, "days")) >
        +adsPackageSelect?.advertisingPackage?.duration
      );
    }
    return false;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Sử dụng gói quảng bá</DialogTitle>
          <DialogDescription>
            Chọn Banner và ngày bạn muốn hiển thị
          </DialogDescription>
          <DialogDescription>
            <Form {...control}>
              <div className="grid gap-y-2">
                <InputField
                  name="title"
                  control={control}
                  errors={errors.title}
                  label="Tiêu đề"
                />
                <InputField
                  name="description"
                  control={control}
                  errors={errors.description}
                  label="Mô tả chi tiết"
                />
                <div>
                  <Label>Thời gian hiển thị</Label>
                  <DatePicker.RangePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={(dates) => {
                      setValue(
                        "fromDate",
                        dates
                          ? dayjs(dates[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                          : null
                      );
                      setValue(
                        "toDate",
                        dates
                          ? dayjs(dates[1]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
                          : null
                      );
                    }}
                    disabledDate={disabledDaysDate}
                    className="flex h-10 rounded-md border box-border"
                  />
                </div>
                <div>
                  <Label>Chọn hình ảnh muốn hiển thị</Label>

                  <ImgCrop
                    rotationSlider
                    fillColor="#ccc"
                    zoomSlider
                    showReset
                    showGrid
                    modalTitle="Chỉnh sửa hình ảnh"
                    modalOk="Xác nhận"
                    modalCancel="Thoát"
                    aspect={3.5}
                  >
                    <Dragger
                      name="file"
                      multiple={false}
                      onChange={(info) => {
                        const file = info.file;
                        const img = new Image();
                        img.src = URL.createObjectURL(file);

                        function isAspectRatioValid(image) {
                          const aspectRatioThreshold = 3.5;
                          const aspectRatio = image.width / image.height;

                          if (
                            Math.abs(aspectRatio - aspectRatioThreshold) < 0.5
                          ) {
                            return true;
                          } else {
                            return false;
                          }
                        }

                        img.onload = function () {
                          if (!isAspectRatioValid(img)) {
                            return toast.warning(
                              "Tỷ lệ hình không đúng như mong đợi 3.5:1"
                            );
                          }
                        };
                        setValue("file", info.file);
                      }}
                      onDrop={(e) => {
                        console.log("Dropped files", e.dataTransfer.files);
                      }}
                      beforeUpload={() => {
                        return false;
                      }}
                    >
                      <p className="ant-upload-text">
                        Nhấp hoặc kéo tệp vào khu vực này để tải lên
                      </p>
                      <p className="ant-upload-hint">
                        Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải
                        lên dữ liệu công ty hoặc các tập tin bị cấm khác.
                      </p>
                    </Dragger>
                  </ImgCrop>
                </div>
              </div>
            </Form>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Thoát
          </Button>
          <Button onClick={() => handleCreateBanner()}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
