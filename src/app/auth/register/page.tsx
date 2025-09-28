'use client';

import { useState } from 'react';
import { createClient } from "../../../utils/supabase/client"; 
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // ✨ NUEVO ESTADO para el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Limpiar mensaje previo
    setLoading(true);

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // ⭐ AJUSTE CLAVE AQUÍ:
    // Si el usuario existe (registro exitoso), mostramos el mensaje.
    // Supabase NO inicia sesión automáticamente sin la verificación por email.
    if (user) {
      setSuccessMessage('¡Registro exitoso! Por favor, revisa tu correo electrónico para confirmar tu cuenta y luego inicia sesión.');
      
      // Opcional: limpiar los campos del formulario
      setEmail('');
      setPassword('');
      setUsername('');
      
      // NO Hacemos router.push('/auth/login') inmediatamente.
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-purple-900 via-gray-900 to-black">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Registro</h1>

        {/* ⭐ RENDERIZADO CONDICIONAL: Si hay mensaje de éxito, se muestra en lugar del formulario */}
        {successMessage ? (
          <div className="text-center p-4 bg-green-900/50 rounded-lg">
            <p className="text-green-400 font-semibold">{successMessage}</p>
            <button
               onClick={() => router.push('/auth/login')}
               className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
               Ir a Iniciar Sesión
            </button>
          </div>
        ) : (
          /* El formulario solo se muestra si NO hay mensaje de éxito */
          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
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
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}