'use client';

import { useState } from 'react';
import { createClient } from "../../../utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError('Correo o contraseña incorrectos');
            setLoading(false);
            return;
        }

        setLoading(false);
        router.push('/inicio');
        router.refresh();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-black to-purple-900">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Iniciar Sesión</h1>

                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {loading ? 'Iniciando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
