/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

import { ChatUser } from "..";
import { FiArrowUpLeft } from "react-icons/fi";
import { Mail } from "lucide-react";
import { SidebarLoading } from "./Loading";
import useConversationStore from "@/hooks/useConversationStore";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/hooks/useUserStore";
import { toast } from "sonner";

const Index = ({ handleClickChat, isMobile, isCollapsed }) => {
  // State
  const [isLoading, setIsLoading] = useState();

  const { user, socketConnection } = useUserStore();
  const { setConversations, conversations, setCurrentConversation } =
    useConversationStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection && user) {
      setIsLoading(true);
      socketConnection.emit("sidebar", user.id);
      socketConnection.on("conversation", (data) => {
        setConversations(data);
        setCurrentConversation(data[0]);
        navigate(`/chat/${data[0]?.id}`);
        setIsLoading(false);
      });
    }
  }, [setConversations, socketConnection, user]);

  const handleDeleteConversation = (conversationId) => {
    if (socketConnection && conversationId) {
      const toastId = toast.loading("Đang xóa", { position: "top-center" });
      socketConnection.emit(
        "deleteConversation",
        conversationId,
        (response) => {
          console.log(response);
          if (response.success) {
            setConversations((prevConversations) =>
              prevConversations.filter((conv) => conv.id !== conversationId)
            );

            if (conversations.length > 1) {
              const updatedConversations = conversations.filter(
                (conv) => conv.id !== conversationId
              );
              setCurrentConversation(updatedConversations[0]);
              navigate(`/chat/${updatedConversations[0].id}`);
            } else {
              setCurrentConversation(null);
              navigate("/chat");
            }
            toast.success("Xóa thành công", { position: "top-center" });
          } else {
            console.error("Failed to delete conversation:", response.error);
            toast.error(response.error, { position: "top-center" });
          }

          toast.dismiss(toastId);
        }
      );
    }
  };

  return (
    <div className="w-full h-svh  overflow-y-auto  ">
      <div className="w-full">
        <div className="h-16 flex items-center relative ">
          {isCollapsed && <Mail size={32} className="mx-auto" />}
          {!isCollapsed && (
            <h2 className="text-xl font-bold p-4 text-slate-800">Tin nhắn</h2>
          )}
        </div>
        <div
          className={`h-full w-full overflow-x-hidden overflow-y-auto scrollbar px-6 ${
            isCollapsed && "!px-0"
          }`}
        >
          {!isLoading && conversations.length === 0 && <SidebarLoading />}
          {conversations.map((conv) => (
            <ChatUser
              handleClickChat={handleClickChat}
              conversation={conv}
              user={user}
              isCollapsed={isCollapsed}
              key={conv?.id}
              handleDeleteConversation={handleDeleteConversation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
