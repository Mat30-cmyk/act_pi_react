'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';
import Image from 'next/image';

export default function MusicPlayerControls() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNextSong,
    playPreviousSong,
    clearCurrentSong,
    volume,
    setVolume,
    duration,
    currentTime,
    setCurrentTime,
    seek,
  } = useMusicPlayer();

  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const whilePlaying = useCallback(() => {
    if (progressBarRef.current) {
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty('--seek-before-width', `${(currentTime / duration) * 100}%`);
    }
    animationRef.current = requestAnimationFrame(whilePlaying);
  }, [currentTime, duration]);


  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (currentSong && isPlaying) {
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentSong, isPlaying, whilePlaying]);

  const handleProgressBarChange = useCallback(() => {
    if (progressBarRef.current) {
      const newTime = parseFloat(progressBarRef.current.value);
      seek(newTime);
    }
  }, [seek]);

  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!currentSong) {
        return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between z-50 shadow-lg">
      <div className="flex items-center space-x-4">
        {currentSong.cover_image_url ? (
          <Image
            src={currentSong.cover_image_url}
            alt={currentSong.title}
            width={50}
            height={50}
            className="rounded-md object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
            🎶
          </div>
        )}
        <div>
          <p className="text-lg font-semibold">{currentSong.title}</p>
          <p className="text-sm text-gray-400">{currentSong.name}</p>
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow mx-4">
        <div className="flex items-center space-x-4 mb-2">
          <button onClick={playPreviousSong} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={togglePlayPause} className="text-purple-500 hover:text-purple-400">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button onClick={playNextSong} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex items-center w-full max-w-lg">
          <span className="text-xs text-gray-400 mr-2">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="custom-range w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            min="0"
            max={duration}
            value={currentTime}
            ref={progressBarRef}
            onChange={handleProgressBarChange}
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${
                (currentTime / duration) * 100
              }%, #4B5563 ${(currentTime / duration) * 100}%, #4B5563 100%)`,
            }}
          />
          <span className="text-xs text-gray-400 ml-2">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-32">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464A7.989 7.989 0 0118 10c0 1.487-.812 2.801-2.036 3.464M14.021 15.596a7.989 7.989 0 01-4.04-1.158M7.5 10.5h.001m.001 3.5h.001M12 15a4 4 0 00-4 4h8a4 4 0 00-4-4zM12 4V3m0 18v-1m-4.5-4.5L7 17l-1.5-1.5M15.5 15.5L17 17l1.5-1.5" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeSliderChange}
          className="custom-range-volume w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <style jsx>{`
        .custom-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B5CF6; /* Tailwind purple-500 */
          cursor: pointer;
          border: 2px solid #C4B5FD; /* Tailwind purple-200 */
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3); /* Ring effect */
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .custom-range::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #C4B5FD;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.3);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .custom-range-volume::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #A78BFA; /* Tailwind purple-400 */
          cursor: pointer;
          border: 2px solid #C4B5FD;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .custom-range-volume::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #A78BFA;
          cursor: pointer;
          border: 2px solid #C4B5FD;
          box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.3);
          transition: background 0.2s ease, transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}