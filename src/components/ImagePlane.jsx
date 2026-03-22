import { useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
  INSTRUCTIONS FOR 2.5D PARALLAX:
  Replace the placeholder transparent PNGs in `public/images/` 
  with your actual beautiful transparent elements!
*/

export default function ImagePlane({ texturePath, position, scale, opacity = 1, fadeStart = 10, fadeEnd = 20 }) {
  const texture = useTexture(texturePath);
  const materialRef = useRef();
  const meshRef = useRef();
  
  // Custom fade logic based on camera distance to prevent everything overlapping at once
  useFrame((state) => {
    if (materialRef.current && meshRef.current) {
      const distance = state.camera.position.distanceTo(meshRef.current.position);
      const fadeFactor = 1 - THREE.MathUtils.clamp((distance - fadeStart) / (fadeEnd - fadeStart), 0, 1);
      materialRef.current.opacity = opacity * fadeFactor;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow={false} receiveShadow={false}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        ref={materialRef}
        map={texture} 
        transparent={true} 
        side={THREE.DoubleSide} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}
