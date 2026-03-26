import React from 'react';

/**
 * A reusable skeleton shimmer box.
 * Pass w/h/rounded via className for sizing.
 */
function SkeletonBox({ className = '' }) {
  return (
    <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
  );
}

/**
 * Skeleton for a single product card (used in grid layouts)
 */
export function ProductCardSkeleton() {
  return (
    <div className="p-3 bg-white flex flex-col justify-start">
      <SkeletonBox className="aspect-square w-full mb-2 rounded-md" />
      <SkeletonBox className="h-3 w-full mb-1" />
      <SkeletonBox className="h-3 w-3/4 mb-3" />
      <SkeletonBox className="h-5 w-1/2" />
      <SkeletonBox className="h-3 w-1/3 mt-1" />
    </div>
  );
}

/**
 * Skeleton for the flash sale grid section
 */
export function FlashGridSkeleton({ count = 6 }) {
  return (
    <div className="bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-y md:divide-y-0 divide-gray-100 shadow-sm border-b border-gray-100">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the "Just Picked For You" product grid
 */
export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="bg-white grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 divide-x divide-y divide-gray-100 shadow-sm border border-gray-100">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the category grid
 */
export function CategoryGridSkeleton({ count = 8 }) {
  return (
    <div className="bg-white shadow-sm border border-gray-100">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-3 h-[160px] border-b border-r border-gray-100">
            <SkeletonBox className="w-[90px] h-[90px] mb-3 rounded-md" />
            <SkeletonBox className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
