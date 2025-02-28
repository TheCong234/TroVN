/* eslint-disable react/prop-types */
import { Button, Select, Tour } from "antd";
import { FcAdvertising } from "react-icons/fc";
import ReactQuill from "react-quill";

import { Input } from "..";
import useListingStore from "@/hooks/useListingStore";

import { useEffect, useRef, useState } from "react";
import { generateDescription } from "@/utils/generateDescription";
import "react-quill/dist/quill.snow.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Index = ({ amenities, locations, tags }) => {
  const { updateListing, newListing } = useListingStore();
  const [isLoading, setIsLoading] = useState(false);
  const isTour = JSON.parse(localStorage.getItem("isTour"));

  const [open, setOpen] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);

  const steps = [
    {
      title: "Tiêu đề",
      description: "Nhập tiêu đề phù hợp với phòng của bạn!",
      target: () => ref1.current,
    },
    {
      title: "Thông tin chi tiết",
      description:
        "Nhập thông tin chi tíết đầy đủ sẽ giúp phòng cuart bạn tiếp cận được nhiều khách hàng nhất!",
      target: () => ref2.current,
    },
    {
      title: "Giá phòng",
      description:
        "Giá phòng hợp lý sẽ giúp bạn dễ dàng tiếp cận với nhiêu khách hàng hơn.",
      target: () => ref3.current,
    },
    {
      title: "Diện tích căn phòng",
      description: "Nhập diện tích căn phòng",
      target: () => ref4.current,
    },
    {
      title: "Địa chỉ",
      description:
        "Nhập đúng địa chỉ sẽ giúp phòng của bạn hiển thị đúng trên bản đồ",
      target: () => ref5.current,
    },
    {
      title: "Phương thức cho thuê",
      description: "Chọn phương thức cho thuê!",
      target: () => ref6.current,
    },
    {
      title: "Tiện ích",
      description: "Các tiện ích mà phòng bạn đang có.",
      target: () => ref7.current,
    },
    {
      title: "Hastag",
      description: "Thêm hastag .",
      target: () => ref8.current,
    },
  ];

  useEffect(() => {
    if (!isTour) {
      setOpen(true);
    }
  }, [isTour]);

  const amenityOptions = amenities.map((item) => ({
    label: (
      <div className="flex gap-2 items-center">
        <LazyLoadImage
          effect="blur"
          src={item.iconUrl}
          className="w-4 h-4 "
          alt=""
        />
        <span>{item.name}</span>
      </div>
    ),
    value: item.id,
  }));

  const locationOptions = locations.map((item) => ({
    label: `${item.name} - ${item.city}`,
    value: item.id,
  }));

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    updateListing(name, value);
  };

  const handleGenerate = async () => {
    try {
      setIsLoading(true);
      const data = await generateDescription();
      updateListing("description", data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-4 h-full w-full ">
        <div className="grid gap-4 col-span-2 h-full">
          <div className="bg-white p-6 rounded-xl h-fit border">
            <div className="mb-4">
              <h2 className="font-semibold text-2xl">Thông tin chi tiết</h2>
              <div className="text-sm text-[#717171] ">
                Điều quan trọng là phải kiên nhẫn, được khách hàng làm theo
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3" ref={ref1}>
                <div className="text-sm leading-[14px] font-medium">
                  Tiêu đề
                </div>
                <Input
                  value={newListing.title}
                  name="title"
                  onChange={handleChangeInput}
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-3 overflow-hidden pb-14" ref={ref2}>
                <div className="text-sm  flex justify-between items-center leading-[14px]font-medium">
                  Mô tả
                  <Button
                    loading={isLoading}
                    onClick={handleGenerate}
                    type="dashed"
                  >
                    Tạo nhanh
                  </Button>
                </div>
                <ReactQuill
                  value={newListing.description}
                  onChange={(content) => updateListing("description", content)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl border h-fit">
            <div className="mb-4">
              <h2 className="font-semibold text-2xl">Giá phòng và diện tích</h2>
              <div className="text-sm text-[#717171] ">
                Giá cả tối ưu là lựa chọn tốt nhất
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3" ref={ref3}>
                <div className="text-sm leading-[14px] font-medium">Giá</div>
                <Input
                  value={newListing.price}
                  name="price"
                  onChange={handleChangeInput}
                  type="text"
                />
              </div>
              <div className="grid gap-3" ref={ref4}>
                <div className="text-sm leading-[14px] font-medium">
                  Diện tích
                </div>
                <Input
                  value={newListing.area}
                  name="area"
                  onChange={handleChangeInput}
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border h-fit">
            <div className="mb-4">
              <h2 className="font-semibold text-2xl flex gap-2 items-center">
                Địa chỉ <FcAdvertising />{" "}
              </h2>
              <div className="text-sm text-[#717171] ">
                Thành phố nơi có phòng của bạn (Quan trọng không được để trống)
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3" ref={ref5}>
                <div className="text-sm leading-[14px] font-medium">
                  Tỉnh / Thành phố
                </div>
                <Select
                  showSearch
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label.toLocaleLowerCase() ?? "").includes(
                      input.toLocaleLowerCase()
                    )
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(value) => updateListing("locationId", value)}
                  options={locationOptions}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4  h-fit">
          <div className="bg-white p-6 rounded-xl border" ref={ref6}>
            <div className="mb-4">
              <h2 className="font-semibold text-2xl">Phương thức cho thuê</h2>
              <div className="text-sm text-[#717171] ">
                Chọn phương thức cho thuê
              </div>
            </div>
            <div className="grid gap-4">
              <div className="text-sm leading-[14px] font-medium">
                Phương thức
              </div>
              <Select
                className="w-full min-h-10 rounded-md text-sm "
                value={newListing.term}
                onChange={(value) => updateListing("term", value)}
                options={[
                  {
                    label: "Cho thuê ngắn hạn",
                    value: "SHORT",
                  },
                  {
                    label: "Cho thuê dài hạn",
                    value: "LONG",
                  },
                  {
                    label: "Cho thuê ngắn hạn và dài hạn",
                    value: "BOTH",
                  },
                ]}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border" ref={ref7}>
            <div className="mb-4">
              <h2 className="font-semibold text-2xl">Tiện ích và dịch vụ</h2>
              <div className="text-sm text-[#717171] ">
                Những tiện ích và dịch vụ của nhà ở
              </div>
            </div>
            <div className="grid gap-3">
              <div className="text-sm leading-[14px] font-medium">Tiện ích</div>
              <Select
                className="w-full min-h-10 rounded-md text-sm "
                mode="multiple"
                value={newListing.amenityConnections}
                onChange={(value) => updateListing("amenityConnections", value)}
                options={amenityOptions}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border" ref={ref8}>
            <div className="mb-4">
              <h2 className="font-semibold text-2xl">Thêm #Hastag</h2>
              <div className="text-sm text-[#717171] ">
                #Hastag có thể giúp phòng của bạn tiếp cận được với nhiều khách
                hàng hơn
              </div>
            </div>
            <div className="grid gap-3">
              <div className="text-sm leading-[14px] font-medium">Tag</div>
              <Select
                mode="tags"
                value={newListing.tags}
                className="w-full min-h-10 rounded-md text-sm"
                onChange={(value) => {
                  updateListing("tags", value);
                }}
                options={tags.map((item) => ({
                  label: item.name,
                  value: item.name,
                }))}
              />
            </div>
          </div>
        </div>
      </div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} animated />
    </>
  );
};

export default Index;
