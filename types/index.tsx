// types.ts (Example, adjust if yours is different)
export interface Song {
  id: string;
  title: string;
  audio: string; // URL al archivo de audio
  cover_image_url: string; // URL a la imagen de la canción
  genre: string;
  artist_id: string;
  name: string; // Nombre del artista
}

export interface Artist {
  id: string;
  name: string;
  image: string; // URL a la imagen del artista
  bio: string;
  songs: Song[]; // Array de canciones anidadas
}

export interface mixes {
    id: string;
    name: string;
    cover_image_url: string;
    genero: string;
    audio_url: string;
    description: string;
    songs: Song[]; // Si un mix también tiene canciones, asegúrate de que esté aquí
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  user_id: string;
  songs: Song[];
  created_at: string;
}