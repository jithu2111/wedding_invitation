/*
  INSTRUCTIONS FOR 3D MODEL:
  1. Find a beautiful Ganesha 3D model (.glb format)
  2. Place it in the `public/models/` directory as `ganesha.glb`
  3. Swap this component to use the GLTF model:
  
  export default function Ganesha(props) {
    const { scene } = useGLTF('/models/ganesha.glb');
    return <primitive object={scene} {...props} />;
  }
*/

export default function Ganesha(props) {
  return (
    <mesh position={[0, 1.5, 0]} castShadow {...props}>
      <boxGeometry args={[1, 1.5, 0.2]} />
      <meshStandardMaterial color="#8b0000" />
    </mesh>
  );
}
