import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { ListingCard } from "..";

export const RecommendationsListing = ({ listings }) => {
  return (
    listings && (
      <div className="md:mt-10 mt-4 md:px-20 px-6">
        <h2 className="md:text-2xl text-lg font-semibold">
          Gợi ý dành cho bạn{" "}
        </h2>
        <hr className="md:w-1/5 w-1/5 md:my-4 my-2 border-b-2 border-primary" />

        <Swiper
          className="recommendation-swiper"
          slidesPerView={5}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
            1536: {
              slidesPerView: 5,
            },
          }}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          //   pagination={{
          //     clickable: true,
          //   }}
          //   navigation={true}
          //   , Pagination, Navigation
          modules={[Autoplay]}
        >
          {listings.map((listing) => (
            <SwiperSlide>
              <ListingCard listing={listing.listing} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
};
