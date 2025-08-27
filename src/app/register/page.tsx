"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [nombre, setNombre] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        const fakeEmail = `${username}@miapp.com`;

        const { error } = await supabase.auth.signUp({
            email: fakeEmail,
            password,
            options: {
                data: {
                    nombre,
                    apellidos,
                    username,
                },
            },
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-900 via-gray-900 to-black">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Registro</h1>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <input type="password" placeholder="Repite contraseña" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}
