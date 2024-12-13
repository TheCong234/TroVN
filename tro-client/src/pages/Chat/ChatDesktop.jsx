/* eslint-disable react/prop-types */
import { AmenitiesList, SidebarChat } from "@/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ListingLoading } from "./Loading/ListingLoading";
import { MODAL_TYPE } from "@/enums";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "lucide-react";
import { cn } from "@/lib/utils";
import { createAppointment } from "@/apis/appointment";
import { getListing } from "@/apis/listing";
import { toast } from "sonner";
import useConversationStore from "@/hooks/useConversationStore";
import { useModal } from "@/hooks/useModalStore";
import useUserStore from "@/hooks/useUserStore";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ChatDesktop = ({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [conversation, setConversation] = useState(null);
  const { conversations } = useConversationStore();
  const { user } = useUserStore();
  const { onOpen, onClose } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  // if (id) {
  //   toast.warning("Bạn chưa có cuộc trò chuyện nào", {
  //     position: "top-center",
  //   });
  //   navigate("/");
  // }

  useEffect(() => {
    if (conversations) {
      const conv = conversations.find((conversation) => conversation.id === id);
      setConversation(conv);
      (async () => {
        try {
          // setIsLoading(true);
          const { data } = await getListing(conv?.listing?.id);
          setListing(data);
        } catch (error) {
          console.log(error);
        } finally {
          // setIsLoading(false);
        }
      })();
    }
  }, [conversations, id]);

  const handleCreateAppointment = async (date) => {
    try {
      if (!date) {
        return toast.warning("Vui lòng chọn ngày");
      }

      if (date < new Date()) {
        return toast.warning("Vui lòng chọn ngày trong tương lai.");
      }

      if (!listing) {
        return toast.warning("Không tìm thấy phòng!");
      }

      const { data } = await createAppointment({
        listingId: listing.id,
        appointmentDate: date,
      });

      if (data.success) {
        onClose();
        setConversation((prev) => ({
          ...prev,
          hasAppointment: true,
        }));
        return toast.success(data.message);
      }
      return toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const onOpenModal = () => {
    onOpen(MODAL_TYPE.CREATE_APPOINTMENT_MODAL, { handleCreateAppointment });
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="h-screen items-stretch fixed top-20 "
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 24}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed &&
            "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
        )}
      >
        <SidebarChat isMobile={isMobile} isCollapsed={isCollapsed} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
        <Outlet />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 22}
        maxSize={isMobile ? 0 : 22}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            true
          )}`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            false
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[0px] transition-all duration-300 ease-in-out"
        )}
      >
        {/* {!isLoading && ( */}
        <Card className="border-none p-4 pt-0">
          <CardHeader>
            <CardTitle>Thông tin phòng</CardTitle>
            <CardDescription>
              Thông tin phòng liên quan mà bạn đang trao đổi
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <ScrollArea>
              <div className="relative">
                <LazyLoadImage
                  effect="blur"
                  src={listing?.images[0].url}
                  className="aspect-square object-cover size-30 rounded-sm"
                />
                <Badge
                  variant="secondary"
                  className="absolute z-10 font-semibold top-0 left-0 m-2 py-1 px-2 rounded-md shadow-sm"
                >
                  {listing?.isPublish ? "Còn phòng" : "Hết phòng"}
                </Badge>
              </div>
              <div className="mt-4">
                <Label className="text-xl">{listing?.title}</Label>
                <p className="text-muted-foreground mt-2">{listing?.address}</p>
              </div>
              {listing?.user?.id !== user?.id && (
                <div>
                  {conversation?.hasAppointment ? (
                    <Button variant="secondary" className="w-full mt-2">
                      Bạn đã đặt lịch hẹn
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full mt-2"
                      onClick={onOpenModal}
                    >
                      Đặt lịch hẹn
                    </Button>
                  )}
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-lg mb-2 font-semibold">Tiện ích</h3>
                <AmenitiesList listingAmenities={listing?.listingAmenities} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        {/* )}
        {isLoading && <ListingLoading />} */}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatDesktop;
