import { uploadV1 } from "@/apis/image";
import { Input, Button, Radio } from "antd";
import React, { useRef, useEffect, useMemo } from "react";
import ReactQuill from "react-quill";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import useUserStore from "@/hooks/useUserStore";
import { NOTIFICATION_TYPE } from "@/enums";
import "react-quill/dist/quill.snow.css";

const schema = yup.object().shape({
  title: yup.string().required("Tiêu đề là bắt buộc."),
  recipient: yup.string().required("Bạn phải chọn một đối tượng nhận."),
  message: yup.string().required("Nội dung thông báo là bắt buộc."),
});

const Notifications = () => {
  const { user, socketConnection } = useUserStore();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      recipient: "",
      message: "",
    },
    resolver: yupResolver(schema),
  });

  const quillRef = useRef(null);

  // Initialize Quill modules outside component to prevent re-renders
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          ["link", "image", "code-block"],
          [{ align: [] }],
          ["clean"],
        ],
        handlers: {
          image: async function () {
            const quillObj = quillRef.current?.getEditor();
            if (!quillObj) return;

            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.style.display = "none";
            document.body.appendChild(input);

            input.onchange = async () => {
              if (!input.files?.length) return;

              const file = input.files[0];
              if (!file) return;

              try {
                // Show loading state
                const range = quillObj.getSelection(true);
                const loadingPlaceholder = "Đang tải ảnh...";
                quillObj.insertText(range.index, loadingPlaceholder);

                // Upload image
                const { data, success } = await uploadV1(file);

                // Remove loading text
                quillObj.deleteText(range.index, loadingPlaceholder.length);

                if (success && data?.url) {
                  quillObj.insertEmbed(range.index, "image", data.url);
                  quillObj.setSelection(range.index + 1);
                } else {
                  toast.error("Không thể tải ảnh lên");
                }
              } catch (error) {
                console.error("Lỗi tải ảnh:", error);
                toast.error("Tải ảnh thất bại");
              } finally {
                // Clean up
                document.body.removeChild(input);
              }
            };

            input.click();
          },
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const onSubmit = async (data) => {
    if (!socketConnection) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      console.log(data.recipient);

      socketConnection.emit(data.recipient, {
        title: data.title,
        message: data.message,
        type: NOTIFICATION_TYPE.BROADCAST_MESSAGE,
      });
      toast.success("Gửi thông báo thành công");
    } catch (error) {
      console.error("Lỗi gửi thông báo:", error);
      toast.error("Gửi thông báo thất bại");
    }
  };

  return (
    <div>
      <h1 className="font-semibold text-xl">Thông báo</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <div>
              <label htmlFor="title">Tiêu đề</label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="mt-4 flex flex-col">
              <label>Gửi tới</label>
              <Controller
                name="recipient"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio value="broadcastMessage">Tất cả</Radio>
                    <Radio value="broadcastHostMessage">Người cho thuê</Radio>
                    <Radio value="broadcastUserMessage">Người thuê</Radio>
                  </Radio.Group>
                )}
              />
              {errors.recipient && (
                <p className="text-red-500">{errors.recipient.message}</p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="message">Nội dung thông báo</label>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={getValues("message")}
                onChange={(value) => setValue("message", value)}
                modules={modules}
              />
            </div>
          </div>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          className="mt-4"
        >
          Gửi thông báo
        </Button>
      </form>
    </div>
  );
};

export default Notifications;
