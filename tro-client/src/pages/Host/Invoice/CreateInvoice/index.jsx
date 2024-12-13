import { createInvoice } from "@/apis/invoice";
import { getRentedRoomByHost } from "@/apis/rentedRoom";
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
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { MODAL_TYPE, NOTIFICATION_TYPE } from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { formatCurrency } from "@/utils/helpers";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CreateInvoice = () => {
  const { user, socketConnection } = useUserStore();
  const [rooms, setRooms] = useState(null);
  const { onOpen } = useModal();
  const [filters, setFilter] = useState({
    page: 1,
    limit: 10,
    status: "CONFIRMER",
  });
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success, message } = await getRentedRoomByHost(
          filters.page,
          filters.limit,
          filters.status
        );
        if (success) {
          setRooms(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [filters]);

  const handleCreateInvoice = async (payload) => {
    const toastId = toast.loading("Đang gửi yêu cầu", {
      position: "top-center",
    });
    try {
      const { data, success, message } = await createInvoice(payload);
      if (success) {
        toast.success(message, { position: "top-center" });
        socketConnection.emit("sendNotification", {
          title: "Vừa có một hóa đơn mới",
          message: `Bạn vừa có một hóa đơn mới tới từ chủ phòng ${user?.fullName}`,
          type: NOTIFICATION_TYPE.CREATE_INVOICE,
          data,
          userId: data?.rentedRoom?.userId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const showModal = () => {
    onOpen(MODAL_TYPE.CREATE_INVOICE_MODAL, { rooms, handleCreateInvoice });
  };

  return (
    <div>
      <Breadcrumb className="hidden md:flex mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Hóa đơn</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm hóa đơn</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Thêm hóa đơn</CardTitle>
              <CardDescription>
                Thêm hóa đơn để thông báo cho người dùng số tiền phải trả trong
                tháng
              </CardDescription>
            </div>
            <Button onClick={showModal}>
              Thêm hóa đơn <Plus className="ml-2" size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="text-center">Giá phòng</TableHead>
                <TableHead className="text-center">
                  Số lượng hóa đơn chưa thanh toán
                </TableHead>
                <TableHead className="text-center">Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms?.contents?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <LazyLoadImage
                      effect="blur"
                      src={item?.listing?.images[0]?.url}
                      className="size-20 rounded-md"
                    />
                  </TableCell>
                  <TableCell className="md:max-w-[200px]">
                    {item?.listing?.address}
                  </TableCell>
                  <TableCell className="text-center ">
                    <Badge variant="secondary" className="text-md">
                      {formatCurrency(item?.listing?.price)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {item?._count?.invoice === 0 && (
                      <Badge variant="secondary">
                        Không có hóa đơn nào cần thanh toán
                      </Badge>
                    )}
                    {item?._count?.invoice !== 0 && (
                      <Badge variant="secondary" className="text-base">
                        {item?._count?.invoice}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button>
                          <Trash size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border p-2 bg-white rounded-md">
                        Xóa tất cả các hóa đơn phòng này
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInvoice;
