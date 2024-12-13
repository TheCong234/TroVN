import {
  deleteRentedRoom,
  getRentedRoomByHost,
  updateRentedRoom,
} from "@/apis/rentedRoom";
import { DialogConfirm, RentalContract } from "@/components";
import { Contract } from "@/components/Contract";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MODAL_TYPE,
  NOTIFICATION_TYPE,
  RENTED_ROOM_STATUS,
  RENTED_ROOM_STATUS_COLOR,
} from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { formatDuration } from "@/utils/helpers";
import { addMonths, format } from "date-fns";
import dayjs from "dayjs";
import { set, truncate } from "lodash";
import { Eye, Printer } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const HostRentedRoom = () => {
  const { user, socketConnection } = useUserStore();

  const [rentedRooms, setRentedRooms] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [record, setRecord] = useState(null);
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const modalAction = useModal();

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  const handleOpenCancel = (record) => {
    setRecord(record);
    setOpenCancel(true);
  };

  const handleDurationChange = (months, record) => {
    setRecord(record);
    const newEndDate = addMonths(new Date(), months);
    setEndDate(newEndDate);
    onOpen();
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success, message } = await getRentedRoomByHost(1, 10);
        if (success) {
          setRentedRooms(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [reload]);

  const handleUpdate = async () => {
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      if (!record.id) {
        return toast.error("Vui lòng chọn phần để cập nhật");
      }
      const { success, data } = await updateRentedRoom(record?.id, {
        startDate: new Date(),
        endDate,
      });
      if (success) {
        toast.success("Cập nhật thành công", { position: "top-center" });

        handleReload();
        onClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  // const handleUpdateListing = async () => {
  //   try {
  //     if(!record?.listingId) {
  //       return toast.error("Vui lòng chọn phần để cập nhật");
  //     }
  //     if(!user){
  //       return toast.error("Vui lòng đăng nhập");
  //     }
  //     const { success, data } = await updateListing(record?.listingId, {
  //       isPublish: false,
  //       userId: user.id
  //     });
  //   } catch (error) {
  //     console.log(error);

  //   }
  // }

  const handleDeleteRentedRoom = async () => {
    if (!record?.id) {
      return toast.error("Vui lòng chọn phần để xóa");
    }
    const toastId = toast.loading("Đang xử lý", { position: "top-center" });
    try {
      const { success, message } = await updateRentedRoom(record.id, {
        status: "CANCELLED",
        isOwnerConfirmed: false,
      });
      if (success) {
        toast.success(message, { position: "top-center" });
        handleReload();
        socketConnection.emit("sendNotification", {
          title: "Xác nhận yêu cầu hủy phòng 👋",
          message: ` ${
            user?.fullName || user?.email
          } đã xác nhận yêu cầu hủy phòng của bạn! 👌`,
          type: NOTIFICATION_TYPE.ACCEPT_CANCELED_RENTED_ROOM,
          userId: record.userId,
        });
        setOpenCancel(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phòng cho đã cho thuê</CardTitle>
        <CardDescription>
          Danh sách những phòng được người cho thuê / người thuê đã xác nhận đã
          thuê
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>Lọc</div>
        <Table>
          <TableHeader>
            <TableRow className="[&>th]:text-nowrap">
              <TableHead>STT</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Người thuê</TableHead>
              <TableHead>Thời hạn</TableHead>
              <TableHead>Người cho thuê xác nhận</TableHead>
              <TableHead>Người thuê xác nhận</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center">Tùy chọn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentedRooms?.contents?.map((room, index) => (
              <TableRow key={room.id} className="[&>td]:text-nowrap">
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Link to={`/listing/${room.listing.id}`}>
                    <LazyLoadImage
                      effect="blur"
                      src={room.listing?.images[0].url}
                      className="size-16 rounded-md"
                      alt=""
                    />
                  </Link>
                </TableCell>

                <TableCell>
                  <Link to={`/listing/${room.listing.id}`}>
                    <Tooltip>
                      <TooltipTrigger>
                        {room.listing?.address.slice(0, 30)}...
                      </TooltipTrigger>
                      <TooltipContent>{room.listing?.address}</TooltipContent>
                    </Tooltip>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/user/new-info/${room.user.id}`}>
                    {room.user.fullName || room.user.email}
                  </Link>
                </TableCell>
                <TableCell>
                  {room.startDate === room.endDate && (
                    <div className="relative">
                      <Select
                        onValueChange={(value) =>
                          handleDurationChange(Number(value), room)
                        }
                      >
                        <SelectTrigger className="">
                          {/* <SelectValue className="placeholder-gray-800" placeholder={formatDuration(room.startDate, room.endDate)} /> */}
                          <SelectValue
                            className="placeholder-gray-800"
                            placeholder={
                              endDate
                                ? format(endDate, "dd/MM/yyyy")
                                : "Chọn thời hạn thuê"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Chọn thời hạn thuê</SelectLabel>
                            <SelectItem value="1">1 Tháng</SelectItem>
                            <SelectItem value="3">3 Tháng</SelectItem>
                            <SelectItem value="6">6 Tháng</SelectItem>
                            <SelectItem value="12">12 Tháng</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                        <div className="size-2 rounded-full bg-primary absolute top-0 -right-1" />
                      </Select>
                    </div>
                  )}
                  {room.startDate !== room.endDate && (
                    <Select
                      onValueChange={(value) =>
                        handleDurationChange(Number(value))
                      }
                    >
                      <SelectTrigger disabled className="">
                        <SelectValue
                          className="placeholder-gray-800"
                          placeholder={formatDuration(
                            room.startDate,
                            room.endDate
                          )}
                        />
                      </SelectTrigger>
                    </Select>
                  )}
                </TableCell>

                <TableCell>
                  {
                    <Badge
                      variant={room.isOwnerConfirmed ? "success" : "secondary"}
                    >
                      {room.isOwnerConfirmed ? "Xác nhận" : "Đang chờ"}
                    </Badge>
                  }
                </TableCell>
                <TableCell>
                  {
                    <Badge
                      variant={room.isTenantConfirmed ? "success" : "secondary"}
                    >
                      {room.isTenantConfirmed ? "Xác nhận" : "Đang chờ"}
                    </Badge>
                  }
                </TableCell>
                <TableCell>
                  <Badge
                    style={{
                      backgroundColor: RENTED_ROOM_STATUS_COLOR[room.status],
                    }}
                  >
                    {RENTED_ROOM_STATUS[room.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {!(
                    room.status === "CONFIRMER" && !room.isTenantConfirmed
                  ) && (
                    <Button
                      onClick={() =>
                        modalAction.onOpen(MODAL_TYPE.CONTRACT_MODAL, {
                          room,
                        })
                      }
                      variant="outline"
                    >
                      <Printer className="size-4" />
                      <span className="ml-2">In hợp đồng</span>
                    </Button>
                  )}

                  {room.status === "CONFIRMER" && !room.isTenantConfirmed && (
                    <Button
                      onClick={() => handleOpenCancel(room)}
                      className="ml-2"
                    >
                      Xác nhận yêu cầu hủy
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {rentedRooms?.totalElement === 0 && (
              <TableCell
                colSpan={9}
                className="text-center text-base font-semibold bg-muted py-5"
              >
                <div className="mb-2">Bạn chưa có phòng nào được thuê</div>
                <Button className="font-semibold">
                  <Link to="/host/v2/listing/create">Thêm phòng</Link>
                </Button>
              </TableCell>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="text-center flex justify-center text-muted-foreground">
        Danh sách phòng.
      </CardFooter>

      <DialogConfirm
        description={`Bạn có chắc chắn thời gian cho thuê đến ngày ${dayjs(
          endDate
        ).format(
          "DD-MM-YYYY"
        )} không? (Hành động này sẽ không thể quay lại được) `}
        title="Xác nhận thời hạn cho thuê"
        open={open}
        onClose={onClose}
        handleOk={handleUpdate}
      />

      <DialogConfirm
        title="Xác nhận yêu cầu hủy"
        description="Chấp nhận yêu cầu hủy phòng của khách thuê"
        open={openCancel}
        onClose={() => setOpenCancel(false)}
        handleOk={handleDeleteRentedRoom}
      />
    </Card>
  );
};

export default HostRentedRoom;
