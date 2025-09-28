'use client';

import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface UserNavProps {
  user: User;
  username: string;
  onSignOut: () => void;
}

export default function UserNav({ user, username, onSignOut }: UserNavProps) {
  return (
    <nav className="flex items-center space-x-6 text-white">
      {/* LINKS DE NAVEGACIÓN */}
      <Link href="/inicio" className="hover:text-purple-400 transition">
        Inicio
      </Link>
      <Link href="/biblioteca" className="hover:text-purple-400 transition">
        Biblioteca
      </Link>

      {/* NOMBRE DE USUARIO */}
      <span className="font-semibold text-purple-300">
        Hola, {username || user.email}
      </span>

      {/* BOTÓN DE CERRAR SESIÓN */}
      <button
        onClick={onSignOut}
        aria-label="Cerrar sesión"
        className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded-full transition"
      >
        Cerrar Sesión
      </button>
    </nav>
  );
}
