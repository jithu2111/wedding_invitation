import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import AudioPlayer from './components/AudioPlayer';

function App() {
  return (
    <div className="relative w-screen h-screen">
      <AudioPlayer />
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 1, 5], fov: 60 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
