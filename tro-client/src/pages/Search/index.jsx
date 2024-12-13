import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowLeftIcon,
  ChevronLeft,
  ChevronRight,
  Map,
} from "lucide-react";
import { CiFilter, CiSquareRemove } from "react-icons/ci";
import { MapSearch, SliderFilter } from "@/components";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MODAL_TYPE } from "@/enums";
import ProductList from "@/pages/Home/ProductList";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getFilterListing } from "@/apis/listing";
import useAmenityStore from "@/hooks/useAmenityStore";
import { useDebounce } from "use-debounce";
import useListingStore from "@/hooks/useListingStore";
import { useModal } from "@/hooks/useModalStore";

const Index = () => {
  const { amenities } = useAmenityStore();
  const [price, setPrice] = useState(null);
  const [isShowMap, setIsShowMap] = useState(true);
  const [priceDebounce] = useDebounce(price, 300);
  const { onOpen } = useModal();

  const {
    searchListings: {
      contents,
      filter,
      isLoading,
      totalElement,
      pagination: { page },
    },
    setSearchListings,
    setSearchListingLoading,
    updateSearchListings,
    setSearchListingAmenitiesId,
    clearSearchFilter,
    countSearchListingFilters,
  } = useListingStore();

  const {
    keyword,
    amenityIds,
    minPrice,
    maxPrice,
    locationId,
    tagId,
    lngCoords,
    latCoords,
  } = filter;
  latCoords;

  useEffect(() => {
    (async () => {
      await getFilterListing();
    })();
  }, [
    keyword,
    page,
    setSearchListings,
    minPrice,
    locationId,
    tagId,
    maxPrice,
    setSearchListingLoading,
    latCoords,
    lngCoords,
  ]);

  useEffect(() => {
    if (priceDebounce) {
      updateSearchListings("minPrice", priceDebounce[0]);
      updateSearchListings("maxPrice", priceDebounce[1]);
    }
  }, [priceDebounce, updateSearchListings]);

  const handleClickItem = async (id) => {
    try {
      setSearchListingAmenitiesId(id);
      await getFilterListing();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModalFilter = () => {
    onOpen(MODAL_TYPE.LISTING_FILTER_MODAL, { amenities });
  };

  return (
    <div className="relative">
      <div className="fixed pb-2 top-20 w-full bg-white z-50">
        <div className="grid grid-cols-5 md:px-0 mx-6">
          <div className="col-span-5 md:col-span-1 gap-4 flex items-center">
            <Button
              className="col-span-1 w-fit relative flex items-center leading-5 md:text-base text-xs gap-2 py-2 px-4 border cursor-pointer rounded-lg"
              onClick={handleOpenModalFilter}
              size="lg"
              variant="outline"
            >
              <CiFilter className="md:size-8 size-4" />
              Bộ lọc
              {countSearchListingFilters() > 0 && (
                <div className="absolute border-2 border-black rounded-lg top-0 right-0 w-full h-full">
                  <div className="absolute -right-2 -top-2 bg-black w-5 flex items-center justify-center h-5 rounded-full font-bold text-xs text-white">
                    {countSearchListingFilters()}
                  </div>
                </div>
              )}
            </Button>

            <Button
              className="col-span-1 w-fit flex items-center leading-5 md:text-base text-xs gap-2 py-2 px-4 border cursor-pointer rounded-lg"
              onClick={clearSearchFilter}
              size="lg"
              variant="outline"
            >
              <CiSquareRemove className="md:size-8 size-4" />
              Xóa bộ lọc
            </Button>
          </div>
          <div className="col-span-4 md:block hidden">
            <SliderFilter
              data={amenities}
              count={10}
              handleClickItem={handleClickItem}
              amenityIds={amenityIds}
            />
          </div>
        </div>
        <div className="md:flex justify-between hidden">
          <div className="md:mx-6 mx-2 py-2 text-base font-medium">
            {totalElement > 0 &&
              `Số lượng kết quả cho tìm kiếm ${totalElement} `}
            {totalElement === 0 && `Không tìm thấy kết quả nào`}
          </div>
          <Button
            onClick={() => setIsShowMap(!isShowMap)}
            className="flex items-center justify-center gap-2"
          >
            <Map size={18} />
            {isShowMap ? "Đóng bản đồ" : "Xem bản đồ"}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "md:grid flex md:mt-36 mt-2 md:grid-cols-5 grid-cols-1 flex-col-reverse gap-x-2",
          isShowMap && ""
        )}
      >
        <div
          className={cn(
            "md:col-span-3 md:mt-0 mt-8 grid-cols-5 md:px-6 px-2",
            isShowMap && "md:col-span-3",
            !isShowMap && "md:col-span-5"
          )}
        >
          {!isLoading && (
            <ProductList data={contents} column={isShowMap ? 3 : 5} />
          )}
          {contents?.length === 0 && !isLoading && (
            <div className="">
              <h1 className="font-semibold leading-7 text-2xl">
                Không có kết quả tìm kiếm phù hợp
              </h1>
              <p className="mt-3 text-base leading-[24px]">
                Hãy thử thay đổi hoặc xóa một số bộ lọc hoặc điều chỉnh khu vực
                tìm kiếm của bạn.
              </p>
            </div>
          )}
          {isLoading && (
            <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
              {new Array(10).fill(0).map((_, index) => (
                <div key={index}>
                  <Skeleton className="w-full mb-2 rounded-xl animate-pulse aspect-square" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className={cn(
            "relative flex-1 md:block hidden",
            isShowMap && "md:col-span-2 grid-cols-5",
            !isShowMap && "md:col-span-0 grid-cols-0"
          )}
        >
          <AnimatePresence>
            {isShowMap && (
              <motion.div
                className="sticky top-48"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <div className="rounded-lg overflow-hidden h-[740px]">
                  <MapSearch listings={contents} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Index;
