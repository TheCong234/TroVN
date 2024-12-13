/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Flag,
  Home,
  LayoutDashboard,
  LineChart,
  Package,
  Package2,
  PackageOpen,
  PanelLeft,
  Receipt,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  Siren,
  Timer,
  Users2,
  UsersRound,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMenu } from "@/components";
import { getBalance, getCurrentUser } from "@/apis/user";
import useUserStore from "@/hooks/useUserStore";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModalStore";
import { MODAL_TYPE } from "@/enums";
import { isEmpty } from "lodash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatCurrency } from "@/utils/helpers";

const hostNavbar = [
  {
    id: 1,
    label: "Bảng điều khiển",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/host/v2",
  },
  {
    id: 2,
    label: "Phòng cho thuê",
    icon: <Home className="h-5 w-5" />,
    href: "#",
    children: [
      {
        id: 2.1,
        label: "Thêm phòng",
        href: "/host/v2/listing/create",
      },
      {
        id: 2.2,
        label: "Danh sách phòng",
        href: "/host/v2/listing/list",
      },
    ],
  },
  {
    id: 4,
    label: "Gói quảng bá",
    icon: <PackageOpen className="h-5 w-5" />,
    href: "#",
    children: [
      {
        id: 4.1,
        label: "Tất cả gói",
        href: "/host/v2/ads-package-list",
      },
      {
        id: 4.2,
        label: "Gói đã mua",
        href: "/host/v2/ads-package",
      },
    ],
  },
  {
    id: 5,
    label: "Lịch xem phòng",
    icon: <Timer className="h-5 w-5" />,
    href: "/host/v2/appointments",
  },
  {
    id: 6,
    label: "Đang cho thuê",
    icon: <UsersRound className="h-5 w-5" />,
    href: "/host/v2/rented-room",
  },
  {
    id: 7,
    label: "Hóa đơn",
    icon: <Receipt className="h-5 w-5" />,
    href: "#",
    children: [
      {
        id: 7.1,
        label: "Danh sách hóa đơn",
        href: "/host/v2/invoice-list",
      },
      {
        id: 7.2,
        label: "Thêm hóa đơn",
        href: "/host/v2/invoice-create",
      },
    ],
  },
  {
    id: 8,
    label: "Yêu cầu rút tiền",
    icon: <Banknote className="h-5 w-5" />,
    href: "/host/v2/withdrawal-request",
  },
  // {
  //   id: 9,
  //   label: "Khiếu nại",
  //   icon: <Flag className="h-5 w-5" />,
  //   href: "/host/v2/",
  // },
  // {
  //   id: 10,
  //   label: "Trợ giúp",
  //   icon: <CircleHelp className="h-5 w-5" />,
  //   href: "/host/v2/",
  // },
  // {
  //   id: 6,
  //   label: "Chính sách",
  //   icon: <Siren className="h-5 w-5" />,
  //   href: "/host/v2/",
  // },
];

// eslint-disable-next-line react/prop-types
const NavbarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = location.pathname === item.href;

  return (
    <div className="w-full">
      <Tooltip>
        <div
          className={`flex lg:justify-between justify-center items-center lg:px-4 ${
            isActive ? "bg-primary rounded-l-xl" : ""
          } `}
        >
          <div>
            <TooltipTrigger asChild>
              <Link
                to={item.href}
                className={`flex h-9 lg:w-full w-9 gap-2 items-center lg:justify-start justify-center rounded-lg transition-colors  md:h-8 md:w-8 ${
                  isActive ? "text-white" : ""
                }`}
                onClick={() => item.children && setIsOpen(!isOpen)}
              >
                {item.icon}
                <span className="not-sr-only max-md:hidden">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </div>
          {item.children && (
            <div className="max-md:hidden">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          )}
        </div>
      </Tooltip>
      <AnimatePresence>
        {item.children && isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-8 flex flex-col gap-1 overflow-hidden"
          >
            {item.children.map((child) => (
              <NavbarItem key={child.id} item={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => {
  const { user, balance } = useUserStore();
  const { onOpen, onClose } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data, success, message } = await getCurrentUser();

        if (success) {
          if (!data?.isVerify) {
            return navigate("/");
          }
          await getBalance();

          if (
            isEmpty(data.fullName.split(" ").join("")) ||
            isEmpty(data.phoneNumber.split(" ").join(""))
          ) {
            onOpen(MODAL_TYPE.UPDATE_HOST_INFO_MODAL, { user: data });
          }
        }
      } catch (error) {
        console.log(error);
        if (error?.status === 401) navigate("/login");
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden lg:w-[220px] pl-2 w-14 flex-col border-r bg-muted sm:flex">
        <nav className="flex flex-col lg:items-start items-center gap-4  pb-4">
          <Link to="/" className="flex items-center justify-center w-full">
            <LazyLoadImage src="/logo.svg" className="size-16" />
          </Link>

          {hostNavbar.map((item) => (
            <NavbarItem key={item.id} item={item} />
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 lg:w-full w-9 gap-2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="not-sr-only ">Cài đặt</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Cài đặt</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col  sm:pl-[55px] lg:pl-[220px]">
        <header className="sticky sm:py-2 border-b top-0 z-30 flex h-14 items-center gap-4 mb-2 bg-background px-4 sm:static sm:h-auto sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs"></SheetContent>
          </Sheet>

          <h2 className="text-xl">
            <strong>Xin chào! </strong>
            {user?.fullName || user?.username}
          </h2>

          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <UserMenu />
        </header>
        <ScrollArea>
          <main className="grid flex-1 min-h-[80svh] items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Index;
