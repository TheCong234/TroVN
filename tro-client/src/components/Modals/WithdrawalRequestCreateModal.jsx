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
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const schema = yup.object({
  amount: yup
    .number()
    .required("Số tiền là bắt buộc")
    .positive("Số tiền phải là số dương"),
  paymentInfoId: yup
    .string()
    .uuid("ID phương thức thanh toán phải là định dạng UUID hợp lệ")
    .nullable(),
});

export const WithdrawalRequestCreateModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen =
    isOpen && type === MODAL_TYPE.CREATE_WITHDRAWAL_REQUEST_MODAL;
  const { handleCreateWithdrawalRequest, paymentInfos, balance } = data;

  const form = useForm({
    defaultValues: {
      amount: 0,
      paymentInfoId: paymentInfos?.find((item) => item.isPrimary === true)?.id,
    },
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!data.paymentInfoId) {
      data = {
        ...data,
        paymentInfoId: paymentInfos?.find((item) => item.isPrimary === true)
          ?.id,
      };
    }
    if (balance < data.amount) return toast.error("Số dư không đủ");
    await handleCreateWithdrawalRequest(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
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
                errors={form.formState.errors.amount}
                label="Số tiền"
                name="amount"
              />

              <div className="flex gap-x-2 flex-col justify-center ">
                <Label htmlFor="paymentInfoId" className="cursor-pointer mb-1">
                  Phương thức thanh toán
                </Label>
                <Controller
                  name="paymentInfoId"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Phương thức thanh toán</SelectLabel>
                          {paymentInfos?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              <p>{item.accountNumber}</p>
                              <p>{item.provider}</p>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-x-2">
                <Label htmlFor="notes" className="cursor-pointer mb-1">
                  Ghi chú
                </Label>
                <Controller
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      id="notes"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
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
