"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Artist, mixes, Song } from "@/types";
import Carousel from "@/src/components/Carousel";
import ArtistIcon from '@/src/components/Musica/ArtistIcon';
import ArtistModal from '@/src/components/Musica/ArtistModal';
import MixCard from '@/src/components/Mix/MixCard';
import MixModal from '@/src/components/Mix/MixModal';
import { supabase } from "@/src/utils/supabaseClient";
import SongCard from '@/src/components/Musica/SongCard';
import SongModal from '@/src/components/Musica/SongModal';
import { useMusicPlayer } from '@/src/context/MusicPlayerContext';

export default function HomePage() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedMix, setSelectedMix] = useState<mixes | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const { setPlaylist } = useMusicPlayer();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [mixes, setMixes] = useState<mixes[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        const { data: artistsData, error: artistsError } = await supabase
          .from('artists')
          .select('id, name, image, bio');

        if (artistsError) {
          setError(artistsError.message);
          setLoading(false);
          return;
        }

        const { data: songsData, error: songsError } = await supabase
          .from('songs')
          .select('*, artists(name)');

        if (songsError) {
          setError(songsError.message);
          setLoading(false);
          return;
        }

        const mappedSongs: Song[] = (songsData ?? []).map((song: any) => ({
          id: song.id,
          title: song.title,
          audio: song.audio,
          genre: song.genre,
          cover_image_url: song.cover_image_url,
          artist_id: song.artist_id,
          artist_name: song.artists ? song.artists.name : 'Unknown Artist',
          name: song.artists ? song.artists.name : 'Unknown Artist',
        }));
        setSongs(mappedSongs);

        const { data: mixesData, error: mixesError } = await supabase
          .from('mixes')
          .select('*');

        if (mixesError) {
          setError(mixesError.message);
          setLoading(false);
          return;
        }

        setArtists((artistsData ?? []).map(a => ({
          ...a,
          songs: mappedSongs.filter(song => song.artist_id === a.id)
        })));

        setMixes(mixesData ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

    useEffect(() => {
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const newFilteredSongs = songs.filter(song =>
          song.title.toLowerCase().includes(lowerCaseQuery) ||
          song.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredSongs(newFilteredSongs);
      
        const newFilteredArtists = artists.filter(
          (artist) =>
            artist.name.toLowerCase().includes(lowerCaseQuery) ||
            artist.songs.some((songs) =>
              songs.title.toLowerCase().includes(lowerCaseQuery))
        );
        setFilteredArtists(newFilteredArtists); 
      } else {
        setFilteredSongs([]);
        setFilteredArtists([]);
      }
    }, [searchQuery, songs, artists]);

    useEffect(() => {
      if (filteredSongs.length > 0 && searchQuery) {
        setPlaylist(filteredSongs);
      } else if (songs.length > 0 && !searchQuery) {
        setPlaylist(songs);
      }
    }, [filteredSongs, songs, searchQuery, setPlaylist]);


  return (
    <main
      className="min-h-screen p-4 pb-24 relative"
      style={{
        background: "linear-gradient(135deg, #0a1026 0%, #1a0033 100%)",
      }}
    >

      {loading && <div className="text-white text-center text-xl mt-20">Cargando...</div>}
      {error && <div className="text-red-500 text-center text-xl mt-20">Error: {error}</div>}

      {!loading && !error && (
        <>
          <header className="flex flex-col items-center justify-center py-8">
            <h1 className="text-6xl font-extrabold text-white leading-tight text-center">
              Tu <span className="text-purple-500">Música</span>, Tu Estilo
            </h1>
            <p className="mt-4 text-xl text-gray-300 text-center max-w-2xl">
              Descubre y reproduce las últimas canciones y mixes.
            </p>
          </header>

          <div className="mb-8 w-full max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Buscar canciones o artistas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
          </div>

                    {filteredArtists.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Artistas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredArtists.map((artist) =>(
                  <ArtistIcon
                  key={artist.id}
                  artist={artist}
                  isSelected={selectedArtist?.id === artist.id}
                  onSelectArtist={setSelectedArtist}
                  />
                ))}
              </div>
            </div>
          )}

          {searchQuery && (filteredSongs.length > 0 || filteredArtists.length > 0) && (
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-8 mt-8 text-white">Resultados de búsqueda</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSongs.map(song => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onSelectSong={setSelectedSong}
                    mode="openModal" 
                  />
                ))}
              </div>
            </div>
          )}

          {(!searchQuery || (filteredSongs.length === 0 && filteredArtists.length === 0)) && (
            <div>
              <center><h2 className="text-4xl font-bold mb-8 mt-16 text-white">Artistas</h2></center>
              <Carousel<Artist>
                items={artists ?? []}
                renderItem={(artist, isSelected) => (
                  <ArtistIcon artist={artist} isSelected={isSelected} onSelectArtist={setSelectedArtist} />
                )}
                itemWidth={160}
                selectedItemId={selectedArtist?.id || null}
                onSelectItemId={(id: string | null) => {
                  if (id === null) {
                    setSelectedArtist(null);
                  } else {
                    setSelectedArtist(artists.find(a => a.id === id) || null);
                  }
                  setSelectedMix(null);
                  setSelectedSong(null);
                }}
                autoScrollDuration={20}
                autoScrollEnabled={!selectedArtist && !selectedMix && !selectedSong && !isSearchFocused}
              />

              <center><h2 className="text-4xl font-bold mb-8 mt-16 text-white">Mixes Diarios</h2></center>
              <Carousel<mixes>
                items={mixes ?? []}
                renderItem={(mix, isSelected) => (
                  <MixCard mix={mix} isSelected={isSelected} onSelectMix={setSelectedMix} />
                )}
                itemWidth={160}
                selectedItemId={selectedMix?.id || null}
                onSelectItemId={(id: string | null) => {
                  if (id === null) {
                    setSelectedMix(null);
                  } else {
                    setSelectedMix(mixes.find(m => m.id === id) || null);
                  }
                  setSelectedArtist(null);
                  setSelectedSong(null);
                }}
                autoScrollDuration={30}
                autoScrollEnabled={!selectedArtist && !selectedMix && !selectedSong && !isSearchFocused}
              />
            </div>
          )}

          {selectedArtist && (
            <ArtistModal
              artist={selectedArtist}
              onClose={() => setSelectedArtist(null)}
              searchQuery={searchQuery}
              onSelectSong={() => {
              }}
            />
          )}

          {selectedMix && (
            <MixModal mix={selectedMix} onClose={() => setSelectedMix(null)} />
          )}

          {selectedSong && (
            <SongModal song={selectedSong} onClose={() => setSelectedSong(null)} />
          )}
        </>
      )}
    </main>
  );
}