import { MainFooter, MainHeader, MenuMobile } from "@/commons";
/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useLocation } from "react-router-dom";

import { Chatbot } from "@/pages";
import { getAllAmenity } from "@/apis/amenities";
import { getCurrentUser } from "@/apis/user";
import { getLocations } from "@/apis/location";
import useAmenityStore from "@/hooks/useAmenityStore";
import { useEffect, useState } from "react";
import useLocationStore from "@/hooks/useLocationStore";
import {
  getNotificationsByUser,
  getUnReadNotificationCount,
} from "@/apis/notifications";
import useUserStore from "@/hooks/useUserStore";
import {
  ArrowDown,
  ChevronDown,
  DollarSign,
  Earth,
  EarthIcon,
} from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

const TOKEN = JSON.parse(localStorage.getItem("token"));

const Index = () => {
  const { setAmenities } = useAmenityStore();
  const { setLocations } = useLocationStore();
  const [openFooter, setOpenFooter] = useState(false);
  const { user, unReadNotification } = useUserStore();
  const location = useLocation();

  const isChatPage = location.pathname.includes("/chat");
  console.log(isChatPage);

  const handleOpen = () => {
    setOpenFooter(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [amenitiesResponse, locationsResponse] = await Promise.all([
          getAllAmenity(),
          getLocations(1, 1000),
        ]);

        if (amenitiesResponse?.data) {
          setAmenities(amenitiesResponse.data);
        }

        if (locationsResponse?.data?.contents) {
          setLocations(locationsResponse.data.contents);
        }

        await getCurrentUser();
        await getNotificationsByUser();
        await getUnReadNotificationCount();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-none bg-transparent">
      <header className="h-20  bg-transparent p-0 m-0 sticky top-0 shadow-sm left-0 z-50 right-0 bg-white">
        <MainHeader />
      </header>
      <section className="min-h-svh">
        <Outlet />
        <Chatbot />
      </section>
      {!isChatPage && (
        <div className="h-10 text-sm z-50 sticky bottom-0 left-0 right-0 bg-white w-full border-t mt-4 px-20 flex justify-between items-center">
          <div>
            <div>
              © 2024 TROVN, Inc. · Quyền riêng tư · Điều khoản · Sơ đồ trang web
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <EarthIcon size={20} />
              <span>Tiếng Việt (VN)</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={20} /> VND
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleOpen}
            >
              <span>Hỗ trợ và tài nguyên</span>
              <ChevronDown />
            </div>
          </div>
        </div>
      )}
      <Drawer open={openFooter} onOpenChange={() => setOpenFooter(false)}>
        <DrawerContent>
          <MainFooter />
        </DrawerContent>
      </Drawer>
      <div className="fixed left-0 right-0 md:hidden block bottom-0 w-full h-16 bg-white z-[9999]">
        <MenuMobile />
      </div>
    </div>
  );
};

export default Index;
