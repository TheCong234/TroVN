import { getRentedRoomByUser, updateRentedRoom } from "@/apis/rentedRoom";
import { Badge } from "@/components/ui/badge";
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
import { RENTED_ROOM_STATUS, RENTED_ROOM_STATUS_COLOR } from "@/enums";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const RentedRoom = () => {
  const [rentedRooms, setRentedRooms] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success, message } = await getRentedRoomByUser(1, 10);
        if (success) {
          setRentedRooms(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleUpdateRentedRoom = async (id, value) => {
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      const { success } = await updateRentedRoom(id, value);
      if (success) {
        toast.success("Cập nhật thành công", { position: "top-center" });
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/rented-room/${id}`);
  };

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
            <BreadcrumbPage>Danh sách phòng đã xác nhận</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-semibold text-xl my-4">
        Danh sách phòng đã xác nhận
      </h1>
      <div className="grid md:grid-cols-7 grid-cols-1 gap-x-8">
        <div className="col-span-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Chủ phòng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentedRooms?.contents?.map((item, index) => (
                <TableRow key={item} onClick={() => handleNavigate(item.id)}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <LazyLoadImage
                      effect="blur"
                      src={item?.listing?.images[0]?.url}
                      className="size-12 rounded-md"
                      alt=""
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        {item?.listing?.address.slice(0, 30)}...
                      </TooltipTrigger>
                      <TooltipContent>{item?.listing?.address}</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item?.listing?.user?.fullName}</TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor: RENTED_ROOM_STATUS_COLOR[item.status],
                      }}
                    >
                      {RENTED_ROOM_STATUS[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === "PENDING" && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateRentedRoom(item.id, {
                              status: "CANCELLED",
                            })
                          }
                        >
                          Từ chối
                        </Button>
                        <Button
                          className="ml-2"
                          onClick={() =>
                            handleUpdateRentedRoom(item.id, {
                              isTenantConfirmed: true,
                            })
                          }
                        >
                          Xác nhận
                        </Button>
                      </>
                    )}
                    {item.status !== "PENDING" && (
                      <Button variant="outline" disabled>
                        Đã xử lý
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {rentedRooms?.totalElement === 0 && (
                <TableCell
                  colSpan={6}
                  className="text-center font-semibold text-base bg-muted py-5"
                >
                  Không tìm thấy phòng nào
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Xác nhận phòng đã thuê</CardTitle>
            <CardDescription>
              Xác nhận rằng phòng này đã được thuê
            </CardDescription>

            <CardContent>Hello</CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default RentedRoom;
