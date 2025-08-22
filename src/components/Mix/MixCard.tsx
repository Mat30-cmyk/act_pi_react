'use client';

import Image from 'next/image';
import {mixes} from '@/types';

interface MixCardProps {
  mix: mixes;
  isSelected: boolean;
  onSelectMix: (mix: mixes) => void;
}

export default function MixCard({ mix, isSelected, onSelectMix }: MixCardProps) {
  const imageUrl = mix.cover_image_url || '/placeholder-mix-cover.jpg';

  return (
    <div
      className={`
        flex flex-col items-center justify-start
        cursor-pointer group p-2
        max-w-[150px]
      `}
      onClick={() => onSelectMix(mix)}
    >
      <div
        className={`
          w-36 h-36
          rounded-md overflow-hidden
          shadow-lg
          transition-all duration-300 ease-in-out
          ring-2 ring-gray-600
          ${isSelected ? 'ring-4 ring-white' : ''}
          transform group-hover:scale-105
        `}
      >
        <Image
          src={imageUrl}
          alt={`Portada de ${mix.name}`}
          width={144}
          height={144}
          className="w-full h-full object-cover"
          unoptimized={true}
        />
      </div>
      <p className={`
        mt-2
        text-white text-sm font-medium
        opacity-80 group-hover:opacity-100 transition-opacity duration-300
        whitespace-nowrap overflow-hidden text-ellipsis
        max-w-full text-center
      `}>
        {mix.name}
      </p>
    </div>
  );
}