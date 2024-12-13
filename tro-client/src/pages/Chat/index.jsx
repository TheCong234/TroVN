import { useEffect, useState } from "react";

import ChatDesktop from "./ChatDesktop";
import ChatMobile from "./ChatMobile";
import MediaQuery from "react-responsive";
import { getConversations } from "@/apis/conversation";
import { message } from "antd";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { success } = await getConversations();
        setIsLoading(false);
        if (!success) {
          //   return message.error("Vui lòng đăng nhập");
        }
      } catch (error) {
        console.log(error);
        // message.error(error.message);
      }
    })();
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <MediaQuery minWidth={992}>
        <ChatDesktop isLoading={isLoading} />
      </MediaQuery>
      <MediaQuery maxWidth={991}>
        {/* <ChatMobile isLoading={isLoading} /> */}
        <div className="w-full text-xl h-full flex items-center justify-center flex-col">
          <div className="">Trang dành cho mobile đang phát triển</div>
          <div>Xin lỗi về sự bất tiện này!</div>
          <Button className="mt-4">
            <Link to="/">Tiếp tục xem phòng</Link>
          </Button>
        </div>
      </MediaQuery>
    </div>
  );
};

export default Index;
