import React from "react";
import { formatDistanceToNow } from "date-fns";

function HomeCard({ item }) {
  return (
    <div
      className="bg-transparent   w-full overflow-hidden rounded-lg flex flex-col cursor-pointer text-[var(--text)] "
    >
      <img
        src={item.coverimgUrl}
        className="w-full max-h-[15rem] aspect-video  object-fill md:rounded-2xl "
      />
      <div className="flex flex-col px-2  ">
        <div className="flex items-center gap-3 h-10">
          <img
            src={item.createdBy?.profile}
            alt={`Profile `}
            className="w-8 h-8 aspect-square object-cover rounded-full "
          />
          <p className=" font-medium leading-tight line-clamp-2  px-1 text-sm ">
            {item.title}
          </p>
        </div>
 
        <div className="flex flex-col px-12 pb-2 gap-1 justify-start">
          <p className="text-sm text-gray-400 font-semibold line-clamp-1 ">
            -{item.createdBy?.userName}
          </p>
          <p className="text-xs line-clamp-1 flex gap-3   ">
            <span>{item.views} views</span>
            <span>{formatDistanceToNow(new Date(item.createdAt),{ addSuffix: true }) }</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
