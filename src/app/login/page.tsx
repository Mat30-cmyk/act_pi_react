"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const fakeEmail = `${username}@miapp.com`;

        const { error } = await supabase.auth.signInWithPassword({
            email: fakeEmail,
            password,
        });

        if (error) {
            setError("Usuario o contraseña incorrectos");
        } else {
            router.push("/inicio");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 via-black to-purple-900">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Iniciar sesión</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                    >Entrar</button>
                </form>
            </div>
        </div>
    );
}
