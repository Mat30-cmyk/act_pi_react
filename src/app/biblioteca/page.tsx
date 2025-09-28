'use client';

import React, { useState, useEffect } from "react";
import { CardContainer, CardBody, CardItem } from "@/src/components/ui/3d-card";
import { createClient } from "@/src/utils/supabase/client";
import { Playlist } from '@/types';
import CreatePlaylistModal from '@/src/components/Playlist/CreatePlaylistModal';
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useAuthRedirect } from "@/src/hooks/useAuthRedirect";


export default function BibliotecaPage() {
  const loadingAuth = useAuthRedirect(); // 👈 Protege la ruta
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserAndPlaylists = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!user) {
        setUserId(null);
        setPlaylists([]);
        setLoading(false);
        return;
      }

      setUserId(user.id);
      await fetchPlaylists(user.id);
    };

    fetchUserAndPlaylists();
  }, []);

  const fetchPlaylists = async (supabaseUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select(`*, songs (*)`)
        .eq('user_id', supabaseUserId);

      if (error) {
        setError(error.message);
        setPlaylists([]);
      } else {
        setPlaylists(data || []);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setPlaylists((prev) => [...prev, newPlaylist]);
    setShowCreatePlaylistModal(false);
  };

  if (!userId) {
    return <div className="text-white text-center mt-8">Por favor, inicia sesión para ver tus playlists.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1026] to-[#1a0033] text-white p-6">
      <h1 className="text-5xl font-extrabold text-center mb-12 tracking-tight drop-shadow-lg">
        Tu Biblioteca 🎶
      </h1>

      {/* Grid de playlists */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl animate-pulse h-56" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center text-gray-400 text-xl mt-10">
          No tienes playlists creadas. ¡Crea una ahora!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {playlists.map((playlist) => (
            <motion.div
              key={playlist.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CardContainer className="inter-var cursor-pointer">
                <CardBody className="bg-gray-900 relative group/card border w-auto sm:w-[20rem] rounded-xl p-4 shadow-lg hover:shadow-purple-500/20 transition">
                  <CardItem translateZ="50" className="text-lg font-bold text-center">
                    {playlist.name}
                  </CardItem>
                  <CardItem translateZ="30" className="mt-4">
                    <Image
                      src={playlist.cover_image_url || '/placeholder-playlist-cover.jpg'}
                      alt={playlist.name || 'Cover de Playlist'}
                      width={300}
                      height={160}
                      className="rounded-lg w-full h-40 object-cover"
                    />
                  </CardItem>
                  <CardItem translateZ="20" className="mt-3 text-sm text-gray-400 text-center">
                    {playlist.description || 'Sin descripción.'}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>
      )}

      {/* Botón flotante para crear playlist */}
      <button
        onClick={() => setShowCreatePlaylistModal(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500"
      >
        <Plus size={24} className="text-white" />
      </button>

      {showCreatePlaylistModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreatePlaylistModal(false)}
          onPlaylistCreated={handlePlaylistCreated}
        />
      )}
    </div>
  );
}