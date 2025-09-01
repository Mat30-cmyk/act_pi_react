import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Song } from '@/types';

interface MusicPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  setPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
  togglePlayPause: () => void;
  playSong: (song: Song, newPlaylist?: Song[]) => void;
  playNextSong: () => void  ;
  playPreviousSong: () => void;
  seek: (time: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  duration: number;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  clearCurrentSong: () => void;
  isPlayerOpen: boolean;
  setIsPlayerOpen: (open: boolean) => void;

}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [volume, setVolumeState] = useState<number>(1); 
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTimeState] = useState<number>(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

    
  useEffect(() => {
    audioRef.current = new Audio();
    
    audioRef.current.addEventListener('ended', playNextSong);
    
    audioRef.current.addEventListener('loadedmetadata', () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
        setCurrentTimeState(audioRef.current.currentTime);
      }
    });
    
    audioRef.current.addEventListener('timeupdate', () => {
      if (audioRef.current) {
        setCurrentTimeState(audioRef.current.currentTime);
      }
    });

    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', playNextSong);
        audioRef.current.removeEventListener('loadedmetadata', () => {}); 
        audioRef.current.removeEventListener('timeupdate', () => {}); 
        audioRef.current.pause();
        audioRef.current.src = ''; 
      }
    };
  }, []); 

  
  useEffect(() => {
    if (audioRef.current) {
      if (currentSong && audioRef.current.src !== currentSong.audio) { 
        audioRef.current.src = currentSong.audio; 
        audioRef.current.load(); 
      }

      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error al reproducir la canción:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]); 


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]); 


  const playSong = useCallback((song: Song, newPlaylist?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (newPlaylist) {
      setPlaylist(newPlaylist);
    } else if (playlist.length === 0) {
      setPlaylist([song]);
    }
    
  }, [playlist, setPlaylist]);

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      setIsPlaying(prev => !prev);
    }
  }, [currentSong]);

  const playNextSong = useCallback(() => {
    if (playlist.length === 0 || !currentSong) {
      clearCurrentSong();
      return;
    }

    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
      playSong(playlist[currentIndex + 1]);
    } else {
    
      clearCurrentSong();
    }
  }, [playlist, currentSong, playSong]);

  const playPreviousSong = useCallback(() => {
    if (playlist.length === 0 || !currentSong) {
      clearCurrentSong();
      return;
    }

    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      playSong(playlist[currentIndex - 1]);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTimeState(0);
        setIsPlaying(true); 
      } else {
        clearCurrentSong();
      }
    }
  }, [playlist, currentSong, playSong]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTimeState(time);
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    
  }, []);

  const clearCurrentSong = useCallback(() => {
    setCurrentSong(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setDuration(0);
    setCurrentTimeState(0);
  }, []);
 
  const value = React.useMemo(() => ({
    currentSong,
    isPlaying,
    playlist,
    setPlaylist,
    togglePlayPause,
    playSong,
    playNextSong,
    playPreviousSong,
    seek,
    volume,
    setVolume,
    duration,
    currentTime,
    setCurrentTime: setCurrentTimeState, 
    clearCurrentSong,
    isPlayerOpen, 
    setIsPlayerOpen
  
  }), [
    currentSong,
    isPlaying,
    playlist,
    setPlaylist,
    togglePlayPause,
    playSong,
    playNextSong,
    playPreviousSong,
    seek,
    volume,
    setVolume,
    duration,
    currentTime,
    clearCurrentSong,
    isPlayerOpen,  
    setIsPlayerOpen

  ]);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};