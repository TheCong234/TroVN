import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { BsEmojiGrin } from "react-icons/bs";
import { Button } from "../ui/button";
import { IoMdSend } from "react-icons/io";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
/* eslint-disable react/prop-types */
import { useState } from "react";

const Index = ({
  message,
  handleOnChange,
  handleSendMessage,
  setShowEmoji,
  onEmojiClick,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <form
      className="flex items-center"
      onSubmit={handleSendMessage}
    >
      <div>
        <Button variant="ghost" size="icon">
          <Paperclip className="size-5" />
          <span className="sr-only">Attach file</span>
        </Button>

        <Button variant="ghost" size="icon">
          <Mic className="size-5" />
          <span className="sr-only">Use Microphone</span>
        </Button>
      </div>
      <div className="h-16 flex-1 border flex px-4 bg-white gap-2 m-4 rounded-full">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="py-1 px-4 outline-none text-base w-full h-full"
          value={message.text}
          onChange={handleOnChange}
        />
        <div className="h-full flex items-center">
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5"
            onClick={handleSendMessage}
          >
            Gửi Tin Nhắn
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Index;
{
  /* <Popover
                content={
                    <Picker
                        locale="vi"
                        theme="light"
                        data={data}
                        onEmojiSelect={(e) => onEmojiClick(e.native)}
                    />
                }
                trigger="click"
                arrow={false}
                open={open}
                className="bg-transparent"
                placement="topRight"
                onOpenChange={handleOpenChange}
            >
                <div
                    className="mr-4 h-full flex items-center"
                    onClick={() => setShowEmoji((prev) => !prev)}
                >
                    <BsEmojiGrin size={24} color="#E51D55" />
                </div>
            </Popover> */
}
