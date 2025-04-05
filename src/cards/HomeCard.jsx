import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";

function HomeCard({ item }) {
  const [isImgLoading, setImgLoading] = useState(true);
  const [isprofileloading, setProfileLoading] = useState(true);

  return (
    <div className="bg-transparent w-full overflow-hidden rounded-lg flex flex-col cursor-pointer text-[var(--text)]">
      <div className="w-full max-h-[15rem] aspect-video md:rounded-2xl overflow-hidden relative">
        {isImgLoading && (
          <div className="w-full h-full bg-[var(--smallcard)] animate-pulse absolute top-0 left-0 z-0" />
        )}
        <img
          src={item.coverimgUrl}
          alt="cover"
          onLoad={() => setImgLoading(false)}
          className={`w-full h-full object-fill transition-opacity duration-300 ${
            isImgLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      <div className="flex flex-col px-2">
        <div className="relative flex items-center gap-3 h-10">
        {isprofileloading && (
              <div className="w-8 h-8 bg-[var(--smallcard)] rounded-full animate-pulse absolute top-2 left-0 z-0" />
            )}
          <img
            src={item.profile}
            alt={`Profile`}
            onLoad={() => setProfileLoading(false)}
            className={`w-8 h-8 aspect-square object-cover rounded-full ${
            isprofileloading ? "opacity-0" : "opacity-100"}`}
          />
          <p className="font-medium leading-tight line-clamp-2 px-1 text-sm">
            {item.title}
          </p>
        </div>

        <div className="flex flex-col px-12 pb-2 gap-1 justify-start">
          <p className="text-sm text-gray-400 font-semibold line-clamp-1">
            -{item?.userName}
          </p>
          <p className="text-[10px] line-clamp-1 flex gap-3">
            <span>{item.views} views</span>
            <span>
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
