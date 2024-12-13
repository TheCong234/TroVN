import * as yup from "yup";

import { FormProvider, useForm } from "react-hook-form";

import { Button } from "antd";
import { InputField } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    username: yup
      .string()
      .min(6, "Tên người dùng phải có ít nhất 6 ký tự")
      .required("Vui lòng nhập tên người dùng"),
  })
  .required();

// eslint-disable-next-line react/prop-types
const EditUsername = ({ onSubmit }) => {
  const methods = useForm({
    defaultValues: {
      username: "",
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-2">
        <InputField
          control={methods.control}
          errors={methods.errors?.username}
          name="username" 
          placeholder="Nhập tên người dùng"
        />
        <Button
          htmlType="submit"
          loading={methods?.formState?.isSubmitting}
          type="primary"
          className="max-w-fit mt-2 h-12"
        >
          Lưu
        </Button>
      </form>
    </FormProvider>
  );
};

export default EditUsername;
