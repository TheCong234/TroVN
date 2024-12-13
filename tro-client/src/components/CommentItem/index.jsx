import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { BsThreeDots } from "react-icons/bs";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Rating } from "..";
import moment from "moment/moment";
import { LazyLoadImage } from "react-lazy-load-image-component";

/* eslint-disable react/prop-types */
const Index = ({ comment, user, loading, handleRemoveReview }) => {
  return (
    <div className="py-4 group">
      <div className="transition-all flex justify-between">
        <Link to={`/user/new-info/${comment.user.id}`} className="flex gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-secondary shadow-sm border-2">
            <LazyLoadImage
              effect="blur"
              className="w-full h-full aspect-square object-cover "
              src={comment.user.avatarUrl}
              alt={comment.user.fullName}
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">
              {comment.user.fullName || "No name"}
            </h2>
            <p className="text-xs">
              {moment(comment.createdAt).endOf("day").fromNow()}
            </p>
          </div>
        </Link>
        {comment.user?.id === user?.id && (
          <div className="group-hover:block transition-all hidden cursor-pointer text-lg hover:color-[#50C878]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BsThreeDots />
                </TooltipTrigger>
                <TooltipContent>
                  <Button
                    type="secondary"
                    loading={loading}
                    onClick={() => handleRemoveReview(comment.id)}
                  >
                    Xóa
                  </Button>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <div className="mt-2">
        <Rating disabled totalStars={comment.rating} />
        <p className="mt-2">{`${comment.content}`}</p>
      </div>
    </div>
  );
};

export default Index;
