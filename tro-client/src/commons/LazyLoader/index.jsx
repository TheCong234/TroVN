import React, { Suspense, useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const LazyLoader = ({ element }) => {
  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 1500);
    return () => {
      NProgress.done();
      clearTimeout(timeout);
    };
  }, []);

  return <Suspense fallback={<div></div>}>{element}</Suspense>;
};

export default LazyLoader;
