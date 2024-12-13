import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FiLogIn, FiLogOut } from "react-icons/fi";

import { BiMenu } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import { Link } from "react-router-dom";
import { ROLE } from "@/constants/role";
import { RiAdminLine } from "react-icons/ri";
import useUserStore from "@/hooks/useUserStore";
import {
  AlignJustify,
  CalendarRange,
  House,
  LogIn,
  LogOut,
  Receipt,
  Settings,
  User,
  UserCog,
} from "lucide-react";
import { Badge } from "../ui/badge";

const Index = () => {
  const { user, unReadNotification } = useUserStore();

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
        <div className="flex gap-1 py-1 px-2 border rounded-3xl items-center">
          <AlignJustify size={18} />
          <Avatar>
            <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="md:w-[200px]">
        <DropdownMenuLabel>Tùy chọn tài khoản</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && (
          <>
            <DropdownMenuItem>
              <Link
                className="flex gap-2 items-center"
                to={`/user/new-info/${user?.id}`}
              >
                <User size={18} />
                <div>Thông tin cá nhân</div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex relative gap-2 w-full items-center"
                to={`/appointment`}
              >
                <CalendarRange size={18} />
                <div>Lịch xem phòng</div>
                {unReadNotification?.appointmentCount > 0 && (
                  <span className="absolute right-0 size-4 text-[10px] bg-primary rounded-full text-white font-semibold flex items-center justify-center ">
                    {unReadNotification?.appointmentCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex relative gap-2 w-full items-center"
                to={`/rented-room/room`}
              >
                <House size={18} />
                <div>Thuê phòng</div>
                {unReadNotification?.rentedRoomCount > 0 && (
                  <span className="absolute right-0 size-4 text-[10px] bg-primary rounded-full text-white font-semibold flex items-center justify-center ">
                    {unReadNotification?.rentedRoomCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex relative gap-2 w-full items-center"
                to={`/invoices`}
              >
                <Receipt size={18} />
                <div>Hóa đơn</div>
                {unReadNotification?.orderItemCount > 0 && (
                  <span className="absolute right-0 size-4 text-[10px] bg-primary rounded-full text-white font-semibold flex items-center justify-center ">
                    {unReadNotification?.orderItemCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className="flex gap-2 items-center"
                to={`/account-settings`}
              >
                <Settings size={18} />
                <div>Tài khoản</div>
              </Link>
            </DropdownMenuItem>
            {user?.role === ROLE.ADMIN && (
              <DropdownMenuItem>
                <Link className="flex gap-2 items-center" to={`/admin`}>
                  <UserCog size={18} />
                  <div>Trang quản lý</div>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Link className="flex gap-2 items-center" to={`/logout`}>
                <LogOut size={18} />
                <div>Đăng xuất</div>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {!user && (
          <DropdownMenuItem>
            <Link className="flex gap-2 items-center" to={`/login`}>
              <LogIn size={18} />
              <div>Đăng ký / Đăng nhập</div>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Index;
