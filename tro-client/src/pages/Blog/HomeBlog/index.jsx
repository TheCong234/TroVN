import { getBlogs } from "@/apis/blog";
import { formattedDate } from "@/components/Modals/CreateInvoiceModal";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const HomeBlog = () => {
  const [blogs, setBlogs] = useState();
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success, message } = await getBlogs(1, 4);
        if (success) {
          setBlogs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-12 gap-8 py-20 border-b">
        <div className="col-span-5 flex flex-col gap-4 justify-center">
          <div className="text-muted-foreground">November 1, 2024</div>
          <div className="font-semibold text-4xl hover:underline underline-offset-4 cursor-pointer pr-10">
            Gặp gỡ cặp đôi đánh dấu vị khách thứ 2 của chúng tôi
          </div>
          <div className="mt-2">
            <Button className="font-semibold text-lg" size="lg">
              Xem thêm
            </Button>
          </div>
        </div>
        <div className="col-span-7">
          <img
            effect="blur"
            className="w-full rounded-lg object-cover"
            src="/blog-home.webp"
          />
        </div>
      </div>
      <div className="pt-8">
        <h2 className="mb-6 leading-7 font-semibold text-2xl">
          Tin tức mới nhất
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {blogs?.map((item, index) => (
            <Link to={`/blogs/${item.slug}`} className="group" key={item.id}>
              <LazyLoadImage
                src={item.thumbnail}
                className="aspect-video object-cover rounded-lg"
              />
              <div className="mt-3">
                <div className="font-semibold text-lg leading-normal group-hover:underline underline-offset-8">
                  {item.title}
                </div>
                <div className="mt-1">{formattedDate(item.createdAt)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeBlog;
