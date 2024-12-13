// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
/* eslint-disable react/prop-types */
import { Descriptions, Image } from "antd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
} from "../ui/sheet";
// import { Drawer, DrawerContent } from "../ui/drawer";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatMoney, getTerm } from "@/utils/helpers";

import { AmenitiesList } from "..";
import { Drawer } from "vaul";

// import required modules

const DescriptionItem = ({ title, content }) => (
  <div className="grid gap-3">
    <p className="text-[#00000045]">{title}:</p>
    {content}
  </div>
);
const Index = ({ onClose, open, listing }) => {
  const items = [
    {
      key: "1",
      label: "Tiêu đề",
      children: listing.title,
    },
    {
      key: "2",
      label: "Gía phòng",
      children: formatMoney(listing.price),
    },
    {
      key: "3",
      label: "Loại hình cho thuê",
      children: getTerm(listing.term),
    },
    {
      key: "4",
      label: "Địa chỉ",
      span: 2,
      children: listing.address,
    },
  ];
  return (
    <Sheet defaultOpen={false} onOpenChange={onClose} open={open}>
      <SheetContent
        style={{
          maxWidth: "45%",
        }}
      >
        <SheetHeader>
          <SheetHeader className="font-semibold text-xl">
            Thông tin chi tiết phòng
          </SheetHeader>
          <SheetDescription className="text-zinc-600 mb-2">
            Thông tin chi tiết căn phòng
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          <div className="h-[400px]">
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={true}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="mySwiper w-full h-full rounded-xl overflow-hidden"
            >
              {listing.images.map((item) => (
                <SwiperSlide key={item.id} className="!w-full">
                  <Image
                    wrapperClassName="!h-full"
                    src={item.url}
                    alt={item?.caption}
                    className="!h-full !w-full !object-fill !aspect-square"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <Descriptions
            title="Chi tiết"
            layout="vertical"
            items={items}
            size="middle"
            column={1}
          />
        </div>
        <DescriptionItem
          title="Tiện ích "
          content={
            <AmenitiesList listingAmenities={listing?.listingAmenities} />
          }
        />
        <div
          dangerouslySetInnerHTML={{
            __html: listing?.description,
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default Index;
