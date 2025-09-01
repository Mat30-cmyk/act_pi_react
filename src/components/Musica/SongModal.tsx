import React from 'react';
import { Song } from '@/types';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';

interface SongModalProps {
  song: Song;
  onClose: () => void;
}

export default function SongModal({ song, onClose }: SongModalProps) {
  const { playSong, isPlaying, togglePlayPause, currentSong, playlist, setPlaylist } = useMusicPlayer();

  const handlePlayButtonClick = () => {
    playSong(song, [song]);
  };

  const isCurrentAndPlaying = currentSong?.id === song.id && isPlaying;
  const isCurrentAndPaused = currentSong?.id === song.id && !isPlaying;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center text-white">
          <img
            src={song.cover_image_url}
            alt={song.title}
            className="w-48 h-48 rounded-md object-cover mb-4"
          />
          <h2 className="text-3xl font-bold mb-2 text-center">{song.title}</h2>
          <p className="text-lg text-gray-400">{song.name}</p>
          <p className="text-md text-gray-500 mt-1">{song.genre}</p>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={currentSong?.id === song.id ? togglePlayPause : handlePlayButtonClick}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 transition-colors shadow-lg flex items-center space-x-2"
            aria-label={isCurrentAndPlaying ? "Pausar" : "Reproducir"}
          >
            {isCurrentAndPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Pausar</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.025A1 1 0 0111 8v4a1 1 0 01-1.445.975l-3.268-2a1 1 0 010-1.95l3.268-2z" clipRule="evenodd" />
                </svg>
                <span>Reproducir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}