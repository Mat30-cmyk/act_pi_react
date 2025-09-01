import React from 'react';
import { Song } from '@/types';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';
import { MusicalNoteSolid } from '@heroicons/react/20/solid'; // Importa el icono
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-purple-400 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 0H6a3 3 0 00-3 3v2a3 3 0 003 3h2M12 4v10m6-2V8m-6 4L9 19"
            />
          </svg>
        </div>
      )}
    </div>
  );
}