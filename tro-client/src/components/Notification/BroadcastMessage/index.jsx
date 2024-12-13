import { MODAL_TYPE } from "@/enums";
import { useModal } from "@/hooks/useModalStore";
import { cn } from "@/lib/utils";
import { getTimeDifference } from "@/utils/helpers";
import { X } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BroadcastMessage = ({
  notification,
  handleReadNotification,
  handleDeleteNotification,
}) => {
  const { onOpen } = useModal();
  const handleOpenModal = () => {
    onOpen(MODAL_TYPE.BROADCAST_MESSAGE_MODAL, { notification });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await handleDeleteNotification(notification.id);
  };
  return (
    <Link
      className={cn(
        "p-3 border-b rounded-md relative hover:bg-slate-100 group hover:text-black transition-all",
        !notification.isRead && "bg-slate-50"
      )}
      onClick={(e) => {
        e.preventDefault();
        handleReadNotification(notification.id);
        handleOpenModal();
      }}
    >
      <span className="text-xs">
        {getTimeDifference(notification.createdAt)}
      </span>
      <h2 className="font-semibold text-base">Thông báo từ quản trị viên </h2>
      <p className="text-muted-foreground text-base">{notification.title}</p>
      {!notification.isRead && (
        <span className="absolute size-2 rounded-full bg-primary top-2 right-2 animate-pulse"></span>
      )}
      <span
        onClick={handleDelete}
        className="absolute p-2 rounded-full group-hover:block hidden hover:shadow-sm transition-all hover:bg-white right-3 top-1/2 -translate-y-1/2"
      >
        <X className="size-4" />
      </span>
    </Link>
  );
};

export default BroadcastMessage;
