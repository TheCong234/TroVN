import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
/* eslint-disable react-hooks/exhaustive-deps */
import { Tag, message } from "antd";
import { formatCurrency, getTerm } from "@/utils/helpers";
import { getHostListings, updateListing } from "@/apis/listing";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListingDrawer } from "@/components";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import useListingStore from "@/hooks/useListingStore";
import useUserStore from "@/hooks/useUserStore";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const {
    hostListings: { contents, totalElements, currentPage, pagination },
    setHostListings,
    setCurrentPageHostListing,
    updateSomeListing,
  } = useListingStore();
  const { user } = useUserStore();

  const [listings, setListings] = useState(contents);

  const showDrawer = (record) => {
    setRecord(record);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setRecord(null);
  };

  const handleUpdate = async (record, userId, value) => {
    const toastId = toast.loading("Đang chờ...", { position: "top-center" });
    try {
      setUpdateLoading(true);
      const { success, data } = await updateListing(record.id, {
        isPublish: value,
        userId: userId,
      });
      setUpdateLoading(false);

      if (success) {
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === record.id
              ? { ...listing, ...record, isPublish: value }
              : listing
          )
        );
        updateSomeListing(data);
        toast.success("Thành công", { position: "top-center" });
      } else {
        toast.error("Thất bại");
      }
    } catch (error) {
      setUpdateLoading(false);
      console.log(error);
      toast.error(error.response.data.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Tiêu đề",
        width: 200,
        dataIndex: "title",
        key: "name",
        fixed: "left",
        render: (title) => {
          return <div>{title?.slice(0, 20)}</div>;
        },
      },
      {
        title: "Diện tích",
        dataIndex: "area",
        key: "area",
        fixed: "left",
        render: (area) => {
          return (
            <div>
              {area}m<sup>2</sup>
            </div>
          );
        },
      },
      {
        title: "Loại hình cho thuê",
        dataIndex: "term",
        key: "1",
        // width: 150,
        render: (term) => {
          return <Tag color="green">{getTerm(term)}</Tag>;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "2",
        render: (address) => {
          return <div>{address.slice(0, 50)}</div>;
        },
      },
      {
        title: "Giá (vnd)",
        dataIndex: "price",
        key: "3",
        render: (price) => {
          let money = parseFloat(price);
          return <div>{formatCurrency(money)}</div>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "isPublish",
        key: "isPublish",
        render: (isPublish, record) => (
          <Switch
            loading={updateLoading}
            checked={isPublish}
            onChange={(value) => handleUpdate(record, record.userId, value)}
          />
        ),
      },
      {
        title: "Chi tiết",
        key: "operation",
        fixed: "right",
        render: (_, record) => (
          <Button className="cursor-pointer" onClick={() => showDrawer(record)}>
            Xem chi tiêt
          </Button>
        ),
      },
    ],
    [handleUpdate, updateLoading]
  );

  useEffect(() => {
    setListings(contents);
  }, [contents]);

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          setIsLoading(true);
          const { data, success } = await getHostListings(user.id);
          setIsLoading(false);
          if (success) {
            setHostListings(data);
          }
        } catch (error) {
          setIsLoading(false);
          return toast.error(error.message);
        }
      })();
    }
    const fetchListings = async () => {};

    fetchListings();
  }, [setHostListings, pagination, user]);

  const handleTableChange = (page, pageSize) => {
    setCurrentPageHostListing(page, pageSize);
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
              <Link href="#">Phòng cho thuê</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách phòng cho thuê</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng cho thuê</CardTitle>
          <CardDescription>Danh sách phòng đã thêm</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Danh sách phòng cho thuê.</TableCaption>
            <TableHeader>
              <TableRow className="font-semibold">
                {/* <TableCell>#</TableCell> */}
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Diện tích</TableCell>
                <TableCell>Loại hình cho thuê</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chi tiết</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings?.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell title={listing.title}>
                    {listing.title?.slice(0, 20)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {listing.area} m<sup>2</sup>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTerm(listing.term)}</Badge>
                  </TableCell>
                  <TableCell title={listing.address}>
                    {listing.address?.slice(0, 40)}...
                  </TableCell>
                  <TableCell>{formatCurrency(listing.price)}</TableCell>
                  <TableCell>
                    {listing?.rentedRoom?.length > 0 && (
                      <Badge variant="outline">Phòng đang cho thuê</Badge>
                    )}
                    {listing?.rentedRoom?.length === 0 && (
                      <Switch
                        checked={listing.isPublish}
                        onCheckedChange={(value) =>
                          handleUpdate(listing, listing.userId, value)
                        }
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => showDrawer(listing)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {record && (
            <ListingDrawer open={open} onClose={onClose} listing={record} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
