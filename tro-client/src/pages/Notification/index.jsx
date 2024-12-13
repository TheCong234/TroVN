import {
  deleteNotification,
  getNotificationsByUser,
  updateNotification,
} from "@/apis/notifications";
import AcceptCanceledRentedRoom from "@/components/Notification/AcceptCanceledRentedRoom";
import BroadcastMessage from "@/components/Notification/BroadcastMessage";
import CreateReview from "@/components/Notification/CreateReview";
import InvoiceCreateNotification from "@/components/Notification/InvoiceCreateNotification";
import RentedRoomCanceled from "@/components/Notification/RentedRoomCanceled";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { NOTIFICATION_TYPE } from "@/enums";
import useNotificationStore from "@/hooks/useNotificationStore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Notification = () => {
  const { notifications } = useNotificationStore();

  const handleReadNotification = async (id) => {
    try {
      const { data, success, message } = await updateNotification(id, {
        isRead: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteNotification = async (id) => {
    const toastId = toast.loading("Đang xoá", { position: "top-center" });
    try {
      const { data, success, message } = await deleteNotification(id);
      if (success) {
        toast.success(message, { position: "top-center" });
        await getNotificationsByUser();
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="container md:w-[640px]">
      <div>
        <h1 className="font-semibold text-3xl my-10">Thông báo</h1>
        <div className="grid grid-cols-1 gap-y-1">
          {notifications?.contents?.map((notification) => (
            <>
              {notification.type === NOTIFICATION_TYPE.CREATE_INVOICE && (
                <InvoiceCreateNotification
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
              {notification.type === NOTIFICATION_TYPE.CANCELED_RENTED_ROOM && (
                <RentedRoomCanceled
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
              {notification.type ===
                NOTIFICATION_TYPE.ACCEPT_CANCELED_RENTED_ROOM && (
                <AcceptCanceledRentedRoom
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
              {notification.type ===
                NOTIFICATION_TYPE.APPOINTMENT_SCHEDULED && (
                <AcceptCanceledRentedRoom
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
              {notification.type === NOTIFICATION_TYPE.REVIEW && (
                <CreateReview
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
              {notification.type === NOTIFICATION_TYPE.BROADCAST_MESSAGE && (
                <BroadcastMessage
                  notification={notification}
                  handleReadNotification={handleReadNotification}
                  handleDeleteNotification={handleDeleteNotification}
                />
              )}
            </>
          ))}
          {notifications?.totalElement === 0 && (
            <div className="text-md">Bạn không có thư mới</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
