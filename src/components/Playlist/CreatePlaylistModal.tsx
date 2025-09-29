'use client';

import React, { useState } from 'react';
import { createClient } from "@/src/utils/supabase/client";
import { Playlist } from '@/types';
import ReactDOM from 'react-dom';

interface CreatePlaylistModalProps {
    onClose: () => void;
    onPlaylistCreated: (newPlaylist: Playlist) => void;
}

export default function CreatePlaylistModal({ onClose, onPlaylistCreated }: CreatePlaylistModalProps) {
    const supabase = createClient();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('El nombre de la playlist no puede estar vacío.');
            return;
        }

        setLoading(true);
        try {
            // 1️⃣ Obtén el usuario desde Supabase
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError) throw userError;
            if (!user) {
                setError('Debes iniciar sesión para crear una playlist.');
                return;
            }

            console.log("🎯 Creando playlist para user_id:", user.id);

            // 2️⃣ Inserta en la tabla playlists
            const { data, error: supabaseError } = await supabase
                .from('playlists')
                .insert({
                    name,
                    description,
                    is_public: isPublic,
                    user_id: user.id, // 👈 importante para RLS
                })
                .select()
                .single();

            if (supabaseError) throw supabaseError;

            if (data) {
                console.log("✅ Playlist creada:", data);
                onPlaylistCreated(data as Playlist);
                onClose();
            } else {
                throw new Error('No se recibieron datos de la playlist creada.');
            }

        } catch (err: unknown) {
            let errorMessage = 'Error desconocido al crear la playlist.';
            if (err instanceof Error) errorMessage = err.message;
            console.error('❌ Error creating playlist:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Asegúrate de que exista un div#modal-root en tu _app.tsx o layout.tsx
    const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

    if (!modalRoot) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-purple-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Crear Nueva Playlist</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-white text-sm font-bold mb-2">
                            Nombre de la Playlist:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-white text-sm font-bold mb-2">
                            Descripción:
                        </label>
                        <textarea
                            id="description"
                            rows={3}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        ></textarea>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            disabled={loading}
                        />
                        <label htmlFor="isPublic" className="text-white text-sm font-bold">
                            Hacer playlist pública
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Playlist'}
                    </button>
                </form>
            </div>
        </div>,
        modalRoot
    );
}