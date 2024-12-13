import * as yup from "yup";

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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MODAL_TYPE } from "@/enums";
import { createBanner } from "@/apis/banner";
import { formatCurrency } from "@/utils/helpers";
import { getOrdersByCurrentUser } from "@/apis/order";
import moment from "moment";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
  .object({
    title: yup.string().min(6).required(),
    description: yup.string().min(8).required(),
    fromDate: yup.date(),
    toDate: yup.date(),
    paymentId: yup.string(),
    file: yup.object(),
  })
  .required();
const Index = () => {
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [adsPackageSelect, setAdsPackageSelect] = useState(null);
  const { onOpen } = useModal();

  const showModal = (record) => {
    const { payment } = record;
    // setAdsPackageSelect(record);
    setValue("paymentId", payment.id);
    onOpen(MODAL_TYPE.CREATE_BANNER_MODAL, { adsPackageSelect: record });
    // setOpen(true);
  };

  const handleOk = async () => {
    try {
      const value = getValues();
      setConfirmLoading(true);
      const { success } = await createBanner(value);
      setConfirmLoading(false);
      if (success) {
        toast.success("Thành công");
      }
    } catch (error) {
      toast.success(error.message);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      const { data } = await getOrdersByCurrentUser("advertisingPackage");
      setOrders(data);
    })();
  }, []);

  const {
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      description: "",
      title: "",
      fromDate: "",
      toDate: "",
      file: "",
      paymentId: "",
    },
    reValidateMode: "onBlur",
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  // const disabledDaysDate = (current, { from }) => {
  //   if (current && current < moment().startOf("day")) {
  //     return true;
  //   }
  //   if (from) {
  //     return (
  //       Math.abs(current.diff(from, "days")) >
  //       +adsPackageSelect?.advertisingPackage?.duration
  //     );
  //   }
  //   return false;
  // };

  //   {
  //     !user?.isPremium && <Services />;
  //   }

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
              <Link href="#">Gói quảng bá</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lịch sử mua gói quảng bá</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className>
        <CardHeader className="px-7">
          <CardTitle>Lịch sử mua gói quảng bá</CardTitle>
          <CardDescription>
            Tất cả lịch sử giao dịch mua gói quảng bá.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Tất cả các gói đã mua.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] text-nowrap">
                  Mã giao dịch
                </TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Thời hạn (ngày)</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tổng thanh toán</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Tình trạng thanh toán</TableHead>
                <TableHead>Ngày thanh toán</TableHead>
                <TableHead>Sử dụng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.payment.transactionId}
                    {/* <Badge className="text-xs" variant="secondary"></Badge> */}
                  </TableCell>
                  <TableCell>{order.advertisingPackage.name}</TableCell>
                  <TableCell>{order.advertisingPackage.duration}</TableCell>
                  <TableCell>
                    {formatCurrency(order.advertisingPackage.price)}
                  </TableCell>
                  <TableCell>{formatCurrency(order.amount)}</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="secondary">
                      {order.payment.provider}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.payment.status ? (
                      <Badge className="text-xs" variant="success">
                        Thành công
                      </Badge>
                    ) : (
                      <Badge className="text-xs" variant="destructive">
                        Thất bại
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {order?.payment?.isActive && (
                      <Button onClick={() => showModal(order)}>Sử dụng</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {orders?.length === 0 && (
                  <TableCell
                    className="w-full text-center text-xl font-medium py-10"
                    colSpan="9"
                  >
                    Bạn chưa mua bất kì gói nào
                  </TableCell>
                )}
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
