import { Suspense } from 'react';
import { ChevronsDown } from 'lucide-react';
import { useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import ImagePlane from './components/ImagePlane';

function CameraController() {
  const scroll = useScroll();
  
  useFrame((state, delta) => {
    // scroll.offset goes from 0 (top) to 1 (bottom)
    // Map offset 0->1 to Z-position 5->-25
    const targetZ = 5 - (scroll.offset * 30);
    // Smoothly animate the camera's Z position
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 4, delta);
    // Always look straight ahead at camera's own Y level — prevents downward angle on tall screens
    state.camera.lookAt(0, 1, state.camera.position.z - 1);
  });
  
  return null;
}

export default function Scene() {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  
  // Ganesh scale capped tighter so the image doesn't push its bottom edge too
  // far down the screen — especially critical on wide-aspect devices (iPad,
  // desktop, iPhone SE) where the old cap of 4 / 3.5 consumed >70% of the
  // viewport height and left insufficient room for the text block below it.
  // Scale slightly reduced from original (1.1/4 → 1.0/3.5) to prevent overflow on small phones
  const ganeshaScale = isMobile ? Math.min(viewport.width * 1.0, 3.5) : 3.5;
  const ganeshaY = 1 + viewport.height * 0.12;

  // Calculate where Ganesh bottom edge is as a % from top of screen.
  const ganeshaBottomY = ganeshaY - ganeshaScale / 2;
  const ganeshaBottomPct = ((1 + viewport.height / 2) - ganeshaBottomY) / viewport.height * 100;

  return (
    <>
      {/* Environment / Background */}
      <color attach="background" args={['#1a0f00']} />
      
      {/* Global Lighting */}
      <ambientLight intensity={1.5} color="#ffd700" />
      <directionalLight
        position={[10, 20, 5]}
        intensity={2}
        color="#ffebd6"
      />
      
      {/* Global Particles (Fireflies) — count throttled on mobile to preserve frame rate */}
      <Sparkles
        count={isMobile ? 600 : 1200}
        scale={[15, 10, 40]}
        position={[0, 0, -15]}
        size={3}
        color="#ffd700"
        speed={0.2}
        opacity={0.8}
        noise={0.1}
      />

      <ScrollControls pages={3} damping={0.2}>
        <CameraController />
        
        {/* --- 2.5D PARALLAX WORLD --- */}
        <group>
          <Suspense fallback={null}>
            {/* Page 1 (z=0): Ganesha — renders on canvas behind HTML overlay */}
            <ImagePlane
              texturePath="/images/ganesha.png"
              position={[0, ganeshaY, 0]}
              scale={[ganeshaScale, ganeshaScale, 1]}
              fadeStart={5}
              fadeEnd={15}
            />

            {/* Page 2 (Journey - z=-5 to z=-20): Floral Arch Borders */}
            {/* Positioned overhead hanging down acting like archways */}
            <ImagePlane texturePath="/images/leaf-border.png" position={[0, 4, -8]} scale={[9, 9, 1]} fadeStart={5} fadeEnd={15} />
            <ImagePlane texturePath="/images/leaf-border.png" position={[0, 4, -16]} scale={[9, 9, 1]} fadeStart={5} fadeEnd={15} />
            <ImagePlane texturePath="/images/leaf-border.png" position={[0, 4, -22]} scale={[9, 9, 1]} fadeStart={5} fadeEnd={15} />

            {/* Page 3 (z=-28): Mandap */}
            {/* Massively scaled to fill the background nicely arriving at z=-28 */}
            <ImagePlane 
              texturePath="/images/mandap.png" 
              position={[0, 1.5, -28]} 
              scale={[8, 8, 1]} 
              fadeStart={10}
              fadeEnd={25}
            />
          </Suspense>
        </group>

        {/* --- HTML OVERLAYS --- */}
        <Scroll html style={{ width: '100%', height: '100%' }}>
          {/* Page 1 Overlay — full viewport, content anchored between Ganesha bottom and screen bottom */}
          <div className="w-screen h-screen flex flex-col items-center text-center text-[#faf5f0]" style={{ position: 'absolute', top: 0 }}>
            {/* Spacer — clears Ganesha */}
            <div style={{ height: `${ganeshaBottomPct}%`, flexShrink: 0 }} />

            {/* Quote + names grouped, centered in remaining space */}
            <div className="flex flex-col items-center justify-center" style={{ flex: '1 1 0', minHeight: 0 }}>
              <h1 className="uppercase text-[#ffd700]" style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', letterSpacing: '0.15em', fontWeight: 500, maxWidth: '80vw', lineHeight: 1.6 }}>Together with our families, we invite you to celebrate our union as we embark on a journey of sacred love</h1>

              <div style={{ height: '1.5vh' }} />

              <h2 className="font-serif text-[#faf5f0] tracking-[0.08em]" style={{ fontSize: 'clamp(28px, 7vw, 44px)', fontWeight: 500, textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>Bhargav</h2>
              <p className="text-[#d4af37]/80" style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', letterSpacing: '0.05em', maxWidth: '80vw' }}>Elder Son of Smt. &amp; Sri Channa Sridevi - Gopinath</p>
              <span className="italic font-serif text-[#d4af37]" style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 300 }}>&amp;</span>
              <h2 className="font-serif text-[#faf5f0] tracking-[0.08em]" style={{ fontSize: 'clamp(28px, 7vw, 44px)', fontWeight: 500, textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>Vaishnavi</h2>
              <p className="text-[#d4af37]/80" style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', letterSpacing: '0.05em', maxWidth: '80vw' }}>Elder Daughter of Smt. &amp; Sri Vidala Aruna - Upender, R/o. Suryapet</p>
            </div>

            {/* Bouncing arrow — always pinned near bottom of viewport */}
            <div style={{ paddingBottom: '3vh', animation: 'nudge 2s ease-in-out infinite' }}>
              <ChevronsDown size={28} color="#d4af37" strokeWidth={1.5} />
            </div>
          </div>

          {/* Page 2 Overlay */}
          <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-8 text-[#faf5f0] pointer-events-none" style={{ position: 'absolute', top: '100vh' }}>
            <p className="text-xl md:text-2xl font-serif italic max-w-lg drop-shadow-md leading-relaxed">
              "Two souls, one path..."
            </p>
          </div>

          {/* Page 3 Overlay — cards centered at 45% from top for consistent mandap alignment */}
          <div className="w-screen h-screen flex flex-col items-center text-center px-6 text-[#faf5f0]" style={{ position: 'absolute', top: '200vh' }}>
            {/* Push cards to ~45% from top — consistent across all phones */}
            <div style={{ height: '38%', flexShrink: 0 }} />

            {/* Single card: Wedding | divider | Reception side by side */}
            <div className="bg-[#1a0f00]/60 backdrop-blur-sm rounded-xl border border-[#d4af37]/30 shadow-2xl w-full max-w-lg flex items-stretch" style={{ padding: 'clamp(18px, 4vw, 32px)' }}>
              {/* Wedding */}
              <div className="flex-1 flex flex-col items-center">
                <p className="font-serif text-[#ffd700] tracking-widest uppercase" style={{ fontSize: 'clamp(11px, 2.8vw, 14px)', letterSpacing: '0.2em' }}>Wedding</p>
                <p className="font-serif text-[#faf5f0] mt-2" style={{ fontSize: 'clamp(14px, 3.5vw, 20px)', fontWeight: 500 }}>Sunday<br/>12th April 2026</p>
                <p className="text-[#d4af37] mt-1" style={{ fontSize: 'clamp(14px, 3.5vw, 20px)' }}>11:28 AM</p>
                <p className="text-[#faf5f0]/70 mt-1" style={{ fontSize: 'clamp(10px, 2.2vw, 12px)' }}>Lunch Follows</p>

                <div className="mt-3 opacity-60" style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', lineHeight: 1.5 }}>
                  Ravi Mahal Conventions<br/>Suryapet, Telangana
                </div>

                <a
                  href="https://maps.app.goo.gl/xqkPMP17iqPsMgGv6?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 text-xs text-[#ffd700] border border-[#ffd700]/40 rounded-full hover:bg-[#ffd700]/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Map
                </a>
              </div>

              {/* Vertical decorative divider */}
              <div className="flex flex-col items-center mx-3">
                <div className="flex-1 border-l border-[#d4af37]/30" />
                <span className="text-[#d4af37]/50 my-2" style={{ fontSize: '10px' }}>&#10022;</span>
                <div className="flex-1 border-l border-[#d4af37]/30" />
              </div>

              {/* Reception */}
              <div className="flex-1 flex flex-col items-center">
                <p className="font-serif text-[#ffd700] tracking-widest uppercase" style={{ fontSize: 'clamp(11px, 2.8vw, 14px)', letterSpacing: '0.2em' }}>Reception</p>
                <p className="font-serif text-[#faf5f0] mt-2" style={{ fontSize: 'clamp(14px, 3.5vw, 20px)', fontWeight: 500 }}>Monday<br/>13th April 2026</p>
                <p className="text-[#d4af37] mt-1" style={{ fontSize: 'clamp(14px, 3.5vw, 20px)' }}>7:00 p.m.<br/>onwards</p>

                <div className="mt-3 opacity-60" style={{ fontSize: 'clamp(11px, 2.5vw, 14px)', lineHeight: 1.5 }}>
                  ARC Gardens<br/>Rajiv Chowk, Miryalaguda
                </div>

                <a
                  href="https://maps.app.goo.gl/P91egNcbXAArLRgB6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 text-xs text-[#ffd700] border border-[#ffd700]/40 rounded-full hover:bg-[#ffd700]/10 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Map
                </a>
              </div>
            </div>

            <p className="mt-6 text-sm tracking-widest uppercase text-[#d4af37] animate-pulse">
              We look forward to seeing you
            </p>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  );
}
