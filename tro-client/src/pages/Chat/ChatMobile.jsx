import { SidebarChat } from "@/components";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const ChatMobile = () => {
  const navigate = useNavigate();
  const handleClickChat = (id) => {
    navigate(`/message/${id}`);
  };

  return (
    <div
      style={{
        height: "calc(100vh - 240px)",
      }}
      className="overflow-hidden"
    >
      <SidebarChat handleClickChat={handleClickChat} />
    </div>
  );
};

export default ChatMobile;
