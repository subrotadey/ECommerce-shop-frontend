import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SkeletonTheme baseColor="rgba(209, 213, 219, 0.3)" highlightColor="rgba(243, 244, 246, 0.1)">
      <div className="w-9/12 min-h-screen bg-white px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-xl shadow-sm border border-gray-200"
              >
                {/* Thumbnail */}
                <Skeleton height={180} borderRadius={12} />

                {/* Title */}
                <div className="mt-4">
                  <Skeleton height={20} width="90%" />
                </div>

                {/* Channel Info */}
                <div className="mt-3 flex items-start gap-3">
                  <Skeleton circle height={40} width={40} />
                  <div className="flex-1">
                    <Skeleton height={14} width="70%" />
                    <Skeleton height={12} width="50%" />
                  </div>
                </div>
              </div>
            ))
          : (
            <div className="col-span-full text-center py-20 text-2xl font-semibold text-gray-700">
              ✅ Content Loaded Successfully!
            </div>
          )}
      </div>
    </SkeletonTheme>
  );
};

export default Loading;
