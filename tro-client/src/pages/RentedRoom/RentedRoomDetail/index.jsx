import { getRentedRoomById, updateRentedRoom } from "@/apis/rentedRoom";
import { AmenitiesList, DialogConfirm } from "@/components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NOTIFICATION_TYPE, RENTED_ROOM_STATUS } from "@/enums";
import useUserStore from "@/hooks/useUserStore";
import { formatCurrency } from "@/utils/helpers";
import moment from "moment";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { id } = useParams();
  const { socketConnection, user } = useUserStore();
  const [rentedRoom, setRentedRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { success, data, message } = await getRentedRoomById(id);
        console.log(success);

        if (success) {
          setRentedRoom(data);
          return;
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 404) {
          navigate("/");
        }
      }
    };
    fetch();
  }, [id, reload]);

  const handleUpdateRentedRoom = async (id, value) => {
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      const { success, data } = await updateRentedRoom(id, value);
      if (success) {
        toast.success("Cập nhật thành công", { position: "top-center" });
        socketConnection.emit("sendNotification", {
          title: "Yêu cầu hủy phòng ",
          message: ` ${
            user?.fullName || user?.email
          } đã gửi một yêu cầu hủy phòng`,
          type: NOTIFICATION_TYPE.CANCELED_RENTED_ROOM,
          data,
          userId: data?.listing?.userId,
        });
        handleReload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const isCancelProcess =
    rentedRoom?.status === "CONFIRMER" && !rentedRoom?.isTenantConfirmed;

  return (
    <div className="container">
      <Breadcrumb className="py-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/rented-room/room">Danh sách phòng đã xác nhận</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chi tiết phòng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className=" text-xl font-semibold">Chi tiết phòng đã xác nhận </h1>
      <div className=" grid md:grid-cols-7 gap-x-6">
        <div className="col-span-5">
          <div className="py-2">
            <article>
              <div>
                <h4 className="font-semibold mt-2 text-base">Thời gian</h4>
                <ul className="[&>li]:list-disc [&>li]:ml-4 [&>li]:text-base [&>li]:mt-1">
                  <li>
                    Thời gian thuê phòng từ ngày{" "}
                    <span>
                      {moment(rentedRoom?.startDate).format("DD-MM-YYYY")}
                    </span>{" "}
                    đến ngày{" "}
                    <span>
                      {moment(rentedRoom?.endDate).format("DD-MM-YYYY")}
                    </span>
                    .
                  </li>
                  <li>
                    Hãy chắc chắn rằng bạn đã lên kế hoạch cho kỳ nghỉ của mình
                    trong khoảng thời gian này.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mt-2 text-base">
                  Thông tin chủ phòng
                </h4>
                <ul className="[&>li]:list-disc [&>li]:ml-4 [&>li]:text-base [&>li]:mt-1">
                  <LazyLoadImage
                    effect="black-and-white"
                    src={rentedRoom?.listing?.user?.avatarUrl}
                    alt="Avatar của chủ phòng"
                    loading="eager"
                    className="size-24 rounded-lg border-4 shadow-sm"
                  />
                  <li>
                    <span className="ml-2 font-semibold">
                      {rentedRoom?.listing?.user?.fullName}
                    </span>
                  </li>
                  <li>
                    Thông tin liên hệ:{" "}
                    {rentedRoom?.listing?.user?.address ||
                      rentedRoom?.listing?.user?.email}
                  </li>
                  <li>
                    Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ trực tiếp với chủ
                    phòng.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mt-2 text-base">Thông tin thêm</h4>
                <ul className="[&>li]:list-disc [&>li]:ml-4 [&>li]:text-base [&>li]:mt-1">
                  <li>Bạn sẽ có thể tận hưởng chỗ ở thoải mái và tiện nghi.</li>
                  <li>Chỗ đỗ xe miễn phí trong khuôn viên.</li>
                  <li>
                    Không hút thuốc, không thú cưng, không tổ chức sự kiện.
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </div>
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{rentedRoom?.listing?.title}</CardTitle>
              <CardDescription>{rentedRoom?.listing?.address}</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <LazyLoadImage
                  effect="blur"
                  src={rentedRoom?.listing?.images[0]?.url}
                  className="aspect-square rounded-md "
                  alt=""
                />
              </div>
              <div className="mt-4">
                {new Date(rentedRoom?.endDate) < new Date() &&
                  !isCancelProcess && (
                    <Button
                      className=" w-full font-semibold ttext-base"
                      size="lg"
                    >
                      Trả phòng
                    </Button>
                  )}
                {new Date(rentedRoom?.endDate) > new Date() &&
                  !isCancelProcess && (
                    <Button
                      className=" w-full font-semibold text-base"
                      variant="outline"
                      size="lg"
                      onClick={onOpen}
                    >
                      Hủy thuê phòng
                    </Button>
                  )}
                {isCancelProcess && (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full text-base"
                  >
                    Đang chờ chấp nhận hủy
                  </Button>
                )}
              </div>
              <div className="text-xs">
                <div className="mt-2 mb-2 text-base font-semibold">
                  Tiện ich phòng
                </div>
                <AmenitiesList
                  listingAmenities={rentedRoom?.listing?.listingAmenities}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <DialogConfirm
        title="Bạn có chắc chắn muốn hủy thê phòng "
        description="Khi bạn hủy thuê phòng trước hạn bạn có thể bị giữ tiền cọc phòng"
        handleOk={() =>
          handleUpdateRentedRoom(id, { isTenantConfirmed: false })
        }
        open={open}
        onClose={onClose}
      />
    </div>
  );
};

export default Index;
