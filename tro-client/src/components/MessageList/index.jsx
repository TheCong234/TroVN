import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";

import { ChatMessageList } from "../ui/chat/chat-message-list";

const MessageList = ({ messages, meId, ref }) => {
  return (
    <ChatMessageList ref={ref}>
      {messages?.map((msg) => (
        <ChatBubble
          key={msg?.id}
          variant={meId === msg?.userId ? "sent" : "received"}
          className={`rounded-md ${
            meId === msg?.userId ? "ml-auto flex-row-reverse" : "mr-auto"
          }`}
        >
          <ChatBubbleAvatar fallback={meId === msg?.userId ? "ME" : "US"} />
          <ChatBubbleMessage
            className="rounded-md"
            variant={meId === msg?.userId ? "sent" : "received"}
          >
            {msg.content}
          </ChatBubbleMessage>
        </ChatBubble>
      ))}
      {/* <ChatBubble variant="received">
          <ChatBubbleAvatar fallback="AI" />
          <ChatBubbleMessage isLoading />
        </ChatBubble> */}
    </ChatMessageList>
  );
};

export default MessageList;
