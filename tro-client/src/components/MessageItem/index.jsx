import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
/* eslint-disable react/prop-types */
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import moment from "moment";
import reactStringReplace from "react-string-replace";

const Index = ({ message, meId }) => {
  const formatMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return reactStringReplace(message, urlRegex, (match, i) => (
      <span key={i}>
        <a
          href={match}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {match}
        </a>
        <LinkPreview
          url={match}
          width="300px"
          fallbackImageSrc={match}
        />
      </span>
    ));
  };
  return (
    <div>
      <p
        className={`w-fit text-[12px] font-medium flex items-center gap-2 ${
          meId === message?.userId ? "ml-auto" : "mr-auto"
        }`}
      >
        <span>
          {message?.isSeen && (
            <p>
              <IoCheckmarkDoneOutline />
            </p>
          )}
        </span>
      </p>
      <div
        key={message.id}
        className={`p-3 border rounded-t-xl  w-fit h-auto max-w-[400px] shadow-md md:max-w-sm lg:max-w-4xl ${
          meId === message?.userId
            ? "ml-auto bg-primary rounded-bl-xl text-primary-foreground"
            : "bg-secondary text-secondary-foreground rounded-br-xl"
        }`}
      >
        <div className="">{formatMessage(message.content)}</div>
      </div>
    </div>
  );
};

export default Index;
