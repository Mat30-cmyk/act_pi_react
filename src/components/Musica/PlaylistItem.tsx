'use client';

import React from 'react';
import { Song } from '@/types';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';
import Image from 'next/image';

interface PlaylistItemProps {
  song: Song;
  onSelectSong: (song: Song) => void;
}

export default function PlaylistItem({ song, onSelectSong }: PlaylistItemProps) {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();

  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      }
    } else {
      playSong(song, []);
    }
    onSelectSong(song);
  };

  const isCurrent = currentSong?.id === song.id;

  return (
    <div
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200
        ${isCurrent ? 'bg-purple-700 hover:bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'}
        ${isCurrent && isPlaying ? 'border-l-4 border-purple-400' : ''}`}
      onClick={handlePlayClick}
    >
      <div className="flex-shrink-0 mr-4">
        {song.cover_image_url ? (
          <Image
            src={song.cover_image_url}
            alt={song.title}
            width={48}
            height={48}
            className="rounded object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded text-gray-400 text-xs">
            No Img
          </div>
        )}
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-semibold text-white truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.name}</p>
      </div>
      <div className="flex-shrink-0 ml-4">
        {isCurrent ? (
          isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM10.445 7.025A1 1 0 009 8v4a1 1 0 001.445.975l3.268-2a1 1 0 000-1.95l-3.268-2z"
                clipRule="evenodd"
              />
            </svg> 
          )
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 group-hover:text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM10.445 7.025A1 1 0 009 8v4a1 1 0 001.445.975l3.268-2a1 1 0 000-1.95l-3.268-2z"
              clipRule="evenodd"
            />
          </svg>

        )}
      </div>
    </div>
  );
}