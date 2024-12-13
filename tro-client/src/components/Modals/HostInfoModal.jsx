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
import { ScrollArea } from "../ui/scroll-area";
import { Form, FormField } from "../ui/form";
import { useForm } from "react-hook-form";
import { InputField } from "..";
import { isEmpty } from "lodash";
import { Button } from "../ui/button";
import { updateUser } from "@/apis/user";
import { z } from "zod";
import { toast } from "sonner";
import { ROLE } from "@/constants/role";

export const HostInfoModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.UPDATE_HOST_INFO_MODAL;
  const { user } = data;

  const { control, handleSubmit, formState } = useForm();

  const onSubmit = async (data) => {
    const nullFields = Object.entries(data)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    console.log(data);

    if (nullFields.length > 0) {
      return toast.error(
        `Vui lòng điền đầy đủ thông tin ${nullFields.join(", ")}`,
        { position: "top-center" }
      );
    }
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      const { success, message } = await updateUser({
        ...data,
        id: user?.id,
        role: ROLE.HOST,
      });
      if (success) {
        toast.success(message, { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} className="">
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
          <DialogDescription>
            Cập nhật đầy đủ thông tin đẻ có thể sử dụng dịch vụ
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...control}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {isEmpty(user?.fullName?.split(" ").join("")) && (
                <InputField
                  control={control}
                  name="fullName"
                  label="Tên đầy đủ"
                  errors={formState.errors}
                />
              )}
              {isEmpty(user?.phoneNumber?.split(" ").join("")) && (
                <InputField
                  control={control}
                  name="Số điện thoại"
                  label="Tên đầy đủ"
                  errors={formState.errors}
                />
              )}
              {isEmpty(user?.address?.split(" ").join("")) && (
                <InputField
                  control={control}
                  name="address"
                  label="Địa chỉ"
                  errors={formState.errors}
                />
              )}
              {isEmpty(user?.email?.split(" ").join("")) && (
                <InputField
                  control={control}
                  label="Email"
                  name="Email"
                  errors={formState.errors}
                />
              )}
              <div className="mt-4 text-end">
                <Button type="submit" disabled={formState.isSubmitting}>
                  Xác nhận
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
