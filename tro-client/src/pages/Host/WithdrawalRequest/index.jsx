import { getInvoiceByHost } from "@/apis/invoice";
import {
  createPaymentInfo,
  deletePaymentInfo,
  getPaymentInfoByUser,
  updatePaymentInfo,
} from "@/apis/paymentInfo";
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
  MODAL_TYPE,
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR,
  WITHDRAWAL_STATUS,
  WITHDRAWAL_STATUS_COLOR,
} from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { formatCurrency } from "@/utils/helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, CreditCard, Landmark, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  createWithdrawalRequest,
  getWithdrawalRequestByUser,
} from "@/apis/withdrawalRequest";
import { getBalance } from "@/apis/user";
import { formattedDate } from "@/components/Modals/CreateInvoiceModal";
import { getTransactionByUser } from "@/apis/transactionHistory";

const WithdrawalRequest = () => {
  const { balance } = useUserStore();
  const { onClose, onOpen } = useModal();
  const [invoices, setInvoices] = useState(null);
  const [paymentInfos, setPaymentInfos] = useState(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState(null);
  const [reload, setReload] = useState(false);
  const [reloadWithdrawal, setReloadWithdrawal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, message, success } = await getInvoiceByHost(
          filters.page,
          filters.limit,
          true
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

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, message, success } = await getPaymentInfoByUser();
        if (success) {
          setPaymentInfos(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [reload]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, message, success } = await getWithdrawalRequestByUser(
          1,
          10
        );
        if (success) {
          setWithdrawalRequests(data);
          await getBalance();
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, [reloadWithdrawal]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, success } = await getTransactionByUser(1, 10);
        if (success) {
          setTransactionHistory(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleCreatePaymentInfo = async (payload) => {
    const toastId = toast.loading("Đang tạo", { position: "top-center" });
    try {
      const { data, success, message } = await createPaymentInfo({
        ...payload,
        isPrimary: Boolean(payload?.isPrimary),
      });
      if (success) {
        toast.success(message, { position: "top-center" });
        onClose();
        setReload(!reload);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeletePaymentInfo = async (id) => {
    const toastId = toast.loading("Đang xóa", { position: "top-center" });
    try {
      const { data, success, message } = await deletePaymentInfo(id);
      if (success) {
        toast.success(message, { position: "top-center" });
        setReload(!reload);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUpdatePaymentInfo = async (id) => {
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      const { data, success, message } = await updatePaymentInfo(id, {
        isPrimary: true,
      });
      if (success) {
        toast.success(message, { position: "top-center" });
        setReload(!reload);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };
  const handleCreateWithdrawalRequest = async (payload) => {
    const toastId = toast.loading("Đang gửi yêu cầu", {
      position: "top-center",
    });
    try {
      const { data, success, message } = await createWithdrawalRequest(payload);
      if (success) {
        toast.success(message, { position: "top-center" });
        setReloadWithdrawal(!reloadWithdrawal);
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { position: "top-center" });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleOpenModal = () => {
    onOpen(MODAL_TYPE.CREATE_PAYMENT_INFO_MODAL, {
      handleCreatePaymentInfo,
    });
  };

  const handleOpenModalWithdrawalRequest = () => {
    onOpen(MODAL_TYPE.CREATE_WITHDRAWAL_REQUEST_MODAL, {
      handleCreateWithdrawalRequest,
      paymentInfos,
      balance,
    });
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
            <BreadcrumbPage>Yêu cầu rút tiền</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu rút tiền</CardTitle>
          <CardDescription>Yêu cầu rút tiền</CardDescription>
        </CardHeader>
        <CardContent>
          <section className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="p-4 rounded-lg bg-muted flex justify-between items-center ">
                <div>
                  <p className="text-lg ">Số dư khả dụng</p>
                  <div className="font-semibold text-3xl">
                    {formatCurrency(balance)}
                  </div>
                </div>
                <Button onClick={handleOpenModalWithdrawalRequest}>
                  <CreditCard size={20} className="mr-2" /> Yêu cầu rút tiền
                </Button>
              </div>
              <div className="p-3 mt-8 border rounded-lg">
                <h2 className="font-semibold text-lg">
                  Lịch sử yêu cầu rút tiền
                </h2>
                {withdrawalRequests?.totalElement === 0 ? (
                  <div className="py-6 text-center bg-muted">
                    Lịch sử rút tiền trống.
                  </div>
                ) : (
                  <Table className="mt-3">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thông tin thanh toán</TableHead>
                        <TableHead>Ngày yêu cầu</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawalRequests?.contents?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>
                            <Badge
                              className="text-sm"
                              style={{
                                backgroundColor:
                                  WITHDRAWAL_STATUS_COLOR[item.status],
                              }}
                            >
                              {WITHDRAWAL_STATUS[item.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm">
                              {item.paymentInfo?.accountName}
                            </p>
                            <p className="text-xs">
                              {item.paymentInfo?.accountNumber}
                            </p>
                          </TableCell>
                          <TableCell>
                            {formattedDate(item.requestedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="p-3 mt-8 border rounded-lg">
                <h2 className="font-semibold text-lg">Lịch sử giao dịch</h2>
                {transactionHistory?.totalElement === 0 ? (
                  <div className="py-6 text-center bg-muted">
                    Lịch sử giao dịch trống.
                  </div>
                ) : (
                  <Table className="mt-3">
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Phí</TableHead>
                        <TableHead>Thực nhận</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Hình thức giao dịch</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionHistory?.contents?.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{formatCurrency(item.fee)}</TableCell>
                          <TableCell>
                            {formatCurrency(item.netAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              size="sm"
                              className="text-sm"
                              style={{
                                backgroundColor:
                                  TRANSACTION_STATUS_COLOR[item.status],
                              }}
                            >
                              {TRANSACTION_STATUS[item.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>Rút tiền</TableCell>
                          <TableCell>{formattedDate(item.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
            <div className="col-span-1 grid gap-y-8">
              <div className="rounded-lg  border p-4">
                <h2 className="text-lg font-semibold">
                  Danh sách hóa đơn đã thanh toán gần đây
                </h2>
                {invoices?.totalElement === 0 && (
                  <div className="py-6 text-center bg-muted">
                    Danh sách hóa đơn đã thanh toán trống.
                  </div>
                )}
                <ul className="grid gap-y-2">
                  {invoices?.contents?.map((item, index) => (
                    <div
                      className=" flex justify-between shadow-sm border-b border-muted rounded-md p-3 bg-white "
                      key={item.id}
                    >
                      <div className="flex gap-4">
                        <span className="font-semibold">{index + 1}</span>
                        <p>
                          {item?.rentedRoom?.listing?.title?.slice(0, 25)}...
                        </p>
                      </div>
                      <div className="font-semibold">
                        <Badge variant="success">
                          + {formatCurrency(item.totalAmount)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-lg border">
                <h2 className="text-lg font-semibold">
                  Phương thức thanh toán
                </h2>

                <ul className="mt-2 grid grid-cols-1 gap-y-2">
                  {paymentInfos?.length === 0 && (
                    <li className="text-center py-4 bg-muted">
                      Không có phương thức thanh toán
                    </li>
                  )}
                  {paymentInfos?.map((item) => (
                    <ContextMenu key={item.id}>
                      <ContextMenuTrigger>
                        <li className="relative p-2 bg-muted rounded-lg flex gap-4 items-center">
                          <Landmark size={28} />
                          <div>
                            <p className="text-lg tracking-widest font-semibold">
                              {item?.accountNumber}
                            </p>
                            <p className="text-sm  ">{item?.accountName}</p>
                          </div>
                          {item.isPrimary && (
                            <span className="absolute top-2 right-2">
                              <Badge className="text-[10px]">
                                Phương thức thanh toán chính
                              </Badge>
                            </span>
                          )}
                        </li>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          inset
                          onClick={() => handleUpdatePaymentInfo(item.id)}
                        >
                          <p> Đặt làm phương thức chính</p>
                        </ContextMenuItem>
                        <ContextMenuItem
                          inset
                          onClick={() => handleDeletePaymentInfo(item.id)}
                        >
                          <p>Xóa phương thức thanh toán</p>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                  <li className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      className="font-semibold"
                      onClick={handleOpenModal}
                    >
                      <Plus size={18} className="mr-2" /> Thêm phương thức thanh
                      toán
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalRequest;
