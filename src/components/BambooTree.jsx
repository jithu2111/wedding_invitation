export default function BambooTree(props) {
  return (
    <mesh castShadow {...props}>
      <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
      <meshStandardMaterial color="#2d4c1e" />
    </mesh>
  );
}
