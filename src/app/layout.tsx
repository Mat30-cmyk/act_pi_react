"use client";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { MusicPlayerProvider } from "../context/MusicPlayerContext";
import MusicPlayer from "../components/MusicPlayer/MusicPlayerControls";
import MusicPlayerControls from "../components/MusicPlayer/MusicPlayerControls";


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


  return (
    <ClerkProvider>
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
              {/* Logo o Nombre de la App */}
              <Link href="/" className="flex items-center"> {/* Añade flex y items-center para centrar la imagen si es pequeña */}
                <Image
                  src="/Logo-Definitivo.png"
                  alt="SoundWave Logo"
                  width={40}
                  height={40}
                  priority={true}
                  className="rounded-full mr-2"
                />
              </Link>

              <SignedIn>
                <nav
                  style={{
                    display: "flex",
                    gap: "40px",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 2,
                  }}
                >
                  <Link href="/inicio"
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
              </SignedIn>

              <div className="flex items-center space-x-4">
                <SignedOut>
                  <Link href="/auth/login">
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
                  <Link href="/auth/register">
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
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <button
                      className="
                      bg-red-600 text-white
                      hover:bg-red-700
                      px-5 py-2 rounded-full font-medium text-lg
                      transition-all duration-300 ease-in-out
                      shadow-md hover:shadow-lg
                    "
                    >
                      Cerrar sesión
                    </button>
                  </SignOutButton>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10 border-2 border-purple-500", // Borde alrededor del avatar
                        userButtonPopoverCard: "bg-gray-800 text-white", // Fondo y texto del popover
                        userButtonPopoverFooter: "bg-gray-700", // Footer del popover
                        userButtonPopoverActionButton: "text-purple-300 hover:text-white", // Botones de acción en popover
                        userButtonPopoverActionButtonText: "text-white", // Texto de los botones
                        userButtonPopoverActionButtonIcon: "text-purple-300", // Iconos de los botones
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </header>
            <div style={{ paddingTop: "60px" }}>{children}</div>
            <div id="modal-root"></div>
            <MusicPlayerControls />
          </MusicPlayerProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}