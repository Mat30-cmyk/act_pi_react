'use client';
import { useState, useRef, useEffect } from 'react';
import { Song } from '@/types';

interface SongItemProps {
  song: Song;
}

export default function SongItem({ song }: SongItemProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = song.audio;
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [song.audio, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (!audioRef.current.src || audioRef.current.src !== new URL(song.audio, window.location.origin).href) {
          audioRef.current.src = song.audio;
          audioRef.current.load();
        }
        audioRef.current.play().catch(e => console.error("Error al reproducir el audio:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="flex items-center justify-between p-3 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200"
      onClick={togglePlay}
    >
      <audio ref={audioRef} onEnded={handleEnded} />
      <span className="text-md font-medium text-gray-800">{song.title}</span>
      <button className="text-blue-600 hover:text-blue-800 focus:outline-none">
      </button>
    </div>
  );
}