import { useRef, useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ImagePlane({ texturePath, position, scale, opacity = 1, fadeStart = 10, fadeEnd = 20 }) {
  const texture = useTexture(texturePath);
  const materialRef = useRef();
  const meshRef = useRef();

  // Dispose GPU texture memory when this plane unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (texture) texture.dispose();
    };
  }, [texture]);

  // Distance-based fade: planes fade in as camera approaches and fade out as it recedes
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