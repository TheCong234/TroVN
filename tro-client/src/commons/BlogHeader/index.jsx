import { Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BlogHeader = () => {
  return (
    <header className="h-20 bg-white sticky border-b top-0 z-50 left-0 right-0 flex justify-between px-20">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" className="size-20" />
        <span className="font-semibold text-xl">Tin tức</span>
      </Link>
      <div className="flex gap-4 text-lg items-center">
        <div className="item px-4">About us</div>
        <div className="item px-4">Media</div>
        <div className="item px-4">Releases</div>
        <div className="item px-4">Contact</div>
        <div className="item px-4 flex items-center gap-2">
          <Search />
          <span>Search</span>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
