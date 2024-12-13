import { CiLocationOn, CiSearch } from "react-icons/ci";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Search, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  deleteAllSearchHistory,
  deleteSearchHistory,
  getSearchHistories,
} from "@/apis/searchHistory";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MdHistory } from "react-icons/md";
import { cn } from "@/utils/helpers";
import { deleteAmenityById } from "@/apis/amenities";
import { getLocations } from "@/apis/location";
import qs from "query-string";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import useListingStore from "@/hooks/useListingStore";
import useLocationStore from "@/hooks/useLocationStore";
import useMapStore from "@/hooks/useMapStore";
import { useNavigate } from "react-router-dom";
import useSearchStore from "@/hooks/useSearchStore";
import useUserStore from "@/hooks/useUserStore";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = () => {
  // REACT HOOK
  const { locations, setLocations } = useLocationStore();

  const [keyword, setKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState(locations);
  // const [searchHistories, setSearchHistories] = useState(null);
  const { searchHistories } = useSearchStore();
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  // CUSTOM HOOK
  const [debouncedKeyword] = useDebounce(keyword, 500);
  const { setSearchLatLng } = useMapStore();
  const { user } = useUserStore();
  const { setSearchListingKeyword, updateSearchListings, clearSearchFilter } =
    useListingStore();

  const handleSearch = () => {
    const queryParams = qs.stringify({ keyword: debouncedKeyword });
    setSearchListingKeyword(debouncedKeyword);
    navigate(`/search?${queryParams}`);
  };

  const handleClickSearchLocation = (location) => {
    clearSearchFilter();
    setSearchLatLng(location.latitude, location.longitude);
    updateSearchListings("locationId", location.id);
    navigate(`/search?${location.name} - ${location.city}`);
  };

  const handleChangeQuery = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    if (debouncedKeyword) {
      const fetchLocations = async () => {
        const { data } = await getLocations(1, 1000, debouncedKeyword);
        setSearchLocation(data?.contents);
        setLocations(data?.contents);
      };
      fetchLocations();
    } else {
      setSearchLocation(locations);
    }
  }, [debouncedKeyword]);

  const items = searchLocation?.map((item) => ({
    label: (
      <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-100 p-2">
        <CiLocationOn size={22} />
        {`${item.name} - ${item.city}`}
      </div>
    ),
    value: item.id,
    native: item,
  }));

  const handleRemoveSearchHistory = async (id) => {
    try {
      const { status } = await deleteSearchHistory(id);
      if (status === 204) {
        setReload(!reload);
        toast.success("Xóa lịch sử tìm kiếm thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleRemoveAllSearchHistory = async () => {
    try {
      const { status } = await deleteAllSearchHistory();
      if (status === 204) {
        setReload(!reload);
        toast.success("Xóa tất cả lịch sử tìm kiếm thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleSelectedSearchKeyword = (keyword) => {
    const queryParams = qs.stringify({ keyword });
    navigate(`/search?${queryParams}`);
    setSearchListingKeyword(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="md:w-[80%] w-full ">
        <div className="flex bg-white md:h-[52px] h-[42px] items-center gap-4 group  shadow-md rounded-[999px] overflow-hidden md:pl-4  w-full border">
          <div className="text-base pl-6 text-left text-muted-foreground flex-1">
            <p className="text-secondary-foreground md:text-base text-xs ">
              Tìm kiếm
            </p>
            <p className=" md:text-xs text-[10px] leading-none ">
              Khu vực • Tên • Địa chỉ
            </p>
          </div>
          <Button
            type="primary"
            className={cn(
              "md:size-[52px] size-[42px] rounded-full h-full p-1 flex overflow-hidden gap-2 items-center"
            )}
            onClick={handleSearch}
          >
            <CiSearch size={20} strokeWidth={2} />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="md:min-w-[800px]   min-w-[380px] rounded-3xl shadow-lg p-6">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div className="col-span-1">
            <div className="text-base font-medium mb-2">Tìm kiếm</div>
            <Input
              placeholder="Nhập địa chỉ"
              onChange={handleChangeQuery}
              onKeyDown={handleKeyDown}
            />
            <div className="text-base font-medium mt-2 flex justify-between items-center">
              <span> Lịch sử tìm kiếm</span>
              {searchHistories?.length > 0 && (
                <span
                  className="text-xs font-semibold cursor-pointer"
                  onClick={() => handleRemoveAllSearchHistory()}
                >
                  Xóa tất cả
                </span>
              )}
            </div>
            <ul className="mt-2">
              {searchHistories &&
                searchHistories?.map((item) => (
                  <>
                    <li
                      className="flex group justify-between py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                      onClick={() => handleSelectedSearchKeyword(item.content)}
                    >
                      <div className="flex gap-2 items-center">
                        <MdHistory />
                        <span>{item.content}</span>
                      </div>
                      <Tooltip className="">
                        <TooltipContent>Xóa</TooltipContent>
                        <TooltipTrigger>
                          <X
                            className="text-muted-foreground group-hover:block hidden "
                            size={18}
                            onClick={() => handleRemoveSearchHistory(item.id)}
                          />
                        </TooltipTrigger>
                      </Tooltip>
                    </li>
                  </>
                ))}
              {!searchHistories?.length && (
                <>
                  <li
                    className="flex justify-between py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() =>
                      handleSelectedSearchKeyword("Phòng tại quận 8")
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <Search size={16} />
                      <span>Phòng tại quận 8</span>
                    </div>
                  </li>
                  <li
                    className="flex justify-between py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() => handleSelectedSearchKeyword("Phòng đẹp")}
                  >
                    <div className="flex gap-2 items-center">
                      <Search size={16} />
                      <span>Phòng đẹp</span>
                    </div>
                  </li>
                  <li
                    className="flex justify-between py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() =>
                      handleSelectedSearchKeyword("Phòng cho 5 người")
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <Search size={16} />
                      <span>Phòng cho 5 người</span>
                    </div>
                  </li>
                  <li
                    className="flex justify-between py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() => handleSelectedSearchKeyword("Phòng có TV")}
                  >
                    <div className="flex gap-2 items-center">
                      <Search size={16} />
                      <span>Phòng có TV</span>
                    </div>
                  </li>
                </>
              )}
              {/* {!searchHistories &&
                searchLocation &&
                searchLocation.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-2 items-center py-1 cursor-pointer hover:bg-secondary p-2 rounded-md"
                    onClick={() => handleClickSearchLocation(item)}
                  >
                    <Search size={16} />
                    <span>{item.name}</span>
                  </li>
                ))} */}
            </ul>
          </div>
          <div>
            <div className="text-base font-medium mb-2">Danh sách địa chỉ</div>
            <div className="col-span-1 grid grid-cols-3 gap-2">
              {locations?.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleClickSearchLocation(item)}
                  className="cursor-pointer"
                >
                  <div>
                    <LazyLoadImage
                      effect="blur"
                      src="/location.jpg"
                      alt="location"
                      className=" rounded-md shadow-sm mb-2 hover:opacity-80 transition-all"
                    />
                    <label htmlFor="" className="text-sm leading-4">
                      {item.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Index;
