import { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
  });
  
  return null;
}

export default function Scene() {
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
            {/* Page 1 (z=0): Ganesha Placeholder */}
            {/* Kept at 1:1 aspect ratio square, pushed up slightly */}
            <ImagePlane 
              texturePath="/images/ganesha.png" 
              position={[0, 2.5, 0]} 
              scale={[3.5, 3.5, 1]} 
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
          {/* Page 1 Overlay */}
          <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-8 text-[#faf5f0]" style={{ position: 'absolute', top: '0vh' }}>
            <h1 className="text-sm tracking-[0.3em] uppercase mb-4 text-[#d4af37]">You are invited</h1>
            <h2 className="text-5xl md:text-7xl font-serif mb-2 font-bold drop-shadow-md">Bhargav</h2>
            <span className="text-3xl italic font-serif text-[#d4af37] my-2">&amp;</span>
            <h2 className="text-5xl md:text-7xl font-serif mt-2 font-bold drop-shadow-md">Vaishnavi</h2>
            <p className="mt-8 text-sm md:text-base font-sans max-w-md mx-auto opacity-80">
              Join us in celebrating our beautiful beginning. Scroll down to begin the journey.
            </p>
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
