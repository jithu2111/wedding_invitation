export default function Diya(props) {
  return (
    <mesh castShadow {...props}>
      <cylinderGeometry args={[0.3, 0.1, 0.2, 16]} />
      <meshStandardMaterial color="#d4af37" />
      <pointLight position={[0, 0.2, 0]} intensity={2} color="#ffaa00" distance={5} />
    </mesh>
  );
}
