import * as yup from "yup";

import { FormProvider, useForm } from "react-hook-form";

import { Button } from "antd";
import { InputField } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    phoneNumber: yup
      .string()
      .matches(
        /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
        "Số điện thoại không hợp lệ"
      )
      .required("Vui lòng nhập số điện thoại"),
  })
  .required();

// eslint-disable-next-line react/prop-types
const EditPhoneNumber = ({ onSubmit }) => {
  const method = useForm({
    defaultValues: {
      phoneNumber: "",
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...method}>
      <form onSubmit={method?.handleSubmit(onSubmit)} className="mt-2">
        <InputField
          control={method?.control}
          errors={method?.errors?.phoneNumber}
          name="phoneNumber"
          placeholder="Nhập số điện thoại"
        />
        <Button
          htmlType="submit"
          loading={method?.formState?.isSubmitting}
          type="primary"
          className="max-w-fit mt-2 h-12"
        >
          Lưu
        </Button>
      </form>
    </FormProvider>
  );
};

export default EditPhoneNumber;
