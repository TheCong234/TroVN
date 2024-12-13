/* eslint-disable react/prop-types */
import * as yup from "yup";

import { FormProvider, useForm } from "react-hook-form";

import { Button } from "antd";
import { InputField } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
    .object({
        fullName: yup.string().min(6).required("Tên không được để trống và phải ít nhất 6 ký tự."),
    })
    .required();

const EditFullName = ({ onSubmit }) => {
    const methods = useForm({
        defaultValues: {
            fullName: "",
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
                    control={methods.control}
                    errors={errors.fullName}
                    name="fullName"
                />
                <Button
                    type="primary"
                    htmlType="submit"
                    className="max-w-fit mt-2 h-12"
                    loading={isSubmitting}
                >
                    Lưu
                </Button>
            </form>
        </FormProvider>
    );
};

export default EditFullName;
