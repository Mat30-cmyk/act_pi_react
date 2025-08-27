"use client";

import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { MusicPlayerProvider } from "../context/MusicPlayerContext";
import MusicPlayerControls from "../components/MusicPlayer/MusicPlayerControls";
import { createClient } from "../utils/supabase/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();

  // 🚨 en layout no se maneja estado, solo UI.
  // Los botones de login/register van a redirigir a las páginas /login y /register
  // donde implementaremos los formularios con Supabase.

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased custom-scrollbar-hide`}
      >
        <MusicPlayerProvider>
          {/* Navbar */}
          <header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "60px",
              background: "rgba(10,16,38,0.95)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/Logo-Definitivo.png"
                alt="SoundWave Logo"
                width={40}
                height={40}
                priority={true}
                className="rounded-full mr-2"
              />
            </Link>

            {/* Nav Links */}
            <nav
              style={{
                display: "flex",
                gap: "40px",
                justifyContent: "center",
                alignItems: "center",
                flex: 2,
              }}
            >
              <Link
                href="/inicio"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                }}
              >
                Inicio
              </Link>
              <Link
                href="/biblioteca"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                }}
              >
                Biblioteca
              </Link>
            </nav>

            {/* Botones de Auth con Supabase */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <button
                  className="
                    bg-transparent border border-purple-500 text-purple-400
                    hover:bg-purple-600 hover:text-white
                    px-5 py-2 rounded-full font-medium text-lg
                    transition-all duration-300 ease-in-out
                    shadow-md hover:shadow-lg
                  "
                >
                  Iniciar sesión
                </button>
              </Link>
              <Link href="/register">
                <button
                  className="
                    bg-purple-600 text-white
                    hover:bg-purple-700
                    px-5 py-2 rounded-full font-medium text-lg
                    transition-all duration-300 ease-in-out
                    shadow-md hover:shadow-lg
                  "
                >
                  Crear cuenta
                </button>
              </Link>
            </div>
          </header>

          {/* Contenido */}
          <div style={{ paddingTop: "60px" }}>{children}</div>
          <div id="modal-root"></div>
          <MusicPlayerControls />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}