import React from "react";

function SkeletonPage() {
  return (
    <div className="animate-pulse p-4 space-y-6">

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gray-300 rounded-lg h-40 flex flex-col space-y-2"
          >
            <div className="h-20 bg-gray-400 rounded-lg"></div>
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="h-4 bg-gray-400 rounded w-1/2"></div>
          </div>
        ))}
      </div>

    </div>
  );
}


export default SkeletonPage;
