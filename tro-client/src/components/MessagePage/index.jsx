import { FaAngleLeft, FaDotCircle } from "react-icons/fa";
import { InputChat, MessageItem } from "..";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "antd";
import { BiCheckShield } from "react-icons/bi";
import { LuBadgeCheck } from "react-icons/lu";
import { ROLE } from "@/constants/role";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/utils/helpers";
import { toast } from "sonner";
import useConversationStore from "@/hooks/useConversationStore";
import useUserStore from "@/hooks/useUserStore";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = () => {
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [dataUser, setDataUser] = useState({
    username: "",
    email: "",
    avatarUrl: "",
    online: false,
    id: "",
    fullName: "",
    role: "",
  });

  const [message, setMessage] = useState({
    text: "",
  });

  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const bottomRef = useRef(null);

  const { id } = useParams();
  const { user, socketConnection } = useUserStore();
  const { conversations } = useConversationStore();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("messagePage", id);

      const handleMessageUser = (data) => {
        setDataUser(data);
      };

      const handleMessage = (data) => {
        // const toastId = toast.loading("Đang tải...");
        if (data.conversationId === id) {
          setAllMessages(data.messages);
          socketConnection.emit("seen", id);
          // toast.dismiss(toastId);
        }
      };

      // const handleTyping = () => {
      //   setOtherUserTyping(true);
      // };

      // const handleStopTyping = () => {
      //   setOtherUserTyping(false);
      // };

      socketConnection.on("messageUser", handleMessageUser);
      socketConnection.on("message", handleMessage);
      // socketConnection.on("typing", handleTyping);
      // socketConnection.on("stopTyping", handleStopTyping);

      return () => {
        socketConnection.off("messageUser", handleMessageUser);
        socketConnection.off("message", handleMessage);
        // socketConnection.off("typing", handleTyping);
        // socketConnection.off("stopTyping", handleStopTyping);
      };
    }
  }, [socketConnection, id, user]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({
      ...prev,
      text: value,
    }));
    if (socketConnection) {
      if (!isTyping) {
        setIsTyping(true);
        // socketConnection.emit("typing", id);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        // socketConnection.emit("stopTyping", id);
      }, 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text) {
      const conv = conversations?.find((item) => item.id === id);
      console.log(conv);

      if (socketConnection) {
        socketConnection.emit("newMessage", {
          sender: user?.id,
          senderName: user?.fullName ?? user?.username,
          receiver: dataUser?.id,
          text: message.text,
          userId: user?.id,
          listingId: conv?.listing?.id,
        });
        setMessage({
          text: "",
        });
        setIsTyping(false);
        // socketConnection.emit("stopTyping", id);
      }
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => ({
      text: prevMessage.text + emojiObject,
    }));
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessages, otherUserTyping]);

  const { pathname } = useLocation();
  return (
    <div className={cn("flex-1 relative")}>
      <header className="h-16 sticky top-0 bg-white flex justify-between border-b items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/chat"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar size={48} src={dataUser?.avatarUrl} />
          </div>
          <div className="flex gap-1 flex-col justify-between">
            <Link to={`/user/new-info/${dataUser?.id}`}>
              <h3 className="font-semibold text-xl flex items-center gap-1 my-0 text-ellipsis line-clamp-1">
                {dataUser?.fullName || dataUser?.username}
                {dataUser?.role === ROLE.ADMIN && (
                  <BiCheckShield size={22} color="#0866FF" />
                )}
              </h3>
            </Link>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <div className="text-green-500 flex gap-1 items-center">
                  <FaDotCircle size={10} />
                  <span>online</span>
                </div>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
      </header>
      <ScrollArea className="h-screen p-4 pb-[15rem]">
        <div className="px-2" ref={currentMessage}>
          {allMessages.map((msg) => (
            <MessageItem message={msg} meId={user?.id} key={msg?.id} />
          ))}
          {otherUserTyping && (
            <div className="">
              <LazyLoadImage
                effect="blur"
                className=" w-20 h-10 object-cover rounded-t-xl border rounded-br-xl  shadow-lg"
                src="https://assets-v2.lottiefiles.com/a/ebd78ab6-1177-11ee-850f-cb40fdafcf3e/PAX68whfkT.gif"
                alt="typing..."
              />
            </div>
          )}
          <div ref={bottomRef}></div>
        </div>
      </ScrollArea>
      <div className="bg-white border-t border-gray-300 absolute bottom-36 left-0 right-0 z-50">
        <InputChat
          message={message}
          handleOnChange={handleOnChange}
          handleSendMessage={handleSendMessage}
          onEmojiClick={onEmojiClick}
        />
      </div>
    </div>
  );
};

export default Index;
