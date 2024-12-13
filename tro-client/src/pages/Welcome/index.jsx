import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = () => {
  return (
    <div className="w-full h-full flex  relative">
      <div className="absolute top-0 left-0 w-full h-full">
        <LazyLoadImage
          effect="blur"
          src="/chat.svg"
          alt=""
          className=" w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Index;
