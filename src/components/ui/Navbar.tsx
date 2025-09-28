"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Obtenemos sesión al montar
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setUsername(
        user?.user_metadata?.username || user?.email?.split("@")[0] || null
      );
    };

    getUser();

    // Escuchamos cambios de auth
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] bg-[rgba(10,16,38,0.95)] shadow-md z-10 flex items-center px-5">
      {/* LOGO (Izquierda) */}
      <div className="flex-shrink-0">
        <Link href={user ? "/inicio" : "/"}>
          <Image
            src="/Logo-Definitivo.png"
            alt="SoundWave Logo"
            width={40}
            height={40}
            priority
            className="rounded-full"
          />
        </Link>
      </div>

      {/* LINKS CENTRADOS */}
      <nav className="flex-1 flex justify-center space-x-4 ml-70">
        {user && ( // 👈 Solo mostramos si hay sesión
          <>
            <Link
              href="/inicio"
              className="text-white hover:text-purple-400 transition"
            >
              Inicio
            </Link>
            <Link
              href="/biblioteca"
              className="text-white hover:text-purple-400 transition"
            >
              Biblioteca
            </Link>
          </>
        )}
      </nav>

      {/* BOTONES / USUARIO (Derecha) */}
      <div className="flex-shrink-0 flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-purple-300 font-semibold">
              Hola, {username || "Usuario"}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-full transition"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white px-5 py-2 rounded-full font-medium text-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
                Iniciar sesión
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-purple-600 text-white hover:bg-purple-700 px-5 py-2 rounded-full font-medium text-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-lg">
                Crear cuenta
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
