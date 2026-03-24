import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const hasInteracted = useRef(false);

  // Auto-play on page load, fallback to first user interaction
  useEffect(() => {
    const tryPlay = () => {
      if (hasInteracted.current || !audioRef.current) return;
      hasInteracted.current = true;
      audioRef.current.play()
        .then(() => setIsMuted(false))
        .catch(() => {
          hasInteracted.current = false;
        });
    };

    // Try immediate autoplay
    tryPlay();

    // Fallback: listen for any user interaction
    const events = ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown'];
    events.forEach(evt => document.addEventListener(evt, tryPlay, { once: true, capture: true }));

    return () => {
      events.forEach(evt => document.removeEventListener(evt, tryPlay, { capture: true }));
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play()
          .then(() => setIsMuted(false))
          .catch(e => console.log('Playback prevented', e));
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="absolute top-4 right-6 z-[9999] pointer-events-auto">
      <audio
        ref={audioRef}
        src="/audio/wedding-flute.mp3"
        loop
        preload="auto"
      />

      <button
        onClick={toggleMute}
        className="rounded-full p-[7px] border border-[#ffd700] text-[#ffd700] bg-black/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
        aria-label="Toggle Audio"
      >
        {!isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M4.51 8.25l1.938-1.354A9.01 9.01 0 012.25 12c0 .83.112 1.633.322 2.396.234.847 1.058 1.354 1.938 1.354H6.75l4.72 4.72a.75.75 0 001.28-.53V4.06a.75.75 0 00-1.28-.53L6.75 8.25H4.51z" />
          </svg>
        )}
      </button>
    </div>
  );
}