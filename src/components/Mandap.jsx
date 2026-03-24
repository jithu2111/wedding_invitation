/*
  INSTRUCTIONS FOR 3D MODEL:
  1. Place 'mandap.glb' in the `public/models/` directory
  2. Swap this placeholder logic for the real model:
  
  export default function Mandap(props) {
    const { scene } = useGLTF('/models/mandap.glb');
    return <primitive object={scene} {...props} />;
  }
*/

export default function Mandap(props) {
  return (
    <group {...props}>
      {/* 4 Pillars Placeholder */}
      <mesh position={[-2, 1.5, -2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[2, 1.5, -2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[-2, 1.5, 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[2, 1.5, 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
    </group>
  );
}
