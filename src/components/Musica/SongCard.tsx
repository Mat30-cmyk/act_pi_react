import React from 'react';
import { Song } from '@/types';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';
import { MusicalNoteSolid } from '@heroicons/react/20/solid'; // Importa el icono
import { Music2 } from "lucide-react";

interface SongCardProps {
song: Song;
onSelectSong: (song: Song) => void;
mode?: "openModal" | "playOnly";
}

export default function SongCard({ song, onSelectSong, mode = "openModal" }: SongCardProps) {
const { playSong, currentSong, setPlaylist, playlist: globalPlaylist } = useMusicPlayer();

const handleCardClick = () => {
if (mode === "openModal") {
onSelectSong(song);
} else if (mode === "playOnly") {
playSong(song, globalPlaylist.length > 0 ? globalPlaylist : [song]);
}
};

const isCurrent = currentSong?.id === song.id;

  return (
    <div
      className={`relative group cursor-pointer p-2 rounded-lg shadow-lg transition-all duration-300 transform max-w-[120px]
        ${isCurrent ? 'bg-purple-800 scale-105 border border-purple-500' : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'}`}
      onClick={handleCardClick}
    >
      <div
        className="w-24 h-24 bg-gray-700 rounded-md overflow-hidden mb-2 mx-auto"
      >
        {song.cover_image_url ? (
          <img
            src={song.cover_image_url}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
            🎵
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-white truncate">{song.title}</p>
        <p className="text-xs text-gray-400 truncate">{song.name}</p>
      </div>

      {isCurrent && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
         <Music2 className="h-12 w-12 text-purple-400 animate-pulse" />
        </div>
      )}
    </div>
  );
}