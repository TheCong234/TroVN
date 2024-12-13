import { uploadManyV1, uploadV1 } from "@/apis/image";
import { convertArrayToFiles } from "@/utils/helpers";
import { toast } from "sonner";
import useListingStore from "@/hooks/useListingStore";
import { useState } from "react";
import { FileUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const { updateListing } = useListingStore();
  const [files, setFiles] = useState(null);
  const [images, setImages] = useState(null);

  const handleChange = async (e) => {
    if (e.target.files.length < 5) {
      return toast.warning("Phải thêm nhiều hơn hoặc bằng 5 ảnh", {
        position: "top-center",
      });
    }
    setFiles(e.target.files);
    const toastId = toast.loading(
      `Đang tải ${e.target.files?.length} ảnh lên...`,
      {
        position: "top-center",
      }
    );
    setLoading(true);
    try {
      const { data, success, message } = await uploadManyV1(
        convertArrayToFiles(Array.from(e.target.files))
      );
      if (success) {
        toast.success(message, { position: "top-center" });
        updateListing("imageUrls", data);
        setImages(data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="">
      <label htmlFor="images">
        <div className="w-full h-48 border-2 flex flex-col gap-2 items-center justify-center rounded-md border-dashed">
          <div>
            <FileUp size={52} />
          </div>
          <div>
            <div className="text-center text-xl mb-2">
              Nhấp hoặc kéo tệp vào khu vực này để tải lên
            </div>
            <div className="text-muted-foreground">
              Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu
              công ty hoặc các tập tin bị cấm khác.
            </div>
          </div>
        </div>
      </label>
      <input
        type="file"
        id="images"
        className="hidden"
        onChange={handleChange}
        multiple
        accept="image/*"
      />
      {loading && (
        <div className="grid grid-cols-1 gap-y-4 mt-4">
          {new Array(files?.length).fill(0)?.map((_, index) => (
            <div key={index}>
              <Skeleton className="w-full h-10 rounded-md" />
            </div>
          ))}
        </div>
      )}
      {!loading && images?.length > 0 && (
        <div className="flex gap-4 mt-4">
          {images?.map((image, index) => (
            <LazyLoadImage
              key={index}
              effect="blur"
              src={image}
              className="size-20 rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
