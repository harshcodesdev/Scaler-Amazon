"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryGridItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface CategoryGridCardProps {
  title: string;
  items: CategoryGridItem[];
  category: string;
}

export default function CategoryGridCard({ title, items, category }: CategoryGridCardProps) {
  const link = `/?category=${encodeURIComponent(category)}`;

  return (
    <div className="bg-white p-5 flex flex-col shadow-sm border border-gray-100 min-h-[420px]">
      <h2 className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
        {title}
      </h2>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 flex-grow">
        {items.map((item) => (
          <Link 
            key={item.id} 
            href={link}
            className="flex flex-col gap-1 group cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-sm">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill 
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-[11px] text-gray-700 h-8 line-clamp-2 leading-tight">
              {item.title}
            </span>
          </Link>
        ))}
      </div>
      
      <Link 
        href={link} 
        className="text-[13px] text-[#007185] hover:underline hover:text-[#C45500] mt-4 font-medium"
      >
        See more
      </Link>
    </div>
  );
}
