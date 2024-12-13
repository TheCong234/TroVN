import {
  getWithdrawalRequests,
  updateWithdrawalRequest,
} from "@/apis/withdrawalRequest";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Table } from "antd";
import { formattedDate } from "@/components/Modals/CreateInvoiceModal";
import { WITHDRAWAL_STATUS, WITHDRAWAL_STATUS_COLOR } from "@/enums";
import { toast } from "sonner";

const WithdrawalRequest = () => {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 20,
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data, message, success } = await getWithdrawalRequests(
          filter.page,
          filter.limit
        );
        if (success) {
          setWithdrawalRequests(data);
        } else {
          console.error(message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filter, reload]);

  const handleUpdateWithdrawalRequest = async (id, payload) => {
    const toastId = toast.loading("Đang cập nhật", { position: "top-center" });
    try {
      const { data, success, message } = await updateWithdrawalRequest(
        id,
        payload
      );
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

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: ["user", "avatarUrl"], // Nested property access
      key: "fullName",
      render: (avatarUrl) => (
        <img
          src={avatarUrl}
          alt="avatar"
          loading="lazy"
          className="size-12 min-w-12"
        />
      ),
    },
    {
      title: "Tên",
      dataIndex: ["user", "fullName"], // Nested property access
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Badge status="success">{`${amount.toLocaleString()} VND`}</Badge>
      ), // Format amount
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge showZero color={WITHDRAWAL_STATUS_COLOR[status]}>
          {WITHDRAWAL_STATUS[status]}
        </Badge>
      ),
    },
    {
      title: "Ngày yêu cầu",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formattedDate(date), // Format date
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Tài khoản",
      key: "bankInfo",
      render: (_, record) => (
        <>
          <div>Tên chủ TK: {record.paymentInfo?.accountName}</div>
          <div>Số Tk: {record.paymentInfo?.accountNumber}</div>
          <div>Bên cung cấp: {record.paymentInfo?.provider}</div>
        </>
      ),
    },
    {
      title: "Tài khoản",
      key: "bankInfo",
      render: (_, record) => (
        <>
          {record.status !== "REJECTED" && record.status !== "COMPLETED" && (
            <div>
              <Button
                type="primary"
                onClick={() =>
                  handleUpdateWithdrawalRequest(record.id, {
                    status: "COMPLETED",
                  })
                }
              >
                Xác nhận
              </Button>
              <Button
                type="text"
                onClick={() =>
                  handleUpdateWithdrawalRequest(record.id, {
                    status: "REJECTED",
                  })
                }
              >
                Từ chối
              </Button>
            </div>
          )}
          {(record.status === "REJECTED" || record.status === "COMPLETED") && (
            <Button disabled>Đã xử lí</Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Yêu cầu rút tiền</h1>
      <Table
        columns={columns}
        dataSource={withdrawalRequests.contents} // Bind data here
        rowKey="id" // Use unique ID as the key
        loading={loading} // Show loading spinner
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: withdrawalRequests?.length, // Replace with total from API response
          onChange: (page, pageSize) => {
            setFilter({ page, limit: pageSize });
          },
        }}
      />
    </div>
  );
};

export default WithdrawalRequest;
