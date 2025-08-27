'use client';

import React, { useState } from 'react';
import { Artist, Song } from '@/types';
import Image from 'next/image';
import PlaylistItem from '@/src/components/Musica/PlaylistItem';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';

interface ArtistModalProps {
  artist: Artist;
  onClose: () => void;
  searchQuery: string;
  onSelectSong: (song: Song) => void;
}

export default function ArtistModal({ artist, onClose, searchQuery, onSelectSong }: ArtistModalProps) {
  const filteredSongs = artist.songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { setPlaylist, playSong, playlist: globalPlaylist, setIsPlayerOpen } = useMusicPlayer();

  React.useEffect(() => {
    if (artist.songs && artist.songs.length > 0) {
      const artistSongIds = artist.songs.map(s => s.id).sort().join(',');
      const globalPlaylistIds = globalPlaylist.map(s => s.id).sort().join(',');

      if (artistSongIds !== globalPlaylistIds) {
         setPlaylist(artist.songs);
      }
    }
  }, [artist.songs, setPlaylist, globalPlaylist]);


  const handleSongPlay = (songToPlay: Song) => {
    playSong(songToPlay, artist.songs.length > 0 ? artist.songs : [songToPlay] );
    setIsPlayerOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
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

        <div className="flex flex-col items-center">
          <Image
            src={artist.image}
            alt={artist.name}
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover mb-4"
            unoptimized={true}
          />
          <h2 className="text-3xl font-bold text-white mb-2">{artist.name}</h2>
          <p className="text-gray-300 text-center mb-4">{artist.bio}</p>

          <h3 className="text-xl font-semibold text-white mb-4 mt-4">Canciones:</h3>
          <div className="w-full max-h-80 overflow-y-auto custom-scrollbar-hide px-2">
            {filteredSongs && filteredSongs.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {filteredSongs.map((song) => (
                  <PlaylistItem
                    key={song.id}
                    song={song}
                    onSelectSong={handleSongPlay}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No hay canciones asociadas o no coinciden con la búsqueda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}