import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { MusicPlayerProvider } from "../context/MusicPlayerContext";
import MusicPlayerControls from "../components/MusicPlayer/MusicPlayerControls";
import Navbar from "@/src/components/ui/Navbar";

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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased custom-scrollbar-hide`}
      >
        <MusicPlayerProvider>
          <Navbar />

          <main className="pt-[60px]">{children}</main>

          <div id="modal-root"></div>

          <MusicPlayerControls />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
