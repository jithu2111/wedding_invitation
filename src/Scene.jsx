import { Suspense, useRef } from 'react';
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
  
  // Ganesh scale based on width — looks good on all phones
  const ganeshaScale = isMobile ? Math.min(viewport.width * 1.1, 4) : 3.5;
  // Slightly above center
  const ganeshaY = 1 + viewport.height * 0.12;

  // Calculate where Ganesh bottom edge is as a % from top of screen
  // Camera at y=1, viewport spans from (1 - vh/2) to (1 + vh/2)
  // Screen top = 1 + vh/2, so % from top = (screenTop - worldY) / vh
  const ganeshaBottomY = ganeshaY - ganeshaScale / 2;
  const ganeshaBottomPct = ((1 + viewport.height / 2) - ganeshaBottomY) / viewport.height * 100;
  // Names start a small gap below the Ganesh bottom
  const namesTopPct = ganeshaBottomPct + 3;

  return (
    <>
      {/* Environment / Background */}
      <color attach="background" args={['#1a0f00']} />
      
      {/* Global Lighting */}
      <ambientLight intensity={1.5} color="#ffd700" />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={2} 
        castShadow 
        color="#ffebd6" 
      />
      
      {/* Global Particles (Dense Fireflies) */}
      <Sparkles 
        count={1500} 
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
          {/* Page 1 Overlay — names pinned at 55% from top, consistent on all screens */}
          <div className="w-screen flex flex-col items-center text-center text-[#faf5f0]" style={{ position: 'absolute', top: `${namesTopPct}%` }}>
            <h1 className="uppercase text-[#ffd700]" style={{ fontSize: 'min(3vw, 1vh)', letterSpacing: '0.15em', fontWeight: 500, marginBottom: '2vh', maxWidth: '80vw', lineHeight: 1.6 }}>Together with our families, we invite you to celebrate our union as we embark on a journey of sacred love</h1>
            <h2 className="font-serif text-[#faf5f0] tracking-[0.08em]" style={{ fontSize: 'min(8vw, 5vh)', fontWeight: 500, textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>Bhargav</h2>
            <span className="italic font-serif text-[#d4af37]" style={{ fontSize: 'min(5vw, 3vh)', fontWeight: 300, margin: '0.8vh 0' }}>&amp;</span>
            <h2 className="font-serif text-[#faf5f0] tracking-[0.08em]" style={{ fontSize: 'min(8vw, 5vh)', fontWeight: 500, textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>Vaishnavi</h2>

            <div style={{ marginTop: '2vh', animation: 'nudge 2s ease-in-out infinite' }}>
              <ChevronsDown size={28} color="#d4af37" strokeWidth={1.5} />
            </div>
          </div>

          {/* Page 2 Overlay */}
          <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-8 text-[#faf5f0] pointer-events-none" style={{ position: 'absolute', top: '100vh' }}>
            <p className="text-xl md:text-2xl font-serif italic max-w-lg drop-shadow-md leading-relaxed">
              "Two souls, one path..."
            </p>
          </div>

          {/* Page 3 Overlay */}
          <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-8 text-[#faf5f0]" style={{ position: 'absolute', top: '200vh' }}>
            <h3 className="text-3xl md:text-5xl font-serif mb-6 text-[#d4af37]">The Celebration</h3>
            <div className="bg-[#1a0f00]/60 backdrop-blur-sm p-8 rounded-lg border border-[#d4af37]/30 shadow-2xl">
              <p className="text-lg md:text-xl font-bold mb-2">Muhurtham</p>
              <p className="mb-6 opacity-80">Sunday, 24th October 2026<br/>10:30 AM Onwards</p>
              
              <p className="text-lg md:text-xl font-bold mb-2">Venue</p>
              <p className="opacity-80 leading-relaxed">
                The Grand Palace Gardens<br/>
                Hyderabad, Telangana
              </p>
            </div>
            <p className="mt-12 text-sm tracking-widest uppercase text-[#d4af37] animate-pulse">
              We look forward to seeing you
            </p>
          </div>
        </Scroll>
      </ScrollControls>
    </>
  );
}
