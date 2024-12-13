import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BiAddToQueue } from "react-icons/bi";
import ReactQuill from "react-quill";
import { z } from "zod";
import "react-quill/dist/quill.snow.css"; // CSS của ReactQuill
import { uploadV1 } from "@/apis/image";
import { toast } from "sonner";
import { createBlogPost } from "@/apis/blog";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().optional(),
});

const Blog = () => {
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: zodResolver(schema),
  });

  const quillRef = useRef(null);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const { data, success } = await uploadV1(file);

      if (success) {
        const imageUrl = data.url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();

        quill.insertEmbed(range.index, "image", imageUrl);
        quill.setSelection(range.index + 1);
      } else {
        console.error("Tải lên ảnh thất bại");
      }
    };
  };

  const modules = {
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
        image: handleImageUpload,
      },
    },
  };

  const handleChangeContent = (value) => {
    setValue("content", value);
  };

  const handleChangeThumbnail = async (e) => {
    const toastId = toast.loading("Đang tải ảnh...", {
      position: "top-center",
    });
    try {
      const { data, success } = await uploadV1(e.target.files[0]);
      if (success) {
        toast.success("Thành công", { position: "top-center" });
        setValue("thumbnail", data.url);
        // setThumbnail(data.url);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleCreateBlog = async () => {
    const toastId = toast.loading("Đang tạo bài viết...", {
      position: "top-center",
    });
    try {
      const { success } = await createBlogPost(getValues());
      if (success) {
        toast.success("Thành công", { position: "top-center" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">Bài viết</h1>
        <Button onClick={handleCreateBlog}>
          Thêm bài viết mới <BiAddToQueue />
        </Button>
      </div>
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          <Form layout="vertical">
            <Form.Item label="Tiêu đề bài viết" help={errors.title?.message}>
              <Input
                onChange={(e) => setValue("title", e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
              />
            </Form.Item>
            <Form.Item label="Ảnh thu nhỏ">
              <label htmlFor="thumbnail">
                <div className="p-3 border-dashed border">
                  <div>Chọn ảnh</div>
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="thumbnail"
                      className="w-28 h-28 mt-5 rounded-md object-cover"
                    />
                  )}
                </div>
              </label>
              <input
                type="file"
                onChange={(e) => handleChangeThumbnail(e)}
                id="thumbnail"
                className="!hidden"
              />
            </Form.Item>
            <Form.Item label="Nội dung bài viết" help={errors.content?.message}>
              <ReactQuill
                ref={quillRef}
                modules={modules}
                onChange={handleChangeContent}
                value={getValues("content")}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="col-span-1">
          <h1>{getValues("title")}</h1>
        </div>
      </div>
    </div>
  );
};

export default Blog;
