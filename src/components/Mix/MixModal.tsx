'use client';

import React from 'react';
import { mixes, Song } from '@/types';
import Image from 'next/image';

interface MixModalProps {
  mix: mixes;
  onClose: () => void;
}

export default function MixModal({ mix, onClose }: MixModalProps) {
  const imageUrl = mix.cover_image_url || '/placeholder-mix-cover.jpg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <Image
            src={imageUrl}
            alt={`Portada de ${mix.name}`}
            width={192}
            height={192}
            className="w-48 h-48 rounded-md object-cover mb-4"
            unoptimized={true}
          />
          <h2 className="text-3xl font-bold text-white mb-2">{mix.name}</h2>

          <h3 className="text-xl font-semibold text-white mb-2">Canciones del Mix:</h3>
          <div className="w-full max-h-60 overflow-y-auto custom-scrollbar-hide">
            <ul className="list-disc list-inside text-gray-400 w-full text-center">
              {mix.songs && mix.songs.length > 0 ? (
                mix.songs.map((song: Song) => ( 
                  <li key={song.id} className="text-lg">
                    {song.title}
                  </li>
                ))
              ) : (
                <li>No hay canciones asociadas a este mix.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}