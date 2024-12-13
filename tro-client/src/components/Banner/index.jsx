/* eslint-disable react/prop-types */
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Index = ({ banners }) => {
  return (
    <>
      <Swiper
        className="banner-swiper md:h-[500px] h-[160px] "
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {/* {new Array(10).fill(0).map((_, index) => (
          <SwiperSlide className="bg-zinc-500" key={index}>
            Slide {index + 1}
          </SwiperSlide>
        ))} */}
        {banners?.map((item) => (
          <SwiperSlide className="bg-zinc-500" key={item.id}>
            <Link to={`/user/new-info/${item?.userId}`}>
              <img
                loading="lazy"
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full !object-cover "
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Index;
