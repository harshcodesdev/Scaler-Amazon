import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="max-w-[1500px] mx-auto bg-[#EAEDED] min-h-screen">
      <div className="relative z-10 px-4 pt-24 pb-8 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
