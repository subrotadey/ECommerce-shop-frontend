import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = () => {
  return (
    <SkeletonTheme baseColor="rgba(209, 213, 219, 0.3)" highlightColor="rgba(243, 244, 246, 0.1)">
      <div className="w-11/12 mx-auto mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="group relative bg-white p-3 rounded-xl shadow-sm border border-gray-200"
          >
            {/* Wishlist button placeholder */}
            {/* <div className="absolute top-3 right-3 z-10">
              <Skeleton circle width={32} height={32} />
            </div> */}

            {/* Product Image */}
            <Skeleton height={320} borderRadius={10} />

            {/* Category text */}
            <div className="mt-2">
              <Skeleton width={120} height={14} />
            </div>

            {/* Product Name */}
            <div className="mt-3">
              <Skeleton width="90%" height={18} />
            </div>

            {/* Pricing */}
            <div className="mt-2 flex gap-3">
              <Skeleton width={50} height={16} />
              <Skeleton width={50} height={16} />
            </div>

            {/* Buttons: View Details + Add to Bag */}
            <div className="mt-4">
              <Skeleton height={40} borderRadius={8} />
            </div>
            <div className="mt-3">
              <Skeleton height={40} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default Loading;
