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
import { Button } from "../ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Form } from "../ui/form";
import { InputField } from "..";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const schema = yup.object({
  accountName: yup.string().required("Tên tài khoản là bắt buộc"),
  accountNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Số tài khoản chỉ được chứa số")
    .required("Số tài khoản là bắt buộc"),
  provider: yup.string().required("Nhà cung cấp là bắt buộc"),
  isPrimary: yup
    .string()
    .oneOf(["true", "false"], "Giá trị phải là 'true' hoặc 'false'")
    .required("Trạng thái chính là bắt buộc"),
});
export const CreatePaymentInfoModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === MODAL_TYPE.CREATE_PAYMENT_INFO_MODAL;
  const { handleCreatePaymentInfo } = data;

  const form = useForm({
    defaultValues: {
      type: "BANK",
      isPrimary: false,
    },
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await handleCreatePaymentInfo(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
          <DialogDescription>
            Thêm phương thức thanh toán của bạn
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              className="grid gap-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                errors={form.formState.errors.type}
                label="Loại tài khoản"
                placeholder="Tài khoản ngân hàng"
                name="type"
                disabled
              />
              <InputField
                control={form.control}
                errors={form.formState.errors.accountName}
                label="Tên tài khoản"
                name="accountName"
              />
              <InputField
                control={form.control}
                errors={form.formState.errors.accountNumber}
                label="Số tài khoản"
                name="accountNumber"
              />
              <InputField
                control={form.control}
                errors={form.formState.errors.provider}
                label="Nhà cung cấp"
                name="provider"
              />
              <div className="flex items-center gap-x-2 ">
                <Controller
                  name="isPrimary"
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      id="isPrimary"
                      checked={field.value}
                      onCheckedChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                <Label htmlFor="isPrimary" className="cursor-pointer">
                  Tài khoản thanh toán chính
                </Label>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                  Thoát
                </Button>
                <Button type="submit">Xác nhận</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
