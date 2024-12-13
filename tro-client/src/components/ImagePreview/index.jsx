import { MODAL_TYPE } from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import { LazyLoadImage } from "react-lazy-load-image-component";

/* eslint-disable react/prop-types */
const Index = ({ images }) => {
  const { onOpen } = useModal();
  const handlePreviewImage = () => {
    onOpen(MODAL_TYPE.IMAGE_PREVIEW_MODAL, { images });
  };
  return (
    <>
      {images && (
        <div className="h-full" onClick={handlePreviewImage}>
          <div className="lg:grid lg:grid-cols-2 grid-cols-1 gap-4 h-full  overflow-hidden rounded-xl ">
            <LazyLoadImage
              effect="blur"
              src={images[0]?.url}
              alt="image"
              className="aspect-square object-cover w-full h-full"
            />
            <div className="lg:grid hidden grid-cols-2 gap-4">
              <div className="grid grid-rows-2  gap-4">
                <LazyLoadImage
                  effect="blur"
                  src={images[1]?.url}
                  alt="image"
                  className="aspect-square object-cover w-full h-full"
                />

                <LazyLoadImage
                  effect="blur"
                  src={images[2]?.url}
                  alt="image"
                  className="aspect-square object-cover w-full h-full"
                />
              </div>
              <div className="grid grid-rows-2  gap-4">
                <LazyLoadImage
                  effect="blur"
                  src={images[3]?.url}
                  alt="image"
                  className="aspect-square object-cover w-full h-full"
                />
                <LazyLoadImage
                  effect="blur"
                  src={images[4]?.url}
                  alt="image"
                  className="aspect-square object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
