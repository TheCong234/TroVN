import "moment/locale/vi";

import {
  AmenitiesList,
  CommentItem,
  Empty,
  ImagePreview,
  MapListing,
  Rating,
} from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaChartArea, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { createReview, deleteReview, getReviews } from "@/apis/reviews";
import { useEffect, useState } from "react";

import { BiShare } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import BuyBox from "./BuyBox";
import { IoTimeOutline } from "react-icons/io5";
import Loading from "./Loading";
import { LuDot } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { createFavorite } from "@/apis/favorite";
import { getListing } from "@/apis/listing";
import { getTerm } from "@/utils/helpers";
import moment from "moment";
import useFavoriteStore from "@/hooks/useFavoriteStore";
import useReviewStore from "@/hooks/useReviewStore";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/hooks/useUserStore";
import { toast } from "sonner";
import { NOTIFICATION_TYPE } from "@/enums";

moment.locale("vi");

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [listing, setListing] = useState({});
  const {
    reviews: { contents },
    setReviews,
    removeReview,
  } = useReviewStore();
  const { user, socketConnection } = useUserStore();
  const { favorites } = useFavoriteStore();
  const [reviewContent, setReviewContent] = useState();
  const [rating, setRating] = useState(0);
  const { id } = useParams();
  const [toggleHeart, setToggleHeart] = useState(
    favorites?.find((i) => i.listingId === id)
  );

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [res1, res2] = await Promise.all([
          getListing(id),
          getReviews(id),
        ]);
        setListing(res1.data);
        setReviews(res2.data);
        setIsLoading(false);
      } catch (error) {
        toast({
          description: error.response.data.message,
          variant: "destructive",
        });
        console.log(error);
      }
    })();
  }, [id, setReviews, toast]);

  const handleToggleFavorite = async () => {
    if (!user) {
      return toast({
        description: "Vui lòng đăng nhập!",
        variant: "destructive",
      });
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

  const handleSendReview = async () => {
    try {
      const newReview = {
        rating,
        content: reviewContent,
        listingId: id,
      };
      setReviewLoading(true);
      const { success, data } = await createReview(newReview);
      if (success) {
        console.log(data);
        socketConnection.emit("sendNotification", {
          title: "Vừa có một bình luận mới",
          message: ` ${user?.fullName || user?.email} đã gửi một bình luận`,
          type: NOTIFICATION_TYPE.REVIEW,
          data,
          userId: data?.listing?.userId,
        });
      }

      if (!success) {
        toast.error("Có lỗi khi thêm đánh giá", { position: "top-center" });
      }
      const res = await getReviews(id);
      setReviews(res.data);
      setReviewContent("");
      setRating(0);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { position: "top-center" });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRemoveReview = async (id) => {
    try {
      setReviewLoading(true);
      const data = await deleteReview(id);
      setReviewLoading(false);
      if (data) {
        removeReview(id);
        toast.success("Xóa thành công!", { position: "top-center" });
      }
    } catch (error) {
      setReviewLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message, { position: "top-center" });
    }
  };

  const handleChangeReview = (e) => {
    setReviewContent(e.target.value);
  };

  const handleRateChange = (rate) => {
    console.log(rate);

    setRating(rate);
  };

  return (
    <>
      <div className="container h-full mx-auto lg:px-40 px-4 ">
        {!isLoading && (
          <>
            <div className="py-4 flex justify-between">
              <div className="font-semibold text-xl">{listing.title}</div>
              <div className="md:flex hidden items-center gap-4 ">
                <div className="flex gap-2 items-center cursor-pointer">
                  <BiShare size={20} />
                  <span className="font-semibold underline">Chia sẻ</span>
                </div>
                <div
                  className="flex gap-2 items-center cursor-pointer "
                  onClick={handleToggleFavorite}
                >
                  <div className="group-hover:block   ">
                    {toggleHeart ? (
                      <FaHeart size={20} color={"red"} />
                    ) : (
                      <FaRegHeart size={20} />
                    )}
                  </div>
                  <span className="font-semibold underline">Lưu</span>
                </div>
              </div>
            </div>
            <div className="md:h-[560px] h-auto">
              <ImagePreview images={listing?.images} />
            </div>
            <div className="md:hidden flex w-full">
              {user?.id !== listing?.user?.id && (
                <BuyBox listing={listing} user={user} />
              )}
            </div>
            <div className="grid md:grid-cols-3">
              <div
                className={cn(
                  "col-span-2",
                  user?.id === listing?.user?.id && "col-span-3"
                )}
              >
                <div className=" py-8">
                  <h2 className="text-[22px] font-semibold">{listing.title}</h2>
                  <div className="flex gap-1 items-center text-base">
                    <IoTimeOutline size={18} /> {getTerm(listing?.term)}{" "}
                    <LuDot /> <FaChartArea size={18} /> {listing?.area}m
                    <sup>2</sup>
                  </div>
                  <div className="font-semibold text-base flex gap-2 items-center">
                    <FaStar />
                    {listing?.reviews?.length > 0
                      ? `${listing?.reviews?.length} review`
                      : "Chưa có review nào"}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {listing?.listingTags?.map((item) => (
                      <span
                        key={item.id}
                        className="py-1 px-2 rounded-md hover:bg-slate-100 cursor-pointer bg-slate-200"
                      >
                        #{item.tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="py-6 border-y-[1px] flex items-center gap-2">
                  <Link to={`/user/new-info/${listing?.user?.id}`}>
                    <Avatar>
                      <AvatarImage
                        size={64}
                        src={listing?.user?.avatarUrl}
                        alt="avatar"
                      />
                      <AvatarFallback>{listing?.user?.fullName}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <h2 className="font-semibold text-base leading-5 mb-1">
                      Chủ nhà{" "}
                      {listing?.user?.fullName || listing?.user?.username}
                    </h2>
                    <p className="text-[#717171]">
                      {moment(listing?.user?.createdAt).format("LL")}
                    </p>
                  </div>
                </div>
                <div className=" py-6 border-b-[1px]">
                  <h2 className="text-[22px] font-semibold leading-[26px] mb-6">
                    Phòng này có gì
                  </h2>
                  <AmenitiesList listingAmenities={listing?.listingAmenities} />
                </div>
                <p className="text-base leading-6 py-6 border-b-[1px]">
                  <h2 className="text-[22px] font-semibold leading-[26px] mb-6">
                    Thông tin chi tiết
                  </h2>
                  <div
                    className="lisiting-description"
                    dangerouslySetInnerHTML={{
                      __html: listing?.description,
                    }}
                  />
                </p>

                <div className=" py-6 border-b-[1px]">
                  <h2 className="text-[22px] font-semibold leading-[26px] mb-6">
                    Bạn sẽ ở dâu
                  </h2>
                  <div>
                    <div className="md:h-[600px] h-[250px] rounded-lg overflow-hidden ">
                      {listing && (
                        <MapListing
                          latitude={listing.latitude}
                          longitude={listing.longitude}
                        />
                      )}
                    </div>
                    <div className="text-base font-semibold mt-6">
                      {listing?.address}
                    </div>
                  </div>
                </div>
                <div className=" py-6 border-b-[1px]">
                  <h2 className="text-[22px] font-semibold leading-[26px] mb-6">
                    Đánh giá
                  </h2>
                  <div className="flex flex-col gap-8">
                    <div>
                      <textarea
                        name=""
                        id=""
                        className="w-full rounded-md border p-2 text-base"
                        cols="30"
                        rows="4"
                        placeholder="Thêm đánh giá..."
                        value={reviewContent}
                        onChange={handleChangeReview}
                      ></textarea>
                    </div>
                    <Rating
                      totalStars={rating || 5}
                      onRateChange={handleRateChange}
                    />
                    <Button
                      loading={reviewLoading}
                      variant="secondary"
                      className="h-12 w-fit"
                      onClick={handleSendReview}
                    >
                      Gửi đánh giá
                    </Button>
                  </div>
                  {contents?.length === 0 && <Empty />}
                  {contents?.length > 0 && (
                    <div className="px-4 mt-4">
                      {contents.map((item) => (
                        <CommentItem
                          comment={item}
                          handleRemoveReview={handleRemoveReview}
                          loading={reviewLoading}
                          user={user}
                          key={item.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {user?.id !== listing?.user?.id && (
                <div className="col-span-1 relative pl-20  mt-10 md:flex hidden">
                  <BuyBox listing={listing} user={user} />
                </div>
              )}
            </div>
          </>
        )}
        {isLoading && <Loading />}
      </div>
    </>
  );
};

export default Index;
