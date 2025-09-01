import React from 'react';
import Image from 'next/image';
import { Artist } from '@/types';

interface ArtistIconProps {
  artist: Artist;
  isSelected?: boolean;
  onSelectArtist: (artist: Artist) => void;
}

const ArtistIcon: React.FC<ArtistIconProps> = ({ artist, isSelected, onSelectArtist }) => {
  return (
    <div
      onClick={() => onSelectArtist(artist)}
      className={`flex flex-col items-center cursor-pointer transition-transform duration-200 transform hover:scale-105 ${isSelected ? 'scale-105 ring-2 ring-blue-500' : ''}`}
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden">
        <Image
          src={artist.image}
          alt={artist.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <p className="mt-2 text-sm text-center text-white">{artist.name}</p>
    </div>
  );
};

export default ArtistIcon;