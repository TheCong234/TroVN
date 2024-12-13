/* eslint-disable react/prop-types */
import * as yup from "yup";

import { FormProvider, useForm } from "react-hook-form";

import { Button } from "antd";
import { InputField } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();

const EditEmail = ({ onSubmit }) => {
  const methods = useForm({
    defaultValues: {
      email: "",
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <InputField
          control={methods.control} // truyền control từ useForm
          errors={errors.email} 
          name="email"
        />
        <Button
          type="primary"
          className="max-w-fit mt-2 h-12"
          loading={isSubmitting}
          htmlType="submit"
        >
          Lưu
        </Button>
      </form>
    </FormProvider>
  );
};

export default EditEmail;
