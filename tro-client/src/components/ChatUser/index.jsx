/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate, useParams } from "react-router-dom";

import { BiCheckShield } from "react-icons/bi";
import { ROLE } from "@/constants/role";
import { cn } from "@/utils/helpers";
import { getTimeDifference } from "@/utils/helpers";
import useConversationStore from "@/hooks/useConversationStore";
import { Ellipsis, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LazyLoadImage } from "react-lazy-load-image-component";

const Index = ({
  conversation,
  user,
  handleClickChat,
  isCollapsed,
  handleDeleteConversation,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCurrentConversation } = useConversationStore();

  const handleClick = (e) => {
    e.preventDefault();
    if (!handleClickChat) {
      setCurrentConversation(conversation);
      navigate(`/chat/${conversation?.id}`);
    } else {
      handleClickChat(conversation?.id);
    }
  };

  return (
    <div
      className={cn(
        `flex items-center py-4 px-2 border relative group border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer ${
          isCollapsed && "px-0 py-0 justify-center"
        }`,
        conversation.userDetails?.id === id ? "bg-slate-100" : ""
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={cn(
            "flex items-center  gap-2 ",
            isCollapsed ? "justify-center mx-auto" : ""
          )}
        >
          <div className="relative">
            <LazyLoadImage
              effect="blur"
              src={conversation?.listing?.images[0]?.url}
              className="size-20 min-w-20 rounded-md"
              alt="image"
            />
            <Avatar className="size-10 shadow-md  absolute -right-2 shadow-sm -bottom-2 bg-white ">
              <AvatarImage
                className="rounded-full"
                src={conversation?.userDetails?.avatarUrl}
                alt={conversation?.userDetails?.username}
              />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
          </div>
          {!isCollapsed && (
            <div>
              <h3 className="text-ellipsis line-clamp-1 flex gap-2 font-semibold text-lg">
                {conversation?.userDetails?.fullName ||
                  conversation?.userDetails?.username}
                {conversation?.userDetails?.role === ROLE.ADMIN && (
                  <BiCheckShield size={20} color="#0866FF" />
                )}
              </h3>
              <div className="text-slate-500 text-xs flex flex-col justify-center gap-1">
                <p>Phòng: {conversation?.listing?.title?.slice(0, 30)}...</p>
                <p className="text-left leading-5">
                  {user?.id == conversation?.lastMsg?.userId
                    ? `Tôi: ${conversation?.lastMsg?.content}`
                    : conversation?.lastMsg?.content}
                </p>
              </div>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <div className="text-[10px] text-nowrap">
            {getTimeDifference(conversation?.updatedAt)}
          </div>
        )}
      </div>
      <div className="group-hover:block hidden absolute top-2 right-2">
        <Tooltip>
          <TooltipTrigger>
            <Ellipsis />
          </TooltipTrigger>
          <TooltipContent className="py-2">
            <div
              className="flex gap-1 hover:bg-muted px-2 py-1 rounded-md"
              onClick={() => handleDeleteConversation(conversation?.id)}
            >
              <Trash2 size={18} />
              <span>Xóa cuộc trò chuyện</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Index;
