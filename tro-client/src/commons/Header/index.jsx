import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { Flex, Input, Modal, Tooltip, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SearchInput, UserMenu } from "@/components";
import { getEmailOtp, getVerifyEmailOtp } from "@/apis/user";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { LogoSvg } from "@/components/Icons";
import { MODAL_TYPE } from "@/enums";
import { getSearchHistories } from "@/apis/searchHistory";
import { toast } from "sonner";
import useConversationStore from "@/hooks/useConversationStore";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { Bell, Heart, MessageCircle } from "lucide-react";
import useNotificationStore from "@/hooks/useNotificationStore";

const Index = () => {
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { unreadMessagesCount } = useConversationStore();
  const { notifications } = useNotificationStore();

  const { onOpen } = useModal();

  const { user, otp, setOtp } = useUserStore();

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const { data } = await getSearchHistories();
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [user]);

  const handleClickHosting = () => {
    if (!user) {
      return toast("Vui lòng đăng nhập", {
        description: "Đăng nhập để sử dụng tính năng náy!",
        action: {
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        },
      });
    }

    if (user.isVerify) {
      return navigate("/host/v2");
    }

    if (!user.isVerify) {
      onAction(MODAL_TYPE.VERIFY_MODAL);
    }
  };

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const { success } = await getVerifyEmailOtp();
      if (success) {
        navigate("/host");
        console.log("hót");

        toast("Xác minh thành công", {
          description: "Xác minh tài khoản thành công!",
        });
        setConfirmLoading(false);
        return;
      }
      setConfirmLoading(false);
      toast("Xác minh không thành công", {
        description: "Xác minh tài khoản không thành công!",
      });
    } catch (error) {
      setConfirmLoading(false);
      console.log(error);
      toast("Xác minh không thành công", {
        description: "Xác minh tài khoản không thành công!",
      });
    }
  };

  const handleSendEmailOtp = async () => {
    try {
      const { success } = await getEmailOtp();
      if (success) {
        message.success("Đã gửi mail thành công");
        return;
      }
      message.error("Gửi mail thât bại");
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const handleNavigate = (url) => {
    navigate(url);
  };

  const onAction = (action) => {
    onOpen(action, { handleSendEmailOtp, user, handleOk });
  };

  return (
    <div className="h-full leading-none grid grid-cols-3 items-center justify-center container">
      <div className="col-span-1 md:gap-9 gap-2 items-center md:block hidden">
        <div className="font-bold text-2xl tracking-wider w-fit">
          <Link to="/">
            <LogoSvg className="md:size-20 size-16" />
          </Link>
        </div>
      </div>
      <div className="md:col-span-1 col-span-3 max-md:px-8">
        <SearchInput />
      </div>
      <div className="col-span-1 gap-6  justify-end items-center md:flex hidden">
        <Button variant="ghost" onClick={handleClickHosting}>
          Trở thành chủ nhà
        </Button>
        <div className="md:flex hidden gap-6 justify-center items-center">
          <Tooltip placement="bottom" title="Danh sách yêu thích">
            <div className="relative">
              <Bell
                size={20}
                className="cursor-pointer"
                onClick={() => handleNavigate("notification")}
              />
              {notifications?.unReadCount > 0 && (
                <div className="absolute -top-2 bg-red-600 w-4 h-4 flex items-center justify-center text-white font-semibold -right-2 text-[10px] rounded-full">
                  {notifications?.unReadCount}
                </div>
              )}
            </div>
          </Tooltip>
          <Tooltip placement="bottom" title="Danh sách yêu thích">
            <Heart
              size={20}
              className="cursor-pointer"
              onClick={() => handleNavigate("favorite")}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="Trò chuyện">
            <div className="relative">
              <MessageCircle
                size={20}
                className="cursor-pointer"
                onClick={() => handleNavigate("chat")}
              />
              {unreadMessagesCount > 0 && (
                <div className="absolute -top-2 bg-red-600 w-4 h-4 flex items-center justify-center text-white font-semibold -right-2 text-[10px] rounded-full">
                  {unreadMessagesCount}
                </div>
              )}
            </div>
          </Tooltip>
        </div>
        <UserMenu />
      </div>
    </div>
  );
};

export default Index;
