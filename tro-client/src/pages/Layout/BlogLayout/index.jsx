import { BlogHeader, MainFooter } from "@/commons";
import React from "react";
import { Outlet } from "react-router-dom";

const BlogLayout = () => {
  return (
    <div>
      <BlogHeader />
      <div className="px-20">
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
};

export default BlogLayout;
