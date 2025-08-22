'use client';

import React, { useState, useEffect } from "react";
import { CardContainer, CardBody, CardItem } from "@/src/components/ui/3d-card";
import { supabase } from '@/src/utils/supabaseClient';
import { useUser } from '@clerk/nextjs';
import { Playlist } from '@/types';
import CreatePlaylistModal from '@/src/components/Playlist/CreatePlaylistModal';
import Image from "next/image";

export default function BibliotecaPage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState<boolean>(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            console.log('ID de usuario de Clerk actual:', user.id);
            fetchPlaylists(user.id);
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
            setPlaylists([]);
        }
    }, [isLoaded, isSignedIn, user]);

    const fetchPlaylists = async (clerkUserId: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('playlists')
                .select(`
                    *,
                    songs (
                        *
                    )
                `)
                .eq('user_id', clerkUserId);

            if (fetchError) {
                console.error('Error fetching playlists:', fetchError);
                setError(fetchError.message);
                setPlaylists([]);
            } else {
                setPlaylists(data || []);
            }
        } catch (err: unknown) { // Corrected: Changed 'any' to 'unknown'
            let errorMessage = 'Error inesperado al cargar las playlists.';
            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            console.error('Unexpected error fetching playlists:', err);
            setError(errorMessage);
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistCreated = (newPlaylist: Playlist) => {
        setPlaylists((prev) => [...prev, newPlaylist]);
        setShowCreatePlaylistModal(false);
    };

    if (loading) {
        return <div className="text-white text-center mt-8">Cargando playlists...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
    }

    if (!isSignedIn) {
        return <div className="text-white text-center mt-8">Por favor, inicia sesión para ver tus playlists.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1026] to-[#1a0033] text-white p-8">
            <h1 className="text-5xl font-extrabold text-center mb-12 drop-shadow-lg">
                Tu Biblioteca de Playlists
            </h1>

            <div className="text-center mb-8">
                <button
                    onClick={() => setShowCreatePlaylistModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50"
                >
                    + Crear Nueva Playlist
                </button>
            </div>

            {playlists.length === 0 && !loading && (
                <p className="text-center text-gray-400 text-xl mt-10">
                    No tienes playlists creadas. ¡Crea una ahora!
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {playlists.map((playlist) => (
                    <CardContainer key={playlist.id} className="inter-var">
                        <CardBody className="bg-gray-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                            <CardItem
                                translateZ="50"
                                className="text-xl font-bold text-white text-center"
                            >
                                {playlist.name}
                            </CardItem>
                            <CardItem translateZ="30" className="w-full mt-4">
                                <Image
                                    src={playlist.cover_image_url || '/placeholder-playlist-cover.jpg'}
                                    alt={playlist.name || 'Cover de Playlist'}
                                    width={400}
                                    height={200}
                                    className="rounded-lg w-full h-40 object-cover mb-4"
                                    priority={false}
                                />
                            </CardItem>
                            <CardItem translateZ="20" className="mt-2">
                                <p className="text-sm text-gray-400 text-center">
                                    {playlist.description || 'Sin descripción.'}
                                </p>
                            </CardItem>
                            <CardItem translateZ="20" className="mt-4 flex justify-center">
                                <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                    Ver Playlist ({playlist.songs?.length || 0})
                                </button>
                            </CardItem>
                        </CardBody>
                    </CardContainer>
                ))}
            </div>

            {showCreatePlaylistModal && (
                <CreatePlaylistModal
                    onClose={() => setShowCreatePlaylistModal(false)}
                    onPlaylistCreated={handlePlaylistCreated}
                />
            )}
        </div>
    );
}