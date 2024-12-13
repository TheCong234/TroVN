import { getInvoiceByHost } from "@/apis/invoice";
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
import { formatCurrency } from "@/utils/helpers";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, message, success } = await getInvoiceByHost(
          filters.page,
          filters.limit
        );
        if (success) {
          setInvoices(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [filters]);
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
            <BreadcrumbPage>Danh sách hóa đơn </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hóa đơn</CardTitle>
          <CardDescription>Danh sách hóa đơn</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Người thuê</TableHead>
                <TableHead>Giá phòng</TableHead>
                <TableHead>Tiền điện</TableHead>
                <TableHead>Tiền nước</TableHead>
                <TableHead>Chi phí khác</TableHead>
                <TableHead>Tổng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tùy chọn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.contents?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <LazyLoadImage
                      effect="blur"
                      src={item?.rentedRoom?.listing?.images[0]?.url}
                      className="size-20 rounded-md"
                    />
                  </TableCell>
                  <TableCell className="md:max-w-[160px]">
                    {item?.rentedRoom?.listing?.address?.slice(0, 50)}...
                  </TableCell>
                  <TableCell>
                    {item?.rentedRoom?.user?.fullName ||
                      item?.rentedRoom?.user?.phoneNumber}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(item?.rentedRoom?.listing?.price)}
                  </TableCell>
                  <TableCell>{formatCurrency(item?.electricityFee)}</TableCell>
                  <TableCell>{formatCurrency(item?.waterFee)}</TableCell>
                  <TableCell>{formatCurrency(item?.otherFee)}</TableCell>
                  <TableCell>{formatCurrency(item?.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {item?.paymentStatus
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost">
                      {/* <Trash2 size={20} /> */}
                    </Button>
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

export default InvoiceList;
