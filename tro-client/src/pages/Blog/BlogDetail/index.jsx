import { getDetailBlog } from "@/apis/blog";
import { formattedDate } from "@/components/Modals/CreateInvoiceModal";
import { Facebook, FacebookIcon, Link2, Linkedin, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  FaFacebook,
  FaFacebookF,
  FaLink,
  FaLinkedin,
  FaPinterest,
} from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success, message } = await getDetailBlog(slug);
        if (success) {
          setPost(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [slug]);
  return (
    <div className="container md:w-[830px]">
      <Breadcrumb className="py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/blogs">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="group">
        <h1 className="font-semibold text-[38px] leading-[52px] mb-10">
          {post?.title}
        </h1>
        <div>
          Viết bởi{" "}
          <Link className="font-semibold underline">
            {post?.author?.fullName}
          </Link>{" "}
          · {formattedDate(post?.createdAt || new Date())}
        </div>
        <div className="flex gap-8 items-center py-4">
          <FaFacebookF size={26} />
          <FaLinkedin size={26} />
          <FaPinterest size={26} />
          <FaLink size={26} />
        </div>
        <article>
          <div
            className="blog-post"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>
        </article>
      </section>
    </div>
  );
};

export default BlogDetail;
