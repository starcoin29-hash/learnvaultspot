'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface BookGalleryProps {
  coverImage: string;
  images: { imageUrl: string; imageType: string }[];
}

export function BookGallery({ coverImage, images }: BookGalleryProps) {
  const allImages = [
    { imageUrl: coverImage, imageType: 'cover' },
    ...images,
  ];
  const [activeImage, setActiveImage] = useState(coverImage);

  return (
    <div className="flex flex-col gap-4">
      {/* Active Main Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm border border-zinc-100/50">
        <Image
          src={activeImage}
          alt="Book preview"
          fill
          sizes="(max-width: 768px) 100vw, 450px"
          priority
          className="object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails list */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((img, idx) => {
            const isActive = img.imageUrl === activeImage;
            return (
              <button
                key={idx}
                onClick={() => setActiveImage(img.imageUrl)}
                className={`relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded-lg border bg-zinc-50 transition-all ${
                  isActive ? 'border-zinc-800 ring-2 ring-zinc-800/10' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <Image
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default BookGallery;
