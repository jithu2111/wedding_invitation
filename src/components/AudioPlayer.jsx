import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play might be blocked by browsers, so we start muted or false
  // and let the user interact to unmute/play
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Playback prevented', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[9999] pointer-events-auto">
      <audio 
        ref={audioRef}
        src="/audio/wedding-flute.mp3" // Placholder path
        loop 
        preload="auto"
      />
      
      <button 
        onClick={togglePlay}
        className="bg-[#1a0f00]/60 backdrop-blur-md rounded-full p-3 border border-[#d4af37]/30 shadow-lg text-[#d4af37] transition-all hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
        aria-label="Toggle Audio"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M4.51 8.25l1.938-1.354A9.01 9.01 0 012.25 12c0 .83.112 1.633.322 2.396.234.847 1.058 1.354 1.938 1.354H6.75l4.72 4.72a.75.75 0 001.28-.53V4.06a.75.75 0 00-1.28-.53L6.75 8.25H4.51z" />
          </svg>
        )}
      </button>
    </div>
  );
}
