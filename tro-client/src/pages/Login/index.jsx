import { useCallback, useState } from "react";
// import { Form, Input, message } from "antd";
import { InputField } from "@/components";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/apis/user";
import { BsGoogle } from "react-icons/bs";
import { LuLogIn } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { CiMail } from "react-icons/ci";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiLockPasswordLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast } from "sonner";

const schema = yup.object({
  email: yup
    .string()
    .required("Email / Tên đăng nhập là bắt buộc")
    .required("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu tối thiểu 8 ký tự")
    .max(16, "Mật khẩu tối đa 16 ký tự"),
});

function Login() {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Đang đăng nhận...", {
      position: "top-center",
    });
    try {
      const user = await login(data);
      if (user.success) {
        toast.success("Đăng nhập thành công", { position: "top-center" });
        return navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
      console.log("Login error", error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const loginWithGoogle = useCallback(() => {
    window.open("http://localhost:8891/api/v1/auth/google/callback", "_self");
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6 h-svh">
      <div className="col-span-1 flex flex-col justify-center items-center m-4 p-3 rounded-lg shadow-md">
        <h2 className="text-left text-[32px] font-semibold w-full">
          Hi, Welcome Back
        </h2>
        <img
          className="w-full object-cover"
          src="/illustration_login.png"
          alt="login"
        />
      </div>
      <div className="flex flex-col col-span-3 gap-6 md:p-6 ">
        <div className="mt-6 w-full text-right">
          Bạn chưa có tài khoản?{" "}
          <Link className="text-primary" to="/register">
            Đăng ký ngay
          </Link>
        </div>
        <div className="flex flex-col justify-center mx-auto  w-[440px] flex-1">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Đăng nhập</h1>
            <p className="text-balance text-muted-foreground">
              Nhập email hoặc tên đăng nhập của bạn dưới đây để đăng nhập vào
              tài khoản của bạn
            </p>
          </div>
          <Form {...form}>
            <form
              className="grid gap-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <InputField
                control={form.control}
                errors={form.formState.errors.email}
                label="Email / Tên đăng nhập"
                name="email"
                icon={<CiMail size={18} />}
              />
              <InputField
                control={form.control}
                errors={form.formState.errors.password}
                label="Mật khẩu"
                name="password"
                type="password"
                icon={<RiLockPasswordLine size={18} />}
              />

              <div>
                <Button
                  type="primary"
                  className="mt-2 h-12 font-semibold flex gap-2 items-center w-full justify-center"
                >
                  <LuLogIn className="" size={18} /> Đăng nhập
                </Button>
                <div className="flex items-center gap-2 my-4">
                  <div className=" flex-1 border-b-2 border-gray-100"></div>
                  <div>Hoặc</div>
                  <div className="border-b-2 flex-1 border-gray-100"></div>
                </div>
                <Button
                  type="default"
                  variant="secondary"
                  className="mt-2 h-12 font-semibold flex gap-2 items-center w-full justify-center"
                  onClick={loginWithGoogle}
                >
                  <BsGoogle className="" size={18} /> Đăng nhập với Google
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex mt-4 justify-center">
            <Link to="/forgot">Quên mật khẩu?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
