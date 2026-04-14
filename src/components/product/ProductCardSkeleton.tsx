/**
 * Skeleton placeholder matching the ProductCard layout.
 * Shown during product grid loading instead of a spinner.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white p-5 rounded-none sm:rounded-sm border border-gray-200 animate-pulse">
      {/* Category badge placeholder */}
      <div className="absolute top-2 right-2 h-3 w-16 bg-gray-200 rounded" />

      {/* Image placeholder */}
      <div className="w-full aspect-square bg-gray-200 rounded mb-3" />

      {/* Title placeholder */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

      {/* Stars placeholder */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />

      {/* Price placeholder */}
      <div className="h-7 bg-gray-200 rounded w-2/3 mb-3" />

      {/* Prime placeholder */}
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />

      {/* Button placeholder */}
      <div className="h-9 bg-gray-200 rounded-full w-full mt-auto" />
    </div>
  );
}
