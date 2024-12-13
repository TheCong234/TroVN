// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  formatDateCount,
  formatMoney,
  getTimeDifference,
} from "@/utils/helpers";

import { FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
/* eslint-disable react/prop-types */
import { Navigation } from "swiper/modules";
import { createFavorite } from "@/apis/favorite";
import { message } from "antd";
import useFavoriteStore from "@/hooks/useFavoriteStore";
import { useState } from "react";
import useUserStore from "@/hooks/useUserStore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Flame } from "lucide-react";
import { Badge } from "../ui/badge";

const Index = ({ listing, onClose }) => {
  const [isFocus, setIsFocus] = useState(true);
  const { favorites } = useFavoriteStore();
  const { user } = useUserStore();

  const [toggleHeart, setToggleHeart] = useState(
    favorites?.find((i) => i.listingId === listing.id)
  );

  const handleFocus = () => {
    setIsFocus(true);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      return message.warning("Vui lòng đăng nhập!");
    }
    try {
      const { success } = await createFavorite(listing?.id);
      if (success) {
        setToggleHeart(!toggleHeart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBlur = () => {
    setIsFocus(false);
  };

  return (
    <div className="relative group">
      <div
        className="cursor-pointer "
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
      >
        <div className="relative">
          <Link to={`/listing/${listing.id}`} target="_blank">
            <Swiper
              navigation={isFocus}
              modules={[Navigation]}
              className="swiper-card-listing rounded-2xl overflow-hidden mb-3"
            >
              {listing?.images?.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="w-full ">
                    <LazyLoadImage
                      effect="blur"
                      src={
                        item.url ||
                        "https://thumbs.dreamstime.com/b/web-324830775.jpg"
                      }
                      alt={item.caption}
                      className="w-full h-full object-cover aspect-square"
                    />
                  </div>
                </SwiperSlide>
              ))}
              {listing?.images?.length === 0 && (
                <div className="w-full">
                  <LazyLoadImage
                    effect="blur"
                    src="https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
                    alt={listing.title}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              )}
            </Swiper>
          </Link>
          <Link
            to={`/user/new-info/${listing?.user?.id}`}
            className="absolute bottom-2 left-2 z-30 bg-white rounded-md p-2 shadow-lg"
          >
            <LazyLoadImage
              effect="blur"
              src={listing?.user?.avatarUrl}
              alt=""
              className="aspect-square rounded-full size-10"
            />
          </Link>
          <div className="absolute bottom-4 right-2 z-10">
            <Badge variant="secondary" className="flex items-center">
              <span className="ml-1 font-semibold">
                {listing?.area}m<sup>2</sup>
              </span>
            </Badge>
          </div>
        </div>
        <Link
          to={`/listing/${listing.id}`}
          className="flex flex-col text-[15px] gap-y-[2px] hover:text-[#222]"
        >
          <h2 className=" font-semibold leading-[19px]" title={listing?.title}>
            {listing?.title?.length > 30
              ? `${listing.title.slice(0, 30)}...`
              : listing.title}
          </h2>
          <div className="text-[#717171]" title={listing?.address}>
            {listing?.address?.length > 30
              ? `${listing.address.slice(0, 30)}...`
              : listing.address}
          </div>
          {listing?.distance && (
            <div className="font-medium">
              {(listing?.distance / 1000).toFixed(2)} km
            </div>
          )}

          <div className="mt-[6px] flex justify-between">
            <div className=" font-semibold text-lg leading-[19px]">
              {`${formatMoney(listing.price)} `}
              <span className="font-normal text-xs">/ Tháng</span>
            </div>
            <div className="text-xs">
              {getTimeDifference(listing.createdAt)}
            </div>
          </div>
        </Link>
      </div>
      <div className=" flex gap-2 absolute right-2 top-2 z-10 ">
        {
          <div
            className="group-hover:block p-2  cursor-pointer  "
            onClick={handleToggleFavorite}
          >
            <FaHeart size={20} color={toggleHeart ? "red" : "white"} />
          </div>
        }
        {onClose && (
          <div
            className=" p-2 cursor-pointer rounded-full shadow-xl bg-white"
            onClick={onClose}
          >
            <IoClose size={20} />
          </div>
        )}
      </div>
      {listing?.hot && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="flex items-center">
            <Flame size={18} />
            <span className="ml-1">Nổi bật</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default Index;
